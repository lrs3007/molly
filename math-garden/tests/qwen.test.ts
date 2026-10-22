import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { qwenPlan } from '../scripts/qwen-plan.ts';
import { installQwenPack, validateQwenPack, wavInfo } from '../scripts/qwen-pack.ts';
import { pcmToWav } from '../scripts/doubao-client.ts';
import type { AudioCatalog } from '../src/narration.ts';

const fixture = () => pcmToWav(Buffer.alloc(48000, 1));
function makePack(root: string) {
  const pack = join(root, 'pack'), project = join(root, 'project');
  mkdirSync(pack); mkdirSync(join(project, 'src'), { recursive: true });
  writeFileSync(join(project, 'src/audio-catalog.json'), 'ORIGINAL');
  const plan = qwenPlan();
  const catalog: AudioCatalog = { schema: 1, provider: plan.provider, model: plan.model, modelRevision: plan.modelRevision, speaker: plan.speaker, voiceLabel: plan.voiceLabel, entries: {} };
  for (const job of plan.jobs) {
    const wav = job.reuse ? readFileSync(`public${job.reuse.src}`) : fixture();
    const digest = createHash('sha256').update(wav).digest('hex');
    const src = `/audio/qwen3/012345abcdef/${job.id}.${digest.slice(0, 12)}.wav`;
    writeFileSync(join(pack, basename(src)), wav);
    catalog.entries[job.id] = { ...(job.reuse ?? {}), src, text: job.text, signature: job.signature, sha256: digest, duration: wavInfo(wav).duration, sampleRate: 24000 };
  }
  writeFileSync(join(pack, 'catalog.json'), JSON.stringify(catalog));
  writeFileSync(join(pack, 'index.html'), '<!doctype html><title>Test fixture review</title>');
  return { pack, project, catalog };
}
test('Qwen plan selects local 1.7B Serena with a stable identity and child-friendly Mandarin directions', () => {
  const plan = qwenPlan();
  assert.equal(plan.provider, 'qwen3-tts');
  assert.match(plan.model, /1.7B-CustomVoice-8bit$/);
  assert.equal(plan.speaker, 'serena');
  assert.equal(plan.jobs.length, 240);
  assert.equal(new Set(plan.jobs.map(j => j.id)).size, 240);
  assert.deepEqual(plan, qwenPlan());
  for (const job of plan.jobs) {
    assert.equal(job.language, 'Chinese');
    assert.ok(job.instruct.includes('标准普通话'));
    assert.ok(job.text.length < 400);
    assert.equal(job.tailSilenceMs, job.step === 2 ? 1200 : 450);
    assert.match(job.signature, /^[a-f0-9]{64}$/);
  }
});
test('WAV inspection supports extra metadata blocks and rejects silence or truncated media', () => {
  const wav = fixture();
  assert.deepEqual(wavInfo(wav), { sampleRate: 24000, channels: 1, bits: 16, duration: 1 });
  const metadata = Buffer.from([76, 73, 83, 84, 2, 0, 0, 0, 0, 0]);
  const withMetadata = Buffer.concat([wav.subarray(0, 36), metadata, wav.subarray(36)]);
  withMetadata.writeUInt32LE(withMetadata.length - 8, 4);
  assert.equal(wavInfo(withMetadata).duration, 1);
  assert.throws(() => wavInfo(wav.subarray(0, -3)), /不完整/);
  assert.throws(() => wavInfo(pcmToWav(Buffer.alloc(48000))), /静音/);
});
test('a complete Qwen pack atomically installs matching text and audio', () => {
  const root = mkdtempSync(join(tmpdir(), 'qwen-pack-test-'));
  try {
    const { pack, project } = makePack(root);
    assert.equal(validateQwenPack(pack).files.length, 240);
    const result = installQwenPack(pack, project);
    assert.equal(result.entries, 240);
    const installed = JSON.parse(readFileSync(join(project, 'src/audio-catalog.json'), 'utf8'));
    assert.equal(installed.provider, 'qwen3-tts');
    for (const entry of Object.values(installed.entries) as { src: string }[]) assert.ok(existsSync(join(project, `public${entry.src}`)));
    assert.ok(existsSync(join(project, `public${result.reviewPath}`)));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('a late stale transcript, incomplete pack or corrupt audio cannot activate a Qwen pack', () => {
  const root = mkdtempSync(join(tmpdir(), 'qwen-invalid-test-'));
  try {
    const { pack, project, catalog } = makePack(root);
    const key = 'unitfoodthree-1-5', original = { ...catalog.entries[key] };
    catalog.entries[key].text = '过期讲稿';
    writeFileSync(join(pack, 'catalog.json'), JSON.stringify(catalog));
    assert.throws(() => installQwenPack(pack, project), /讲稿或生成设置已经变化/);
    assert.equal(readFileSync(join(project, 'src/audio-catalog.json'), 'utf8'), 'ORIGINAL');
    assert.equal(existsSync(join(project, 'public')), false);
    catalog.entries[key] = original;
    delete catalog.entries[key];
    writeFileSync(join(pack, 'catalog.json'), JSON.stringify(catalog));
    assert.throws(() => validateQwenPack(pack), /240段/);
    catalog.entries[key] = original;
    writeFileSync(join(pack, 'catalog.json'), JSON.stringify(catalog));
    writeFileSync(join(pack, basename(original.src)), 'corrupt');
    assert.throws(() => validateQwenPack(pack), /校验失败/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

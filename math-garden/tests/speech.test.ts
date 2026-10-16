import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { lessons } from '../src/content.ts';
import { resolveNarration } from '../src/narration.ts';
import { authHeaders, collectPcm, pcmToWav, speechRequest, speechSignature } from '../scripts/doubao-client.ts';
import { teachingText, spokenNumber, voices } from '../scripts/speech-plan.ts';

function stream(text: string, size = 199) {
  const encoded = new TextEncoder().encode(text);
  return new ReadableStream<Uint8Array>({ start(controller) { for (let i = 0; i < encoded.length; i += size) controller.enqueue(encoded.slice(i, i + size)); controller.close(); } });
}
const fixturePcm = () => Buffer.alloc(48000, 1);
const audioFrame = (pcm: Buffer) => `event: 352\r\ndata: ${JSON.stringify({ code: 0, message: '音频', data: pcm.toString('base64') })}\r\n\r\n`;
const finish = `event: 152\r\ndata: {"code":20000000,"data":null}\r\n\r\n`;

test('speech plans preserve all steps and use standard Mandarin teaching directions', () => {
  for (const lesson of lessons) for (const step of lesson.steps.keys()) {
    const text = teachingText(lesson, step);
    assert.ok(text.length > 30 && text.length < 400);
    assert.ok(!/\d|<[^>]+>/.test(text), `${lesson.id}/${step} uses spoken numbers, not SSML`);
    const request = speechRequest(text, 'xiaohe', step);
    assert.equal(request.req_params.speaker, voices.xiaohe.speaker);
    assert.equal(request.req_params.audio_params.speech_rate, -8);
    const additions = JSON.parse(request.req_params.additions);
    assert.ok(additions.context_texts[0].includes('标准普通话'));
    assert.ok(additions.context_texts[0].includes('三、四年级'));
    assert.equal(additions.silence_duration, step === 2 ? 1200 : 450);
  }
  for (const [n, text] of [[0, '零'], [10, '十'], [12, '十二'], [30, '三十'], [101, '一百零一'], [1008, '一千零八'], [9999, '九千九百九十九']] as const) assert.equal(spokenNumber(n), text);
});

test('new and legacy authentication fail explicitly when credentials are missing', () => {
  assert.throws(() => authHeaders({}), /缺少豆包/);
  const current = authHeaders({ DOUBAO_API_KEY: 'test-only-key' });
  assert.equal(current['X-Api-Key'], 'test-only-key');
  assert.equal(current['X-Api-App-Id'], undefined);
  const legacy = authHeaders({ DOUBAO_APP_ID: 'test-app', DOUBAO_ACCESS_KEY: 'test-access' });
  assert.equal(legacy['X-Api-App-Id'], 'test-app');
  assert.equal(legacy['X-Api-Access-Key'], 'test-access');
});

test('SSE parser assembles fragmented UTF-8 and PCM chunks before accepting success', async () => {
  const pcm = fixturePcm();
  const data = ': keepalive\r\n\r\n' + audioFrame(pcm.subarray(0, 20000)) + audioFrame(pcm.subarray(20000)) + finish;
  assert.deepEqual(await collectPcm(stream(data, 73)), pcm);
  const wav = pcmToWav(pcm);
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
  assert.equal(wav.readUInt32LE(24), 24000);
  assert.equal(wav.readUInt16LE(22), 1);
  assert.equal(wav.readUInt16LE(34), 16);
  assert.equal(wav.readUInt32LE(40), pcm.length);
});

test('truncated, unauthorized, empty, and silent responses cannot replace working narration', async () => {
  await assert.rejects(collectPcm(stream(audioFrame(fixturePcm()))), /未正常结束/);
  await assert.rejects(collectPcm(stream('data: {"code":45000000}\n\n')), /45000000/);
  await assert.rejects(collectPcm(stream(finish)), /音频为空/);
  await assert.rejects(collectPcm(stream(audioFrame(Buffer.alloc(48000)) + finish)), /静音/);
  await assert.rejects(collectPcm(stream('data: not-json\n\n')), /无法解析/);
});

test('new candidate text is not exposed while the original audio is active', () => {
  const result = resolveNarration(lessons[0], 0);
  if (result.provider === 'system') {
    assert.equal(result.src, '/audio/trees-3-1.m4a');
    assert.equal(result.text, lessons[0].steps[0].narration);
    assert.notEqual(result.text, teachingText(lessons[0], 0));
  }
  const text = teachingText(lessons[0], 0);
  assert.notEqual(speechSignature(text, 'xiaohe', 0), speechSignature(text, 'storybook', 0));
  assert.notEqual(speechSignature(text, 'xiaohe', 0), speechSignature(text + '。', 'xiaohe', 0));
});

test('a late mismatch in a full pack leaves the active catalog and public assets unchanged', () => {
  const temp = mkdtempSync(join(tmpdir(), 'math-garden-speech-test-'));
  try {
    mkdirSync(join(temp, 'src')); mkdirSync(join(temp, 'pack'));
    writeFileSync(join(temp, 'src/audio-catalog.json'), 'ORIGINAL-CATALOG');
    const entries: Record<string, unknown> = {};
    const wav = pcmToWav(fixturePcm()), digest = createHash('sha256').update(wav).digest('hex');
    for (const lesson of lessons) for (const step of lesson.steps.keys()) {
      const text = teachingText(lesson, step), id = `${lesson.id}-${step + 1}`, signature = speechSignature(text, 'xiaohe', step);
      const src = `/audio/doubao/${signature.slice(0, 12)}/${id}.${digest.slice(0, 12)}.wav`;
      entries[id] = { src, text, signature, sha256: digest, duration: 1 };
      writeFileSync(join(temp, 'pack', basename(src)), wav);
    }
    (entries['cycle-4-5'] as { text: string }).text = '过期讲稿';
    writeFileSync(join(temp, 'pack/catalog.json'), JSON.stringify({ schema: 1, provider: 'doubao', speaker: voices.xiaohe.speaker, entries }));
    const result = spawnSync(process.execPath, ['--experimental-strip-types', resolve('scripts/generate-doubao-audio.ts'), '--install', join(temp, 'pack')], { cwd: temp, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /讲稿或音色设置已经改变/);
    assert.equal(readFileSync(join(temp, 'src/audio-catalog.json'), 'utf8'), 'ORIGINAL-CATALOG');
    assert.equal(existsSync(join(temp, 'public/audio')), false);
  } finally { rmSync(temp, { recursive: true, force: true }); }
});

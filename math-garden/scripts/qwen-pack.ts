import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import type { AudioCatalog } from '../src/narration.ts';
import { qwenPlan } from './qwen-plan.ts';
export function wavInfo(data: Buffer) {
  if (data.length < 44 || data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WAVE') throw new Error('不是完整的WAV音频。');
  let sampleRate = 0, channels = 0, bits = 0, format = 0, bytes = 0, audioOffset = 0;
  for (let at = 12; at + 8 <= data.length;) {
    const id = data.toString('ascii', at, at + 4), size = data.readUInt32LE(at + 4), start = at + 8;
    if (start + size > data.length) throw new Error('WAV数据块不完整。');
    if (id === 'fmt ' && size >= 16) { format = data.readUInt16LE(start); channels = data.readUInt16LE(start + 2); sampleRate = data.readUInt32LE(start + 4); bits = data.readUInt16LE(start + 14); }
    if (id === 'data') { bytes = size; audioOffset = start; }
    at = start + size + size % 2;
  }
  if (format !== 1 || channels !== 1 || bits !== 16 || ![24000, 44100, 48000].includes(sampleRate) || bytes < sampleRate * 2 || bytes % 2) throw new Error('课程音频必须是至少1秒的单声道16位PCM。');
  let peak = 0;
  for (let i = audioOffset; i < audioOffset + bytes; i += 2) peak = Math.max(peak, Math.abs(data.readInt16LE(i)));
  if (peak < 32) throw new Error('音频只包含静音。');
  return { sampleRate, channels, bits, duration: bytes / (sampleRate * 2) };
}
export function validateQwenPack(packDirectory: string) {
  const pack = resolve(packDirectory), plan = qwenPlan();
  const catalog = JSON.parse(readFileSync(join(pack, 'catalog.json'), 'utf8')) as AudioCatalog;
  if (catalog.schema !== 1 || catalog.provider !== plan.provider || catalog.model !== plan.model || catalog.modelRevision !== plan.modelRevision || catalog.speaker !== plan.speaker) throw new Error('课程音频包的模型或音色与当前Qwen3-TTS设置不匹配。');
  if (!catalog.entries || Object.keys(catalog.entries).length !== plan.jobs.length) throw new Error(`需要全部${plan.jobs.length}段音频，当前配音没有改变。`);
  const files: { source: string; relative: string }[] = [];
  let prefix = '';
  for (const job of plan.jobs) {
    const entry = catalog.entries[job.id];
    if (!entry || entry.signature !== job.signature || entry.text !== job.text) throw new Error(`${job.id}的讲稿或生成设置已经变化，请重新生成。`);
    if (!/^\/audio\/qwen3\/[a-f0-9]{12}\/[a-z]+-[34]-[1-5]\.[a-f0-9]{12}\.wav$/.test(entry.src) || !basename(entry.src).startsWith(`${job.id}.`)) throw new Error(`${job.id}的路径无效。`);
    if (!prefix) prefix = dirname(entry.src);
    if (dirname(entry.src) !== prefix) throw new Error('音频包目录不一致。');
    const source = join(pack, basename(entry.src)), data = readFileSync(source);
    if (createHash('sha256').update(data).digest('hex') !== entry.sha256) throw new Error(`${job.id}的音频校验失败。`);
    const info = wavInfo(data);
    if (!Number.isFinite(entry.duration) || Math.abs(info.duration - entry.duration) > .001 || entry.sampleRate !== info.sampleRate) throw new Error(`${job.id}的音频时长或采样率无效。`);
    files.push({ source, relative: `public${entry.src}` });
  }
  return { catalog, files, prefix };
}
export function installQwenPack(packDirectory: string, projectDirectory = '.') {
  const verified = validateQwenPack(packDirectory);
  const root = resolve(projectDirectory);
  const review = readFileSync(join(resolve(packDirectory), 'index.html'));
  for (const file of verified.files) { const target = join(root, file.relative); mkdirSync(dirname(target), { recursive: true }); copyFileSync(file.source, target); }
  writeFileSync(join(root, `public${verified.prefix}/index.html`), review);
  const catalogPath = join(root, 'src/audio-catalog.json');
  const temporary = `${catalogPath}.tmp`;
  writeFileSync(temporary, JSON.stringify(verified.catalog, null, 2) + '\n'); renameSync(temporary, catalogPath);
  return { voice: verified.catalog.voiceLabel, entries: verified.files.length, reviewPath: `${verified.prefix}/index.html` };
}

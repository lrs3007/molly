import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { lessons } from '../src/content.ts';
import type { AudioCatalog } from '../src/narration.ts';
import { authHeaders, speechSignature, synthesize } from './doubao-client.ts';
import { teachingText, voices } from './speech-plan.ts';
import type { VoiceName } from './speech-plan.ts';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const args = process.argv.slice(2);
const option = (name: string) => { const i = args.indexOf(name); if (i < 0) return; const value = args[i + 1]; if (!value || value.startsWith('--')) throw new Error(`${name}需要一个参数。`); return value; };
function voiceName(value: string): VoiceName { if (!Object.hasOwn(voices, value)) throw new Error(`未知音色。可选：${Object.keys(voices).join(', ')}`); return value as VoiceName; }
const hash = (data: Buffer | string) => createHash('sha256').update(data).digest('hex');
const escape = (text: string) => text.replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[x]!);

function activate(packDirectory: string) {
  const pack = resolve(packDirectory);
  const catalog = JSON.parse(readFileSync(join(pack, 'catalog.json'), 'utf8')) as AudioCatalog;
  const voice = (Object.entries(voices) as [VoiceName, typeof voices[VoiceName]][]).find(([, v]) => v.speaker === catalog.speaker)?.[0];
  if (catalog.schema !== 1 || catalog.provider !== 'doubao' || !voice) throw new Error('不是有效的豆包课程音频包。');
  const expectedKeys = lessons.flatMap(lesson => lesson.steps.map((_, step) => `${lesson.id}-${step + 1}`));
  if (!catalog.entries || Object.keys(catalog.entries).length !== expectedKeys.length) throw new Error(`需要完整的${expectedKeys.length}段课程音频包才能替换当前配音。`);
  const files: { source: string; target: string }[] = [];
  for (const lesson of lessons) for (const step of lesson.steps.keys()) {
    const id = `${lesson.id}-${step + 1}`, entry = catalog.entries[id], text = teachingText(lesson, step);
    if (!entry || entry.text !== text || entry.signature !== speechSignature(text, voice, step)) throw new Error(`${id}的讲稿或音色设置已经改变，请重新生成。`);
    if (!/^\/audio\/doubao\/[a-f0-9]{12}\/[a-z]+-[34]-[1-5]\.[a-f0-9]{12}\.wav$/.test(entry.src)) throw new Error(`${id}的音频路径无效。`);
    const source = join(pack, basename(entry.src)), data = readFileSync(source);
    if (hash(data) !== entry.sha256 || data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WAVE' || data.length < 48044 || data.readUInt32LE(24) !== 24000 || data.readUInt16LE(22) !== 1 || data.readUInt16LE(34) !== 16 || data.readUInt32LE(40) !== data.length - 44 || Math.abs(entry.duration - (data.length - 44) / 48000) > .001) throw new Error(`${id}的音频损坏或时长无效。`);
    files.push({ source, target: resolve(`public${entry.src}`) });
  }
  for (const file of files) { mkdirSync(dirname(file.target), { recursive: true }); copyFileSync(file.source, file.target); }
  const path = resolve('src/audio-catalog.json'), temporary = `${path}.tmp`;
  writeFileSync(temporary, JSON.stringify(catalog, null, 2) + '\n'); renameSync(temporary, path);
  console.log(`已切换为${catalog.voiceLabel}，${expectedKeys.length}段音频和匹配讲稿已一起安装。请运行 npm test 和 npm run build。`);
}

async function main() {
  const allowed = new Set(['--dry-run', '--sample', '--all', '--voice', '--install']);
  for (let i = 0; i < args.length; i++) { if (!allowed.has(args[i])) throw new Error(`未知参数：${args[i]}`); if (['--voice', '--install'].includes(args[i])) i++; }
  const install = option('--install');
  if (install) { if (args.includes('--sample') || args.includes('--all') || args.includes('--dry-run')) throw new Error('--install请单独使用。'); activate(install); return; }
  const requested = voiceName(option('--voice') ?? process.env.DOUBAO_VOICE ?? 'xiaohe');
  if (args.includes('--sample') && args.includes('--all')) throw new Error('--sample和--all不能同时使用。');
  const samples = args.includes('--sample');
  const selectedVoices = samples && !option('--voice') ? Object.keys(voices) as VoiceName[] : [requested];
  const selectedLessons = samples ? lessons.filter(x => x.id === 'trees-3') : lessons;
  const plans = selectedVoices.flatMap(voice => selectedLessons.flatMap(lesson => lesson.steps.flatMap((_, step) => samples && ![0, 3].includes(step) ? [] : [{ voice, lesson, step, text: teachingText(lesson, step) }])));
  if (args.includes('--dry-run') || (!samples && !args.includes('--all'))) {
    console.log(JSON.stringify({ mode: 'plan-only', requests: plans.length, textCharacters: plans.reduce((n, p) => n + p.text.length, 0), voice: voices[requested].label, note: '未调用API、未修改现有音频。', preview: plans.slice(0, 5).map(p => ({ id: `${p.lesson.id}-${p.step + 1}`, text: p.text })) }, null, 2)); return;
  }
  authHeaders(process.env);
  const outputRoot = resolve('.audio-output'); mkdirSync(outputRoot, { recursive: true });
  const output = mkdtempSync(join(outputRoot, samples ? 'doubao-samples-' : 'doubao-pack-'));
  const catalog: AudioCatalog = { schema: 1, provider: 'doubao', speaker: voices[requested].speaker, voiceLabel: voices[requested].label, entries: {} };
  const cards: string[] = [];
  for (const p of plans) {
    const id = `${p.lesson.id}-${p.step + 1}`, signature = speechSignature(p.text, p.voice, p.step);
    console.log(`正在生成 ${id} · ${voices[p.voice].label}`);
    const { audio, duration } = await synthesize(p.text, p.voice, p.step), digest = hash(audio);
    const filename = samples ? `${p.voice}-${id}.${digest.slice(0, 12)}.wav` : `${id}.${digest.slice(0, 12)}.wav`;
    writeFileSync(join(output, filename), audio);
    catalog.entries[id] = { src: `/audio/doubao/${signature.slice(0, 12)}/${filename}`, text: p.text, duration, signature, sha256: digest };
    cards.push(`<article><h2>${escape(voices[p.voice].label)} · ${escape(p.lesson.steps[p.step].title)}</h2><audio controls preload="metadata" src="${escape(filename)}"></audio><p>${escape(p.text)}</p></article>`);
  }
  if (!samples) writeFileSync(join(output, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
  if (samples) for (const step of [0, 3]) {
    const filename = `original-trees-3-${step + 1}.m4a`; copyFileSync(resolve(`public/audio/trees-3-${step + 1}.m4a`), join(output, filename));
    cards.push(`<article><h2>原版系统语音 · ${escape(lessons[0].steps[step].title)}</h2><audio controls preload="metadata" src="${filename}"></audio></article>`);
  }
  writeFileSync(join(output, 'index.html'), `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>数学讲题语音试听</title><style>body{font-family:system-ui;max-width:850px;margin:40px auto;padding:0 20px;background:#f7f8f2;color:#304936}article{background:white;border:1px solid #dce5d4;padding:24px;margin:20px 0;border-radius:14px}h1{font-size:26px}h2{font-size:18px}p{line-height:2}audio{width:100%}</style><h1>数学讲题语音试听</h1><p>重点听：标准普通话是否清楚、语气是否自然、数字与关系是否听得懂，以及孩子能否跟上节奏。</p>${cards.join('')}</html>`);
  console.log(`已生成：${output}\n试听页：${join(output, 'index.html')}\n${samples ? '现有课程配音未变更。选定音色后可用 --all --voice 生成完整包。' : '现有课程配音未变更。试听后用 --install 加目录路径安装完整包。'}`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : '语音生成失败。'); process.exitCode = 1; });

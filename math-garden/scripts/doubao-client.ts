import { randomUUID, createHash } from 'node:crypto';
import { directionForStep, sampleRate, speechRate, speechProfileVersion, voices } from './speech-plan.ts';
import type { VoiceName } from './speech-plan.ts';
export const endpoint = 'https://openspeech.bytedance.com/api/v3/tts/unidirectional/sse';
export function speechRequest(text: string, voice: VoiceName, step: number) {
  return {
    user: { uid: 'math-garden-course-production' },
    req_params: {
      text, speaker: voices[voice].speaker,
      audio_params: { format: 'pcm', sample_rate: sampleRate, speech_rate: speechRate, loudness_rate: 0 },
      additions: JSON.stringify({ context_texts: [directionForStep(step)], silence_duration: step === 2 ? 1200 : 450 }),
    },
  };
}
export function speechSignature(text: string, voice: VoiceName, step: number) {
  return createHash('sha256').update(JSON.stringify({ version: speechProfileVersion, request: speechRequest(text, voice, step) })).digest('hex');
}
export function authHeaders(env: NodeJS.ProcessEnv) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'text/event-stream', 'X-Api-Resource-Id': 'seed-tts-2.0', 'X-Api-Request-Id': randomUUID() };
  if (env.DOUBAO_API_KEY?.trim()) headers['X-Api-Key'] = env.DOUBAO_API_KEY.trim();
  else if (env.DOUBAO_APP_ID?.trim() && env.DOUBAO_ACCESS_KEY?.trim()) { headers['X-Api-App-Id'] = env.DOUBAO_APP_ID.trim(); headers['X-Api-Access-Key'] = env.DOUBAO_ACCESS_KEY.trim(); }
  else throw new Error('缺少豆包语音凭证。请在 .env.local 配置 DOUBAO_API_KEY，或 DOUBAO_APP_ID 与 DOUBAO_ACCESS_KEY。');
  return headers;
}
// UTF-8 characters and SSE JSON frames can cross network chunk boundaries.
export async function collectPcm(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader(), decoder = new TextDecoder();
  const chunks: Buffer[] = [];
  let pending = '', finished = false, bytes = 0;
  function frame(raw: string) {
    const payload = raw.split(/\r?\n/).filter(l => l.startsWith('data:')).map(l => l.slice(5).trimStart()).join('\n');
    if (!payload) return;
    let message;
    try { message = JSON.parse(payload); } catch { throw new Error('豆包返回了无法解析的语音数据。'); }
    if (![0, 20000000].includes(message.code)) throw new Error(`豆包合成失败，服务状态码：${message.code ?? 'unknown'}。请检查服务开通状态、额度和音色权限。`);
    if (message.data) {
      if (typeof message.data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(message.data)) throw new Error('豆包返回的音频编码无效。');
      const data = Buffer.from(message.data, 'base64'); bytes += data.length;
      if (bytes > sampleRate * 2 * 120) throw new Error('单步骤音频超过120秒，已停止接收。');
      chunks.push(data);
    }
    if (message.code === 20000000) finished = true;
  }
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      pending += decoder.decode(value, { stream: true });
      if (pending.length > 16_000_000) throw new Error('语音响应帧过大。');
      let match;
      while ((match = /\r?\n\r?\n/.exec(pending))) { frame(pending.slice(0, match.index)); pending = pending.slice(match.index + match[0].length); }
    }
    pending += decoder.decode(); if (pending.trim()) frame(pending);
    if (!finished) throw new Error('语音传输未正常结束，保留旧配音。');
    const pcm = Buffer.concat(chunks);
    if (pcm.length < sampleRate * 2 || pcm.length % 2) throw new Error('音频为空、过短或采样数据不完整。');
    let peak = 0;
    for (let i = 0; i < pcm.length; i += 2) peak = Math.max(peak, Math.abs(pcm.readInt16LE(i)));
    if (peak < 32) throw new Error('音频仅包含静音，保留旧配音。');
    return pcm;
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
export function pcmToWav(pcm: Buffer) {
  if (pcm.length % 2) throw new Error('PCM must contain complete 16-bit samples.');
  const header = Buffer.alloc(44);
  header.write('RIFF'); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}
export async function synthesize(text: string, voice: VoiceName, step: number) {
  if (text.length > 400) throw new Error('单步骤讲稿超过400字，请先拆分。');
  const response = await fetch(endpoint, { method: 'POST', headers: authHeaders(process.env), body: JSON.stringify(speechRequest(text, voice, step)), signal: AbortSignal.timeout(120_000), redirect: 'error' });
  if (!response.ok || !response.body) { await response.body?.cancel(); throw new Error(`豆包请求失败（HTTP ${response.status}）。请检查凭证、服务额度及音色权限。`); }
  if (!response.headers.get('content-type')?.includes('text/event-stream')) { await response.body.cancel(); throw new Error('豆包未返回预期的 SSE 音频响应。'); }
  const pcm = await collectPcm(response.body);
  return { audio: pcmToWav(pcm), duration: pcm.length / (sampleRate * 2) };
}

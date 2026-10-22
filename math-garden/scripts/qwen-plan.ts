import { createHash } from 'node:crypto';
import { lessons } from '../src/content.ts';
import { teachingText } from './speech-plan.ts';
import { audioCatalog } from '../src/narration.ts';
export const qwenModel = 'mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit';
export const qwenModelRevision = '41d3337e8b7f2843a75841595fc14e4b9a7a4b96';
export const qwenSpeaker = 'serena';
export const qwenVoiceLabel = 'Serena · 温暖普通话女老师';
export const qwenProfileVersion = 1;
export function qwenDirection(step: number) {
  return '用温暖、亲切、耐心的成年女老师声音，为小学一年级奥数班学生讲数学。清晰的标准普通话，语速稍慢，自然连贯，关键数量关系稍作强调。' + (step === 2 ? '提问时带一点好奇，句尾轻轻收住。' : step === 4 ? '总结时语气温暖肯定。' : '像和一个孩子面对面交流，带着孩子观察图形。');
}
export function qwenJob(lesson: typeof lessons[number], step: number) {
  const job = {
    id: `${lesson.id}-${step + 1}`, lessonId: lesson.id, step, title: `${lesson.title} · ${lesson.steps[step].title}`,
    text: teachingText(lesson, step), model: qwenModel, modelRevision: qwenModelRevision, speaker: qwenSpeaker, language: 'Chinese', instruct: qwenDirection(step),
    seed: 4200 + lessons.indexOf(lesson) * 10 + step, tailSilenceMs: step === 2 ? 1200 : 450,
    runtime: 'mlx-audio@0.5.9', generation: { temperature: .9, top_k: 50, top_p: 1, repetition_penalty: 1.05, max_tokens: 1200 },
    profileVersion: qwenProfileVersion,
  };
  const signature = createHash('sha256').update(JSON.stringify(job)).digest('hex');
  const existing = audioCatalog.entries[job.id];
  const reuse = qwenProfileVersion === 1 && lesson.audioSourceId && existing?.sourceLessonId === lesson.audioSourceId && existing.text === job.text && audioCatalog.provider === 'qwen3-tts' && audioCatalog.model === qwenModel && audioCatalog.modelRevision === qwenModelRevision && audioCatalog.speaker === qwenSpeaker ? existing : undefined;
  return { ...job, signature: reuse?.signature ?? signature, ...(reuse ? { reuse } : {}) };
}
export function qwenPlan() { return { schema: 1, provider: 'qwen3-tts', model: qwenModel, modelRevision: qwenModelRevision, speaker: qwenSpeaker, voiceLabel: qwenVoiceLabel, jobs: lessons.flatMap(l => l.steps.map((_, i) => qwenJob(l, i))) }; }

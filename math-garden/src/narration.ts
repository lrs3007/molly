import catalogData from './audio-catalog.json' with { type: 'json' };
import { audioPath } from './content.ts';
import type { Lesson } from './content.ts';
export interface AudioEntry { src: string; text: string; duration: number; signature: string; sha256: string; sampleRate?: number }
export interface AudioCatalog { schema: number; provider: string; voiceLabel?: string; speaker?: string; model?: string; modelRevision?: string; entries: Record<string, AudioEntry> }
export const audioCatalog: AudioCatalog = catalogData;
export function narrationKey(lesson: Lesson, step: number) { return `${lesson.id}-${step + 1}`; }
export function resolveNarration(lesson: Lesson, step: number) {
  const entry = audioCatalog.entries[narrationKey(lesson, step)];
  return entry
    ? { ...entry, voiceLabel: audioCatalog.voiceLabel ?? '普通话老师', provider: audioCatalog.provider }
    : { src: audioPath(lesson, step), text: lesson.steps[step].narration, duration: 0, voiceLabel: '普通话讲解', provider: 'system' };
}

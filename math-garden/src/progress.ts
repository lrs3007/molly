import type { Exercise } from './content';
import { defaultLesson, lessons } from './content.ts';
export interface LessonProgress { completed?: boolean; step?: number; results: Record<string, { correct: boolean; revealed: boolean; attempts: number; value: string }> }
export interface Progress { schema: 2; grade: number; lessonId: string; lessons: Record<string, LessonProgress>; archivedLessons?: Record<string, LessonProgress> }
export const storageKey = 'math-garden-progress-v1';
export const emptyProgress = (): Progress => ({ schema: 2, grade: defaultLesson.grade, lessonId: defaultLesson.id, lessons: {} });
export function progressKey(id: string, version: number) { return `${id}:v${version}`; }
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw);
    if (![1, 2].includes(p.schema) || !Number.isInteger(p.grade) || p.grade < 1 || p.grade > 6 || typeof p.lessonId !== 'string' || !p.lessons || typeof p.lessons !== 'object' || Array.isArray(p.lessons)) return emptyProgress();
    if (p.archivedLessons !== undefined && (!p.archivedLessons || typeof p.archivedLessons !== 'object' || Array.isArray(p.archivedLessons))) return emptyProgress();
    for (const l of [...Object.values(p.lessons), ...Object.values(p.archivedLessons ?? {})] as LessonProgress[]) {
      if (!l || typeof l !== 'object' || !l.results || typeof l.results !== 'object' || Array.isArray(l.results)) return emptyProgress();
      if (l.completed !== undefined && typeof l.completed !== 'boolean') return emptyProgress();
      if (l.step !== undefined && (!Number.isInteger(l.step) || l.step < 0 || l.step > 4)) return emptyProgress();
      for (const r of Object.values(l.results)) if (!r || typeof r.correct !== 'boolean' || typeof r.revealed !== 'boolean' || !Number.isInteger(r.attempts) || r.attempts < 0 || typeof r.value !== 'string') return emptyProgress();
    }
    const active: Record<string, LessonProgress> = {}, archived: Record<string, LessonProgress> = { ...p.archivedLessons };
    const legacyIds = new Map(lessons.filter(l => l.audioSourceId).map(l => [l.audioSourceId!, l.id]));
    const activeKeys = new Set(lessons.map(l => progressKey(l.id, l.version)));
    for (const [key, record] of Object.entries(p.lessons) as [string, LessonProgress][]) {
      const parts = key.match(/^(.+):v(\d+)$/);
      const oldId = parts?.[1], movedId = p.schema === 1 && oldId ? legacyIds.get(oldId) : undefined;
      const nextKey = movedId ? progressKey(movedId, Number(parts![2])) : key;
      if (!activeKeys.has(nextKey)) { archived[key] = record; continue; }
      const results = Object.fromEntries(Object.entries(record.results).map(([id, result]) => [movedId && id.startsWith(`${oldId}-`) ? `${movedId}${id.slice(oldId!.length)}` : id, result]));
      active[nextKey] = { ...record, results };
    }
    const selectedId = p.schema === 1 ? legacyIds.get(p.lessonId) ?? p.lessonId : p.lessonId;
    const lessonId = lessons.some(l => l.id === selectedId) ? selectedId : defaultLesson.id;
    const grade = p.schema === 1 && [3, 4].includes(p.grade) ? defaultLesson.grade : p.grade;
    return { schema: 2, grade, lessonId, lessons: active, ...(Object.keys(archived).length ? { archivedLessons: archived } : {}) };
  } catch { return emptyProgress(); }
}
export function normalizeAnswer(value: string) {
  return value.trim().replace(/[０-９]/g, x => String.fromCharCode(x.charCodeAt(0) - 0xfee0));
}
export function checkAnswer(exercise: Exercise, input: string) {
  const normalized = normalizeAnswer(input);
  if (exercise.choices) return normalized === exercise.answer;
  return /^\d+$/.test(normalized) && Number(normalized) === Number(exercise.answer);
}
export function countSolved(progress: Progress) { return Object.values(progress.lessons).reduce((n, l) => n + Object.values(l.results).filter(r => r.correct && !r.revealed).length, 0); }

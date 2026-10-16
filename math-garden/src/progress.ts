import type { Exercise } from './content';
export interface LessonProgress { completed?: boolean; step?: number; results: Record<string, { correct: boolean; revealed: boolean; attempts: number; value: string }> }
export interface Progress { schema: 1; grade: number; lessonId: string; lessons: Record<string, LessonProgress> }
export const storageKey = 'math-garden-progress-v1';
export const emptyProgress = (): Progress => ({ schema: 1, grade: 3, lessonId: 'trees-3', lessons: {} });
export function progressKey(id: string, version: number) { return `${id}:v${version}`; }
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw);
    if (p.schema !== 1 || !Number.isInteger(p.grade) || p.grade < 1 || p.grade > 6 || typeof p.lessonId !== 'string' || !p.lessons || typeof p.lessons !== 'object' || Array.isArray(p.lessons)) return emptyProgress();
    for (const l of Object.values(p.lessons) as LessonProgress[]) {
      if (!l || typeof l !== 'object' || !l.results || typeof l.results !== 'object' || Array.isArray(l.results)) return emptyProgress();
      if (l.completed !== undefined && typeof l.completed !== 'boolean') return emptyProgress();
      if (l.step !== undefined && (!Number.isInteger(l.step) || l.step < 0 || l.step > 4)) return emptyProgress();
      for (const r of Object.values(l.results)) if (!r || typeof r.correct !== 'boolean' || typeof r.revealed !== 'boolean' || !Number.isInteger(r.attempts) || r.attempts < 0 || typeof r.value !== 'string') return emptyProgress();
    }
    return p;
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

import { gradeOneLessons } from './courses/grade-1/index.ts';
import { extensionLessons } from './courses/grade-1/extensions.ts';
import { closedTreeLessons } from './courses/grade-1/closed-trees.ts';
import { compoundUnitLessons } from './courses/grade-1/compound-unit.ts';
import { reference20261023Lessons } from './courses/reference-20261023-lessons.ts';
import type { StoryFrame } from './story-types.ts';
export type TopicId = 'trees' | 'unit' | 'sum' | 'cycle' | 'average' | 'ratio' | 'transfer' | 'geometry' | 'age';
export type Scene =
  | { kind: 'trees'; length: number; spacing: number; ends: 'both' | 'one' }
  | { kind: 'unit'; count: number; total: number; target: number; item: string; unit: string }
  | { kind: 'sum'; total: number; difference: number; names: [string, string]; unit: string }
  | { kind: 'cycle'; colors: string[]; target: number }
  | { kind: 'average'; values: number[]; mode: 'mean' | 'missing' }
  | { kind: 'ratio'; relation: 'sum' | 'difference'; amount: number; multiple: number }
  | { kind: 'transfer'; left: number; right: number; mode: 'forward' | 'reverse' }
  | { kind: 'geometry'; rows: number; columns: number; shape: 'rectangle' | 'square' }
  | { kind: 'age'; older: number; younger: number; multiple: number; direction: 'future' | 'past' }
  | { kind: 'storyboard'; frames: StoryFrame[] };
export interface Question { prompt: string; choices: string[]; answer: number; explanation: string }
export interface Step { title: string; caption: string; narration: string; formula?: string; question?: Question }
export interface Exercise {
  id: string; level: string; prompt: string; answer: string; unit: string;
  hint: string; explanation: string; choices?: string[];
  diagram?: { rows: number; columns: number };
  images?: ProblemImage[];
  choiceSuffix?: string;
}
export interface ProblemImage { src: string; alt: string; caption: string }
export interface Lesson {
  id: string; version: number; grade: number; topic: TopicId; title: string; description: string;
  problem: string; tags: string[]; scene: Scene; steps: Step[]; exercises: Exercise[];
  takeaway: string; mistakes: string[]; tip?: string; audioSourceId?: string;
  pathOrder?: number;
  level?: '基础入门' | '条件变化' | '综合应用' | '原题挑战';
  images?: ProblemImage[];
  source?: { document: string; question: string; paragraph: number; kind: 'original' | 'adapted' };
}
export const topics: { id: TopicId; name: string; icon: string; subtitle: string }[] = [
  { id: 'trees', name: '植树问题', icon: 'tree', subtitle: '发现间隔里的小秘密' },
  { id: 'unit', name: '归一问题', icon: 'box', subtitle: '先找一份，再找几份' },
  { id: 'sum', name: '和差问题', icon: 'ruler', subtitle: '用线段看见数量关系' },
  { id: 'cycle', name: '周期问题', icon: 'shapes', subtitle: '找到重复出现的规律' },
  { id: 'average', name: '平均数问题', icon: 'average', subtitle: '把不一样多变成一样多' },
  { id: 'ratio', name: '和差倍问题', icon: 'ratio', subtitle: '用相同的份数看懂倍数' },
  { id: 'transfer', name: '移多补少', icon: 'transfer', subtitle: '搬一次，数量差变多少' },
  { id: 'geometry', name: '平面图形计数', icon: 'grid', subtitle: '按大小和位置有序地数' },
  { id: 'age', name: '年龄问题', icon: 'clock', subtitle: '年龄一起变，年龄差不变' },
];
export const coursesByGrade: Record<number, Lesson[]> = { 1: [...gradeOneLessons, ...extensionLessons, ...closedTreeLessons, ...compoundUnitLessons, ...reference20261023Lessons], 2: [], 3: [], 4: [], 5: [], 6: [] };
export const lessons: Lesson[] = Object.values(coursesByGrade).flat();
export const availableGrades = Object.keys(coursesByGrade).map(Number).filter(grade => coursesByGrade[grade].length > 0);
export const defaultLesson = lessons[0];
export function audioPath(lesson: Lesson, step: number) { return `/audio/${lesson.audioSourceId ?? lesson.id}-${step + 1}.m4a`; }

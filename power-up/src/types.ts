export type Level = 1 | 2 | 3;
export type ReadingMode = 'natural' | 'guided';
export type LessonKind = 'vocabulary' | 'grammar' | 'phonics' | 'discover' | 'story' | 'mission';
export type Visual = 'position' | 'words' | 'sentence' | 'timeline' | 'compare' | 'sounds' | 'story' | 'mission';
export interface Quiz { promptZh: string; spokenEn?: string; options: string[]; answer: number; explanationZh: string }
export interface Vocabulary { en: string; zh: string; icon: string }
export interface Lesson {
  id: string; titleZh: string; titleEn: string; kind: LessonKind; goalZh: string;
  explainZh: string; exampleEn: string; exampleZh: string; visual: Visual; focus: string[];
  quiz: Quiz; story?: {en: string; zh: string}[];
  phonics?: {spelling: string; sound: string; word: string}[];
  readingGroups?: {sentence:string;phrases:{text:string;translation:string;focusWord?:string}[]}[];
}
export interface Unit {
  id: string; level: Level; number: number; title: string; titleZh: string; page: number;
  theme: string; missionZh: string; sourceUrl: string; isbn: string;
  vocabulary: Vocabulary[]; lessons: Lesson[];
}
export type Language = 'zh-CN' | 'en-GB';
export interface Segment { id: string; text: string; lang: Language; label: string; translation?:string; duration?: number; src?: string; sentenceText?:string; phraseStart?:number; phraseEnd?:number; focusWord?:string }
export interface AudioEntry { src: string; text: string; lang: Language; voice: string; provider: string; duration: number; sha256: string; signature: string }
export interface AudioCatalog { schema: 1; entries: Record<string, AudioEntry> }
export interface Result { correct: boolean; attempts: number; selected: number; revealed?: boolean }
export interface LessonRecord { completed?: boolean; result?: Result; reviewedAt?: number }
export interface Progress { schema: 1; selectedUnit: string; selectedLesson: string; records: Record<string, LessonRecord>; knownWords: string[]; missions: Record<string, string>; days: string[] }

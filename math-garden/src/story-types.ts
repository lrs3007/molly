export interface BarRow { label: string; value: number; parts?: number; display?: string }
export type StoryFrame =
  | { kind: 'source-count'; figure: string; phase: 'outline' | 'group' | 'question' | 'count' | 'check'; size?: number; group?: string; title: string; footer: string }
  | { kind: 'transfer-story'; names: [string,string]; values: [number,number]; from?: [number,number]; unit: string; illustrative?: boolean; action?: string; title: string; footer: string }
  | { kind: 'age-story'; names: string[]; ages: number[]; time: string; masked?: boolean; rule?: string; title: string; footer: string }
  | { kind: 'production-grid'; workers: number; hours: number; total: number; targetWorkers: number; targetHours: number; machine?: boolean; phase: 'known' | 'unit' | 'question' | 'produce' | 'check'; title: string; footer: string }
  | { kind: 'food-supply'; people: number; days: number; eatenDays: number; newcomers: number; phase: 'stock' | 'consume' | 'question' | 'regroup' | 'check'; title: string; footer: string }
  | { kind: 'planting-loop'; shape: 'circle' | 'triangle' | 'rectangle'; sides: number[]; spacing: number; phase: 'outline' | 'intervals' | 'question' | 'plant' | 'check'; title: string; footer: string }
  | { kind: 'bars'; title: string; rows: BarRow[]; footer: string }
  | { kind: 'calendar'; title: string; days: number; start: number; focus?: number; weekdays?: number[]; footer: string }
  | { kind: 'sequence'; title: string; pattern: number[]; count: number; widths?: number[]; excludedEnds?: 'last' | 'both'; footer: string }
  | { kind: 'table'; title: string; headers: string[]; values: (number | string)[]; highlights: number[]; footer: string }
  | { kind: 'route'; title: string; total: number; covered: number; labels: [string, string]; footer: string }
  | { kind: 'figures'; title: string; figure: 'l-squares' | 'triangle-1' | 'triangle-2' | 'triangle-3'; group: 'all' | 'small' | 'medium' | 'large' | 'top' | 'other'; footer: string };

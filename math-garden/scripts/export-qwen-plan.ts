import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { qwenPlan } from './qwen-plan.ts';
mkdirSync('.audio-output', { recursive: true });
const output = resolve('.audio-output/qwen-plan.json');
const plan = qwenPlan();
writeFileSync(output, JSON.stringify(plan, null, 2) + '\n');
console.log(`已导出 ${plan.jobs.length} 段讲稿到 ${output}，音色 ${plan.speaker}，共 ${plan.jobs.reduce((n, j) => n + j.text.length, 0)} 字。`);

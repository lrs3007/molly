import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { allAudioTexts, units } from '../src/content.ts';
export const plan=allAudioTexts().map((item,index)=>({
 ...item, key:`${item.lang}:${item.text}`,
 id:createHash('sha256').update(`${item.lang}:${item.text}`).digest('hex').slice(0,20),
 seed:7200+index,
 voice:item.lang==='zh-CN'?'serena':'Daniel',
 provider:item.lang==='zh-CN'?'qwen3-tts':'macos-speech',
 signature:createHash('sha256').update(JSON.stringify({lang:item.lang,text:item.text,voice:item.lang==='zh-CN'?'qwen3-serena-41d3337e8b7f-v1':'daniel-en-GB-145-v1'})).digest('hex'),
}));
mkdirSync('.audio-output',{recursive:true});
writeFileSync('.audio-output/plan.json',JSON.stringify({schema:1,jobs:plan},null,2)+'\n');
console.log(`${units.length} 个单元，${units.reduce((n,u)=>n+u.lessons.length,0)} 节微课；中文 ${plan.filter(j=>j.lang==='zh-CN').length} 段，英文 ${plan.filter(j=>j.lang==='en-GB').length} 段。`);

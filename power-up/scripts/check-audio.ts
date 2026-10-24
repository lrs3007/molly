import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,renameSync}from 'node:fs';
import {createHash}from 'node:crypto';
import {resolve,sep}from 'node:path';
import {allAudioTexts,units}from '../src/content.ts';
import type {AudioCatalog}from '../src/types.ts';
const en=JSON.parse(readFileSync('src/audio-en-catalog.json','utf8')) as AudioCatalog;
const zh=JSON.parse(readFileSync('src/audio-zh-catalog.json','utf8')) as AudioCatalog;
const entries={...en.entries,...zh.entries},assets=resolve('public/audio')+sep,playback:Record<string,{src:string;duration:number}>={};
const plan=JSON.parse(readFileSync('.audio-output/plan.json','utf8')) as {jobs:{key:string;signature:string}[]};
const signatures=new Map(plan.jobs.map(j=>[j.key,j.signature]));
let seconds=0,bytes=0;
for(const job of allAudioTexts()){
 const key=`${job.lang}:${job.text}`,entry=entries[key];assert.ok(entry,`Missing ${job.label}: ${job.text}`);assert.equal(entry.text,job.text);assert.equal(entry.lang,job.lang);assert.equal(entry.signature,signatures.get(key),`Voice profile changed: ${job.text}`);assert.equal(entry.provider,job.lang==='zh-CN'?'qwen3-tts':'macos-speech');
 const path=resolve('public'+entry.src);assert.ok(path.startsWith(assets));
 const data=readFileSync(path);assert.equal(createHash('sha256').update(data).digest('hex'),entry.sha256,`Changed file ${entry.src}`);assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WAVE');
 let cursor=12,rate=0,channels=0,bits=0,audioBytes=0,audioOffset=0;
 while(cursor+8<=data.length){const id=data.toString('ascii',cursor,cursor+4),size=data.readUInt32LE(cursor+4);assert.ok(cursor+8+size<=data.length);if(id==='fmt '){assert.equal(data.readUInt16LE(cursor+8),1);channels=data.readUInt16LE(cursor+10);rate=data.readUInt32LE(cursor+12);bits=data.readUInt16LE(cursor+22);}if(id==='data'){audioBytes=size;audioOffset=cursor+8;}cursor+=8+size+(size%2);}
 assert.equal(rate,24000);assert.equal(channels,1);assert.equal(bits,16);assert.ok(audioBytes>1000);const duration=audioBytes/(rate*channels*bits/8);assert.ok(Math.abs(entry.duration-duration)<.01);assert.ok(duration>=.15&&duration<150);
 let peak=0,energy=0;for(let i=audioOffset;i<audioOffset+audioBytes;i+=2){const value=data.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(value));energy+=value*value;}
 assert.ok(peak>.005&&energy/(audioBytes/2)>.000001,`Silent audio ${entry.src}`);seconds+=duration;bytes+=data.length;playback[key]={src:entry.src,duration:entry.duration};
}
writeFileSync('src/audio-playback.json.tmp',JSON.stringify(playback)+'\n');renameSync('src/audio-playback.json.tmp','src/audio-playback.json');
const escape=(text:string)=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const choices:[string,string,string][]=[['中文老师 · 与数学课堂相同的 Serena','l1-u1','vocabulary'],['英式英语 · 句子与位置词','l1-u1','grammar-1'],['双唇音 · 清音与浊音','l1-u1','sounds'],['舌尖位置 · th 与 t','l1-u2','sounds'],['长元音与轻读词尾','l2-u6','sounds'],['十几与整十 · 听重音','l3-u1','sounds'],['过去式 · 听清词尾','l2-u7','grammar-2'],['英式英语 · 旅行与情感','l3-u9','grammar-2']];
const cards=choices.map(([title,id,lessonId],index)=>{const lesson=units.find(u=>u.id===id)!.lessons.find(l=>l.id===lessonId)!;const text=index===0?lesson.explainZh:lesson.exampleEn;const entry=entries[`${index===0?'zh-CN':'en-GB'}:${text}`];return `<article><span>${index===0?'普通话 · Qwen3-TTS Serena':'英式英语 · macOS Daniel'}</span><h2>${escape(title)}</h2><p lang="${index===0?'zh-CN':'en-GB'}">${escape(text)}</p><audio controls preload="none" src="${escape(entry.src)}"></audio></article>`;});
writeFileSync('public/voice-check.html',`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Power Up · 语音试听</title><style>body{font-family:system-ui,sans-serif;max-width:780px;margin:42px auto;padding:0 22px;background:#fafbf4;color:#3b6048}a{color:#557c46}h1{font-size:28px}body>p{color:#8d9e7c;font-size:13px;line-height:2}article{background:#fffef8;border:1px solid #e1e8d5;border-radius:12px;padding:23px;margin:18px 0}article>span{font-size:10px;color:#9baa87}h2{font-size:17px;font-weight:500;margin:12px 0}article>p{line-height:1.9;font-size:13px;color:#81936f}article>p[lang=en-GB]{font:19px/1.8 Georgia,serif;color:#557648}audio{width:100%;margin-top:10px}</style></head><body><a href="/">← 回到英语课堂</a><h1>听见英语的小细节。</h1><p>中文帮助理解，英文示范开口。这里集中试听本次生成的配音，重点比较重音、词尾、清浊音、语调与自然度。课程中的中英文将分段顺序播放；英文采用统一英式音色。</p>${cards.join('')}<p>音频已完成格式、时长与非静音检查。发音和教学表达仍需结合实际试听评估。</p></body></html>`);
console.log(`✔ ${Object.keys(playback).length} audio clips verified: ${(seconds/60).toFixed(1)} minutes, ${(bytes/1024/1024).toFixed(1)} MiB. Languages, file hashes, WAV structure, duration and non-silence passed.`);

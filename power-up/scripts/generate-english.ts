import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import type {AudioCatalog} from '../src/types.ts';
const root=resolve('.'),output=resolve('public/audio/en-GB');
mkdirSync(output,{recursive:true});
const jobs=JSON.parse(readFileSync('.audio-output/plan.json','utf8')).jobs.filter((j:{lang:string})=>j.lang==='en-GB');
const current=():AudioCatalog=>JSON.parse(readFileSync('src/audio-en-catalog.json','utf8'));
let completed=0;
for(const job of jobs){
 const entry=current().entries[job.key];
 if(entry?.signature===job.signature&&existsSync(resolve('public'+entry.src))&&createHash('sha256').update(readFileSync(resolve('public'+entry.src))).digest('hex')===entry.sha256){completed++;continue;}
 const aiff=resolve('.audio-output',job.id+'.aiff'),wav=resolve(output,job.id+'.wav');
 execFileSync('/usr/bin/say',['-v','Daniel','-r','145','-o',aiff,job.text]);
 execFileSync('/usr/bin/afconvert',['-f','WAVE','-d','LEI16@24000',aiff,wav]);
 const buffer=readFileSync(wav);
 let pos=12,bytes=0,rate=0,channels=0,bits=0;
 while(pos+8<=buffer.length){const label=buffer.toString('ascii',pos,pos+4),size=buffer.readUInt32LE(pos+4);if(label==='fmt '){channels=buffer.readUInt16LE(pos+10);rate=buffer.readUInt32LE(pos+12);bits=buffer.readUInt16LE(pos+22);}if(label==='data')bytes=size;pos+=8+size+(size%2);}
 const duration=bytes/(rate*channels*bits/8);
 if(!duration||duration<.15||duration>120||rate!==24000)throw new Error(`Invalid English audio: ${job.id}`);
 const next=current();next.entries[job.key]={src:`/audio/en-GB/${job.id}.wav`,lang:'en-GB',text:job.text,voice:'Daniel · 英式英语',provider:'macos-speech',duration,signature:job.signature,sha256:createHash('sha256').update(buffer).digest('hex')};
 writeFileSync('src/audio-en-catalog.json.tmp',JSON.stringify(next,null,2)+'\n');renameSync('src/audio-en-catalog.json.tmp','src/audio-en-catalog.json');
 completed++;if(completed%30===0)console.log(`English ${completed}/${jobs.length}`);
}
console.log(`英式英语 ${completed}/${jobs.length} 段已完成。${root}`);

import test from 'node:test';
import assert from 'node:assert/strict';
import {PlaybackEngine}from '../src/playback-engine.ts';
import type {AudioPort}from '../src/playback-engine.ts';
import type {Level,ReadingMode,Segment}from '../src/types.ts';
import {defaultUnit,narrationSegments}from '../src/content.ts';
class FakeAudio implements AudioPort {
 src='';currentTime=0;duration=3;playbackRate=1;preservesPitch=false;ended=false;error:unknown=null;playCalls=0;pauseCalls=0;
 onloadedmetadata:AudioPort['onloadedmetadata']=null;onended:AudioPort['onended']=null;onerror:AudioPort['onerror']=null;
 pending:(()=>Promise<void>)|undefined;
 play=()=>{this.playCalls++;return this.pending?.()??Promise.resolve();};pause=()=>{this.pauseCalls++;};load=()=>{this.ended=false;this.error=null;};removeAttribute=()=>{this.src='';};
 loaded(){this.onloadedmetadata?.(new Event('loadedmetadata'));}finish(){this.ended=true;this.onended?.(new Event('ended'));}
}
class FakeClock {
 time=0; private next=0; private timers=new Map<number,{at:number;callback:()=>void}>();
 now=()=>this.time;
 schedule=(callback:()=>void,ms:number)=>{const id=++this.next;this.timers.set(id,{at:this.time+ms,callback});return()=>{this.timers.delete(id);};};
 advance(ms:number){const target=this.time+ms;for(;;){const next=[...this.timers].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;this.timers.delete(next[0]);this.time=next[1].at;next[1].callback();}this.time=target;}
 pending(){return this.timers.size;}
}
function setup(level?:Level,readingMode?:ReadingMode){const audio=new FakeAudio(),clock=new FakeClock();let created=0;const engine=new PlaybackEngine({level,readingMode,createAudio:()=>{created++;return audio;},frame:()=>1,cancelFrame:()=>{},resolve:s=>s,now:clock.now,schedule:clock.schedule});return {audio,engine,clock,created:()=>created};}
const clips:Segment[]=[{id:'zh',lang:'zh-CN',text:'先看看课桌。',label:'中文',duration:3,src:'/zh.wav'},{id:'en',lang:'en-GB',text:'Look at the desk.',label:'英文',duration:4,src:'/en.wav'}];
const flush=()=>new Promise<void>(resolve=>queueMicrotask(resolve));
test('one audio element plays Chinese then English and stops at the interaction boundary',async()=>{
 const {engine,audio,created,clock}=setup();let done=0;engine.play(clips,()=>done++);assert.equal(audio.src,'/zh.wav');audio.loaded();await flush();assert.equal(engine.snapshot().status,'playing');audio.finish();assert.equal(engine.snapshot().status,'waiting');assert.equal(engine.snapshot().waitKind,'transition');clock.advance(999);assert.equal(audio.src,'/zh.wav');clock.advance(1);assert.equal(audio.src,'/en.wav');assert.equal(engine.snapshot().index,1);audio.duration=4;audio.loaded();await flush();audio.finish();assert.equal(engine.snapshot().status,'waiting');assert.equal(engine.snapshot().elapsed,4);assert.equal(done,0);clock.advance(1000);assert.equal(engine.snapshot().status,'ended');assert.equal(done,1);assert.equal(created(),1);
});
test('switching lessons cancels old metadata, old end handlers and pending play callbacks',async()=>{
 const {engine,audio}=setup();let done=0,resolveOld:()=>void=()=>{};audio.pending=()=>new Promise<void>(resolve=>{resolveOld=resolve;});engine.play(clips,()=>done++);const oldMetadata=audio.onloadedmetadata!;audio.loaded();const oldEnd=audio.onended!;
 audio.pending=undefined;engine.play([{...clips[1],id:'new',src:'/new.wav'}]);oldMetadata(new Event('loadedmetadata'));oldEnd(new Event('ended'));resolveOld();await flush();assert.equal(audio.src,'/new.wav');assert.equal(engine.snapshot().queue[0].id,'new');assert.equal(engine.snapshot().status,'loading');assert.equal(done,0);audio.loaded();await flush();assert.equal(engine.snapshot().status,'playing');
});
test('pausing during metadata loading prevents delayed autoplay',async()=>{
 const {engine,audio}=setup();engine.play(clips);engine.pause();audio.loaded();await flush();assert.equal(audio.playCalls,0);assert.equal(engine.snapshot().status,'paused');engine.resume();await flush();assert.equal(audio.playCalls,1);assert.equal(engine.snapshot().status,'playing');
});
test('pausing while play is pending also prevents a late start',async()=>{
 const {engine,audio}=setup();let finish:()=>void=()=>{};audio.pending=()=>new Promise<void>(r=>{finish=r;});engine.play(clips);audio.loaded();engine.pause();finish();await flush();assert.equal(engine.snapshot().status,'paused');assert.ok(audio.pauseCalls>=2);
});
test('looping keeps a pause, English stays slow, and Mandarin retains its original pace and pitch',async()=>{
 const {engine,audio,clock}=setup();engine.changeRate(.6);engine.play(clips);audio.loaded();await flush();engine.toggleLoop();audio.finish();assert.equal(engine.snapshot().status,'waiting');clock.advance(1000);assert.equal(engine.snapshot().index,0);assert.equal(audio.src,'/zh.wav');assert.equal(audio.playbackRate,1);assert.equal(audio.preservesPitch,true);engine.toggleLoop();audio.loaded();await flush();audio.finish();clock.advance(1000);assert.equal(audio.src,'/en.wav');assert.equal(audio.playbackRate,.6);
});
test('seeking across the Chinese-English boundary while paused does not resume the voice',async()=>{
 const {engine,audio}=setup();engine.play(clips);audio.loaded();await flush();engine.pause();engine.seek(4);assert.equal(audio.src,'/en.wav');audio.duration=4;audio.loaded();await flush();assert.equal(audio.currentTime,1);assert.equal(engine.snapshot().status,'paused');assert.equal(audio.playCalls,1);
});
test('missing audio clears the previous source without speaking through a different language or fallback voice',async()=>{
 const {engine,audio}=setup();engine.play(clips);audio.loaded();await flush();engine.play([{...clips[1],src:undefined}]);assert.equal(audio.src,'');assert.equal(engine.snapshot().status,'error');assert.equal(audio.playCalls,1);engine.stop();assert.equal(engine.snapshot().status,'idle');assert.equal(engine.snapshot().queue.length,0);
});
const englishClips:Segment[]=[{...clips[1],id:'en-first',src:'/first.wav',duration:2},{...clips[1],id:'en-next',src:'/next.wav',duration:3}];
test('all four pause options take effect at their exact duration, including half seconds',async()=>{
 for(const seconds of [.5,1,1.5,2]){
  const {engine,audio,clock}=setup();engine.changeGap(seconds);engine.play(englishClips);audio.duration=12;audio.loaded();await flush();audio.finish();assert.equal(engine.snapshot().gapRemaining,seconds);clock.advance(seconds*1000-1);assert.equal(audio.src,'/first.wav');clock.advance(1);assert.equal(audio.src,'/next.wav');
 }
});
test('English defaults to 75 percent speed with pitch preserved and a one-second follow-along gap',async()=>{
 const {engine,audio,clock}=setup();engine.play(englishClips);audio.duration=2;audio.loaded();await flush();assert.equal(audio.playbackRate,.75);assert.equal(audio.preservesPitch,true);audio.finish();assert.equal(engine.snapshot().status,'waiting');assert.equal(engine.snapshot().gapRemaining,1);assert.equal(engine.snapshot().queue[engine.snapshot().index].text,englishClips[0].text);assert.equal(engine.snapshot().elapsed,2);clock.advance(999);assert.equal(audio.src,'/first.wav');clock.advance(1);assert.equal(audio.src,'/next.wav');assert.equal(engine.snapshot().status,'loading');
});
test('long sentences respect the selected pause without automatically extending it',async()=>{
 const {engine,audio,clock}=setup();engine.play(englishClips);audio.duration=12;audio.loaded();await flush();audio.finish();assert.equal(engine.snapshot().gapRemaining,1);clock.advance(999);assert.equal(audio.src,'/first.wav');clock.advance(1);assert.equal(audio.src,'/next.wav');
});
test('pausing a follow-along gap freezes it, and resume finishes the remaining gap without replaying the sentence',async()=>{
 const {engine,audio,clock}=setup();engine.play(englishClips);audio.duration=2;audio.loaded();await flush();audio.finish();clock.advance(250);engine.pause();const frozen=engine.snapshot().gapRemaining;clock.advance(10000);assert.equal(engine.snapshot().status,'paused');assert.equal(engine.snapshot().gapRemaining,frozen);assert.equal(audio.src,'/first.wav');engine.resume();assert.equal(engine.snapshot().status,'waiting');assert.equal(audio.playCalls,1);clock.advance(749);assert.equal(audio.src,'/first.wav');clock.advance(1);assert.equal(audio.src,'/next.wav');
});
test('I have finished reading skips the gap once, and its canceled timer never skips another sentence',async()=>{
 const {engine,audio,clock}=setup();engine.play(englishClips);audio.duration=2;audio.loaded();await flush();audio.finish();engine.skipWait();assert.equal(audio.src,'/next.wav');assert.equal(engine.snapshot().index,1);audio.loaded();await flush();clock.advance(10000);assert.equal(engine.snapshot().status,'playing');assert.equal(engine.snapshot().index,1);assert.equal(audio.playCalls,2);
});
test('switching courses, stopping, or unmounting during the gap cancels the old continuation',async()=>{
 for(const action of ['switch','stop','dispose']){const {engine,audio,clock}=setup();let done=0;engine.play(englishClips,()=>done++);audio.loaded();await flush();audio.finish();if(action==='switch')engine.play([{...clips[0],id:'new-course',src:'/new-course.wav'}]);else if(action==='stop')engine.stop();else engine.dispose();clock.advance(20000);assert.equal(done,0);assert.equal(clock.pending(),0);if(action==='switch'){assert.equal(audio.src,'/new-course.wav');assert.equal(engine.snapshot().status,'loading');}else assert.equal(audio.src,'');}
});
test('seeking during a follow-along gap cancels the old gap and keeps audio-driven animation time',async()=>{
 const {engine,audio,clock}=setup();engine.play(englishClips);audio.duration=2;audio.loaded();await flush();audio.finish();engine.seek(1);audio.loaded();await flush();assert.equal(audio.currentTime,1);assert.equal(engine.snapshot().elapsed,1);assert.equal(engine.snapshot().gapRemaining,0);clock.advance(10000);assert.equal(audio.src,'/first.wav');assert.equal(engine.snapshot().status,'playing');
});
test('longer selected pauses and loop repeats also give time to speak',async()=>{
 const {engine,audio,clock}=setup();engine.changeGap(2);engine.play(englishClips);audio.duration=2;audio.loaded();await flush();engine.toggleLoop();audio.finish();assert.equal(engine.snapshot().gapRemaining,2);clock.advance(1999);assert.equal(engine.snapshot().status,'waiting');clock.advance(1);assert.equal(audio.src,'/first.wav');assert.equal(engine.snapshot().status,'loading');assert.equal(engine.snapshot().gapSeconds,2);assert.equal(audio.playbackRate,.75);
});
test('selecting a longer pause also extends the current sentence without counting paused time',async()=>{
 const {engine,audio,clock}=setup();engine.play(englishClips);audio.duration=2;audio.loaded();await flush();audio.finish();clock.advance(250);engine.pause();engine.changeGap(2);assert.equal(engine.snapshot().gapRemaining,1.8);clock.advance(20000);assert.equal(audio.src,'/first.wav');engine.resume();clock.advance(1749);assert.equal(audio.src,'/first.wav');clock.advance(1);assert.equal(audio.src,'/next.wav');
});
test('Level 1 guided reading starts at 60 percent speed while Mandarin stays natural and same-level navigation respects the selected rate',async()=>{
 const {engine,audio,clock}=setup(1,'guided');assert.equal(engine.snapshot().rate,.6);engine.play(clips);audio.loaded();await flush();assert.equal(audio.playbackRate,1);audio.finish();clock.advance(1000);assert.equal(audio.playbackRate,.6);assert.equal(audio.preservesPitch,true);engine.changeRate(.75);engine.setLevel(1);assert.equal(engine.snapshot().rate,.75);engine.setLevel(2);assert.equal(engine.snapshot().rate,.75);engine.setLevel(1);assert.equal(engine.snapshot().rate,.6);
});
test('the reported list defaults to one second between book, pencil, crayon and bag',async()=>{
 const lesson=defaultUnit.lessons.find(l=>l.id==='vocabulary')!,parts=narrationSegments(defaultUnit,lesson,true,'guided').slice(0,4).map((p,i)=>({...p,src:`/phrase-${i}.wav`,duration:1}));
 const {engine,audio,clock}=setup(1,'guided');let done=0;engine.play(parts,()=>done++);
 for(let i=0;i<parts.length;i++){
  audio.duration=1;audio.loaded();await flush();assert.equal(audio.src,`/phrase-${i}.wav`);assert.equal(audio.playbackRate,.6);audio.finish();assert.equal(engine.snapshot().gapRemaining,1);assert.equal(engine.snapshot().queue[engine.snapshot().index].focusWord,parts[i].focusWord);clock.advance(999);assert.equal(engine.snapshot().index,i);assert.equal(done,0);clock.advance(1);
 }
 assert.equal(done,1);assert.equal(audio.playCalls,4);
});
test('natural mode plays one full sentence with no word-level timers, and only pauses after the sentence ends',async()=>{
 const lesson=defaultUnit.lessons.find(l=>l.id==='vocabulary')!,queue=narrationSegments(defaultUnit,lesson,true,'natural').map((s,i)=>({...s,src:`/natural-${i}.wav`,duration:6}));
 const {engine,audio,clock}=setup(1,'natural');engine.play(queue);audio.duration=6;audio.loaded();await flush();
 assert.equal(engine.snapshot().rate,.75);assert.equal(engine.snapshot().queue[0].text,'A book, a pencil, a crayon and a bag.');assert.equal(audio.playCalls,1);assert.equal(clock.pending(),0);
 audio.currentTime=3;clock.advance(3000);assert.equal(audio.src,'/natural-0.wav');assert.equal(engine.snapshot().status,'playing');assert.equal(clock.pending(),0);
 audio.finish();assert.equal(engine.snapshot().gapRemaining,1);clock.advance(999);assert.equal(audio.src,'/natural-0.wav');clock.advance(1);assert.equal(audio.src,'/natural-1.wav');
});
test('switching reading modes uses their recommended rate while preserving the requested pause duration',()=>{
 const {engine}=setup(1,'natural');engine.changeGap(.5);assert.equal(engine.snapshot().rate,.75);engine.setReadingMode('guided');assert.equal(engine.snapshot().rate,.6);assert.equal(engine.snapshot().gapSeconds,.5);engine.changeRate(1);engine.setReadingMode('guided');assert.equal(engine.snapshot().rate,1);engine.setReadingMode('natural');assert.equal(engine.snapshot().rate,.75);assert.equal(engine.snapshot().gapSeconds,.5);
});

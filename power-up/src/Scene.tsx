import {useEffect,useState}from 'react';
import type {Unit,Lesson}from './types';
import Icon from './Icons';
import ConceptScene,{conceptFor}from './ConceptScenes';
export function Buddy({x=0,y=0,scale=1,shirt='#f0bd65',girl=false,wave=0}:{x?:number;y?:number;scale?:number;shirt?:string;girl?:boolean;wave?:number}){
 return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#3c5146" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M-17 83-20 114m37-31 6 31" strokeWidth="10"/><path d="m-21 115-10 1m54-1 10 1" strokeWidth="9"/><path d="M-20 44Q0 33 20 44l5 42h-50Z" fill={shirt}/><path d="M-19 48-36 72" stroke="#dca783" strokeWidth="9"/><path d={`M19 48 35 ${58-wave*18} 41 ${44-wave*23}`} fill="none" stroke="#dca783" strokeWidth="9"/>{girl&&<path d="M-25 5q-20 9-9 35m59-35q20 9 9 35" fill="#504235"/>}<ellipse cy="10" rx="26" ry="29" fill="#f0c4a3"/><path d="M-25 8q-9-38 24-32 27-8 28 28L11-9l-4 8-15-9Z" fill="#514236"/><path d="M-10 10v3m20-3v3"/><path d="M-5 25q5 5 10 0" fill="none"/><path d="m-22 20 7 1m30-1 7-1" stroke="#e7a28c" strokeWidth="4"/></g>;
}
export function Item({name,x=0,y=0,scale=1}:{name:string;x?:number;y?:number;scale?:number}){
 const n=name.toLowerCase();
 const common={stroke:'#426353',strokeWidth:2.5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 let shape:React.ReactNode;
 if(/crayon|pencil|pen\b/.test(n))shape=<g transform="rotate(-28)"><path d="M-28-9h43l12 9-12 9h-43Z" fill="#efb551"/><path d="M15-9v18M-20-9v18"/><path d="m20-5 7 5-7 5" fill="#426353"/><path d="M-28-9h8V9h-8Z" fill="#df865f"/></g>;
 else if(/book|diary|story/.test(n))shape=<><path d="M0-17q-18-10-35-4v46q18-6 35 4 17-10 35-4v-46Q18-27 0-17Z" fill="#f1c96a"/><path d="M0-17v46M-27-10l17 4m-17 6 17 4m-17 6 17 4M10-6l17-4M10 4l17-4"/></>;
 else if(/desk|table/.test(n))shape=<><path d="M-40-7h80v13h-80Z" fill="#cda179"/><path d="m-32 6-5 39M32 6l5 39" strokeWidth="7"/><path d="M-37 29h74"/></>;
 else if(/chair/.test(n))shape=<><path d="M-24-28h48v32h-48Z" fill="#9dbfb0"/><path d="M-29 4h58v10h-58Z" fill="#cda179"/><path d="m-20 14-5 28m45-28 5 28" strokeWidth="6"/></>;
 else if(/window/.test(n))shape=<><rect x="-32" y="-34" width="64" height="65" rx="3" fill="#cbe1de"/><path d="M0-34v65M-32-3h64M-24-24l14 14m17-12 9 9" stroke="#fffdf6" strokeWidth="4"/></>;
 else if(/ruler/.test(n))shape=<g transform="rotate(-20)"><rect x="-38" y="-13" width="76" height="26" rx="3" fill="#f0cf6d"/><path d="M-27-13v10m11-10v6m11-6v10m11-10v6m11-6v10m11-10v6"/></g>;
 else if(/bag/.test(n))shape=<><path d="M-23-18q-3-20 23-20t23 20" fill="none"/><rect x="-32" y="-22" width="64" height="59" rx="15" fill="#dc8d6e"/><rect x="-20" y="4" width="40" height="24" rx="6" fill="#eab18f"/><path d="M-20 12h40M-12-10h24"/></>;
 else if(/clock|time|hour/.test(n))shape=<><circle r="33" fill="#fbf6df"/><path d="M0-22v23l16 8" strokeWidth="4"/><path d="M0-28v3m28 3h-3M0 28v-3m-28-3h3"/></>;
 else if(/apple|fruit/.test(n))shape=<><path d="M0-18C-36-43-43 8-18 29q11 7 18 1 11 7 20-2C47 3 32-41 0-18Z" fill="#dc8362"/><path d="M0-18q-3-15 6-22"/><path d="M4-27q21 1 21-14-17-3-21 14" fill="#9fbd83"/></>;
 else if(/tree|plant|flower|forest/.test(n))shape=<><path d="M0 34v-44" strokeWidth="8"/><path d="M0 1C-40 8-43-31-16-32-13-58 30-49 27-25 60-4 26 22 0 1" fill="#95b78c"/><path d="M0 10-15-7M0-2l13-12"/></>;
 else if(/teacher/.test(n))shape=<Buddy y={-30} scale={.55} girl/>;
 else shape=<><path d="M-31-16 0-31l31 15v41L0 38l-31-13Z" fill="#e8c578"/><path d="M-31-16 0-2l31-14M0-2v40"/><path d="m-14-24 30 14"/></>;
 return <g transform={`translate(${x} ${y}) scale(${scale})`} {...common}>{shape}</g>;
}
export function HeroArt({theme='school'}:{theme?:string}){
 const school=theme==='school';
 return <svg viewBox="0 0 340 180" fill="none" aria-hidden="true" className="hero-art"><ellipse cx="177" cy="154" rx="141" ry="13" fill="#ccd9b8" opacity=".5"/><path d="M22 20q110 36 290-10" stroke="#9cae83" strokeWidth="1.5"/>{[0,1,2,3,4,5,6].map(i=><path key={i} d={`m${38+i*39} ${25+Math.sin(i/2)*5} 12 18 12-16Z`} fill={['#e4af65','#8aafa0','#e6c667'][i%3]}/>)}<rect x="122" y="51" width="168" height="87" rx="7" fill="#d0aa7b"/><rect x="129" y="58" width="154" height="73" rx="3" fill="#3d6c59"/><text x="206" y="88" textAnchor="middle" fill="#faf5d7" fontSize="20" fontFamily="Georgia,serif" transform="rotate(-3 206 88)">{school?'Hello, world!':'Let’s explore!'}</text><path d="M163 104h84m-71 9h58" stroke="#e5eed4" strokeWidth="2" strokeLinecap="round" opacity=".5"/><Buddy x={85} y={82} scale={.58} shirt="#edc96e" girl wave={.7}/><Item name={school?'desk':'book'} x={198} y={148} scale={.9}/><Item name={school?'pencil':'plant'} x={school?185:302} y={school?130:136} scale={school?.55:.65}/><path d="m304 53 3-9m5 18 9-2M38 89l-7-5" stroke="#bd9758" strokeWidth="2.5" strokeLinecap="round"/><circle cx="31" cy="64" r="3" fill="#e3ad62"/></svg>;
}
function SchoolScene({position,p,word}:{position:string;p:number;word:string}){
 const target:Record<string,[number,number]>={on:[359,190],under:[356,268],in:[516,208],'next to':[441,194]};
 const [tx,ty]=target[position]??target.under,ease=1-Math.pow(1-Math.min(1,p*2),3),x=180+(tx-180)*ease,y=173+(ty-173)*ease;
 return <svg viewBox="0 0 680 345" className="school-scene" role="img" aria-label={`教室场景：${word}；蜡笔的位置是 ${position}`}>
  <defs><pattern id="floor-lines" width="60" height="35" patternUnits="userSpaceOnUse"><path d="M0 0h60M0 0v35" stroke="#b8c4a6" strokeWidth=".7" opacity=".35"/></pattern></defs>
  <rect width="680" height="345" rx="16" fill="#eaf0df"/><path d="M0 269h680v76H0Z" fill="#e2e8d5"/><path d="M0 269h680v76H0Z" fill="url(#floor-lines)"/>
  <path d="M0 269h680" stroke="#ccd5be" strokeWidth="2"/>
  <rect x="211" y="42" width="245" height="110" rx="6" fill="#c49c72"/><rect x="218" y="49" width="231" height="96" rx="3" fill="#3e6957"/>
  <text x="333" y="80" textAnchor="middle" fill="#f8f4d9" fontSize="14" fontFamily="Georgia,serif">A little English, every day.</text><path d="M270 95h127m-106 14h87" stroke="#c7ddc2" strokeWidth="2" strokeLinecap="round"/>
  <Item name="window" x={94} y={103} scale={1.18}/><path d="M47 145h94" stroke="#b99b78" strokeWidth="5"/>
  <g transform="translate(584 88)"><circle r="26" fill="#fbf7e8" stroke="#93a68e" strokeWidth="2"/><path d="M0-18V0l12 7" stroke="#57725e" strokeWidth="2" strokeLinecap="round"/></g>
  <Buddy x={154} y={198} scale={.66} shirt="#edc56c" girl wave={ease*.65}/>
  <g stroke="#6b7b5e" strokeWidth="2.5" strokeLinecap="round"><path d="M276 205h166v15H276Z" fill="#d6b084"/><path d="m292 220-8 65m139-65 8 65" strokeWidth="8"/><path d="M292 253h131"/><path d="M470 225h73v12h-73Z" fill="#c3aa84"/><path d="m477 237-4 51m63-51 4 51" strokeWidth="6"/></g>
  <Item name="bag" x={517} y={205} scale={.67}/><Item name="book" x={400} y={194} scale={.55}/>
  <g transform={`translate(${x} ${y})`}><ellipse cy="17" rx="30" ry="5" fill="#9aa779" opacity=".18"/><Item name="crayon" scale={.7}/></g>
  {position==='in'&&ease>.85&&<path d="M496 207h40v17q0 7-7 7h-26q-7 0-7-7Z" fill="#eab18f" stroke="#426353" strokeWidth="1.7"/>}
  {p>.4&&<g transform={`translate(${Math.min(563,x+45)} ${y-30})`}><rect x="-12" y="-17" width="87" height="34" rx="17" fill="#fffdf5" stroke="#e0d8bc"/><text x="32" y="5" textAnchor="middle" fill="#3c6954" fontSize="17" fontWeight="600">{position}</text></g>}
  <path d="M593 258v-40m0 10q-28 0-24-22 25-2 24 22Zm0 16q27-2 23-22-23 0-23 22Z" fill="#92ad80" stroke="#749465" strokeWidth="2"/><path d="M575 257h37l-5 28h-27Z" fill="#cc9776" stroke="#a58165" strokeWidth="2"/>
  <g transform="translate(34 305)"><circle r="4" fill="#8ca77e"/><text x="14" y="4" fontSize="11" fill="#728267">LOOK · LISTEN · DISCOVER</text></g>
 </svg>;
}
function WordScene({unit,p,onWord,wordIndex}:{unit:Unit;p:number;onWord:(index:number)=>void;wordIndex:number}){
 const start=Math.max(0,Math.min(wordIndex-5,unit.vocabulary.length-6));
 return <div className="word-scene" role="group" aria-label="点击场景中的单词"><div className="scene-topline"><span>MY LITTLE WORD WORLD</span><span><Icon name="volume" size={14}/> 点一点，听一听</span></div><div className="scene-word-grid">{unit.vocabulary.slice(start,wordIndex<0?unit.vocabulary.length:start+6).map((word,offset)=>{const i=start+offset;return <button key={word.en} data-vocabulary-word={word.en} aria-pressed={wordIndex===i} className={`scene-word ${wordIndex===i?'selected':''}`} style={{opacity:.45+.55*Math.min(1,Math.max(0,p*7-i*.12+.8))}} onClick={()=>onWord(i)}><span className="word-picture">{unit.theme==='school'?<svg viewBox="-55 -55 110 110" aria-hidden="true"><Item name={word.en} scale={.9}/></svg>:<span>{word.icon}</span>}</span><strong lang="en-GB">{word.en}</strong><small>{word.zh}</small>{wordIndex===i&&<span className="tiny-speaker"><Icon name="volume" size={12}/></span>}</button>;})}</div><div className="scene-grass"><span/> <span/> <span/></div></div>;
}
function Sentence({lesson,p,englishActive,text}:{lesson:Lesson;p:number;englishActive:boolean;text?:string}){
 const words=(text??lesson.exampleEn).split(/\s+/),active=Math.min(words.length-1,Math.floor(p*words.length));
 return <div className="sentence-builder"><div className="scene-topline"><span>MAKE THE LANGUAGE VISIBLE</span><Icon name="spark" size={17}/></div><div className="sentence-art"><BuddySvg/><div className="speech-cloud"><span>Let’s say it together!</span><Icon name="volume" size={21}/></div></div><div className="sentence-words" lang="en-GB">{words.map((word,i)=>{const focus=lesson.focus.some(f=>f.toLowerCase().split(/\s+/).includes(word.replace(/[.,?!]/g,'').toLowerCase()));return <span key={`${word}-${i}`} className={`${focus?'focus-word':''} ${englishActive&&i===active?'speaking-word':''}`} style={{transform:`translateY(${(1-Math.min(1,Math.max(0,p*4-i*.07+.5)))*12}px)`}}>{word}</span>;})}</div><p>{lesson.exampleZh}</p><div className="rule-chips">{lesson.focus.map(f=><span key={f}>{f}</span>)}</div></div>;
}
function BuddySvg(){return <svg viewBox="0 0 100 140" aria-hidden="true"><Buddy x={48} y={25} scale={.8} wave={.5}/></svg>;}
function QuantityScene({unit,lesson,p}:{unit:Unit;lesson:Lesson;p:number}){
 const noun=unit.theme==='school'?'bag':unit.theme==='town'?'car':unit.vocabulary[0]?.en??'book';
 const existence=lesson.focus.some(f=>/there (?:is|are)/i.test(f));
 return <div className="quantity-scene"><div className="scene-topline"><span>ONE OR MORE? LOOK & COUNT.</span><Icon name="bulb" size={17}/></div><div className="quantity-pictures">{[1,2].map(n=><div key={n}><span>{n===1?'一个':'多个'}</span><svg viewBox="0 0 180 105" role="img" aria-label={existence?n===1?'一辆公共汽车':'两只狮子':`${n} 个 ${noun}`}>{Array.from({length:n},(_,i)=><g key={i} opacity={n===1?1:Math.min(1,Math.max(0,p*3-i*.25+.3))}>{existence?<text x={n===1?90:52+i*77} y="67" textAnchor="middle" fontSize="46">{n===1?'🚌':'🦁'}</text>:<Item name={noun} x={n===1?90:52+i*77} y={50} scale={.75}/>}</g>)}</svg><strong lang="en-GB">{existence?n===1?'there is a bus':'there are two lions':n===1?'this → it is':'these → they are'}</strong><small>{n===1?'单数':'复数'}</small></div>)}</div><p lang="en-GB">{lesson.exampleEn}</p><small>{lesson.exampleZh}</small></div>;
}
export default function LearningScene({unit,lesson,p,englishActive,activeText,wordIndex,onWord,onPosition,playing,onInteract}:{unit:Unit;lesson:Lesson;p:number;englishActive:boolean;activeText?:string;wordIndex:number;onWord:(i:number)=>void;onPosition:(position:string)=>void;playing:boolean;onInteract?:()=>void}){
 const basePosition=lesson.exampleEn.match(/\b(next to|under|on|in) the (?:desk|bag|book)\b/i)?.[1].toLowerCase()??'under';
 const [position,setPosition]=useState(basePosition);
 useEffect(()=>setPosition(basePosition),[lesson.id,basePosition]);
 useEffect(()=>{if(englishActive&&activeText){const pos=activeText.match(/\b(next to|under|on|in) the (?:desk|bag|book)\b/i)?.[1];if(pos)setPosition(pos.toLowerCase());}},[activeText,englishActive]);
 const visual=lesson.visual;
 const concept=conceptFor(unit,lesson);
 const quantity=lesson.focus.some(f=>/\bthis\b|\bthese\b|\bthere (?:is|are)\b/i.test(f))||/there (?:is|are)/i.test(lesson.titleEn);
 const future=/going to|\bwill\b|tomorrow|next week/i.test(lesson.exampleEn),timeTarget=future?450:90;
 const storyIndex=activeText?lesson.story?.findIndex(s=>s.en.includes(activeText))??-1:-1;
 return <div className={`learning-scene scene-${visual} ${playing?'scene-playing':''}`} role="group" aria-label={`${lesson.titleZh}：${lesson.goalZh}`}>
  {concept?<ConceptScene type={concept} unit={unit} lesson={lesson} p={p} text={activeText} englishActive={englishActive} onInteract={onInteract}/>:
  visual==='position'?<><SchoolScene position={position} p={englishActive?p:.8} word="crayon"/><div className="position-options" aria-label="改变蜡笔位置">{['on','under','in','next to'].map(pos=><button key={pos} className={position===pos?'active':''} aria-pressed={position===pos} onClick={()=>{setPosition(pos);onPosition(pos);}}>{pos}<small>{({on:'上面',under:'下面',in:'里面','next to':'旁边'})[pos]}</small></button>)}</div></>:
  visual==='words'?<WordScene unit={unit} p={p} wordIndex={wordIndex} onWord={onWord}/>:
  visual==='sounds'?<div className="sounds-scene"><div className="scene-topline"><span>LISTEN CLOSELY</span><Icon name="ear" size={18}/></div><div className="sound-wave">{Array.from({length:31},(_,i)=><i key={i} style={{height:8+Math.abs(Math.sin(i*.65+p*7))*40,opacity:englishActive?.5+.5*Math.sin(i*.2+p*8):.35}}/>)}</div><div className="phonics-pairs">{(lesson.phonics??lesson.focus.map(f=>({spelling:f,sound:'',word:f}))).map((phon,i)=><div key={i}><strong>{phon.spelling}</strong>{phon.sound&&<span className="phoneme">{phon.sound}</span>}<span className="sound-word" lang="en-GB">{phon.word}</span></div>)}</div><p>先听完整单词，再发现相同的声音。</p><small>字母写法和发出的声音，有时并不相同。</small></div>:
  visual==='story'?<div className="story-scene"><div className="scene-topline"><span>OUR LITTLE STORY</span><span>原创情境故事</span></div><div className="story-characters"><svg viewBox="0 0 400 150" role="img" aria-label="故事中的两位小伙伴"><ellipse cx="200" cy="130" rx="160" ry="12" fill="#d9e3c9"/><Buddy x={105} y={36} scale={.75} girl wave={p*.8}/><Buddy x={298} y={36} scale={.75} shirt="#91b9af" wave={.3}/><Item name={unit.vocabulary[0]?.en??'book'} x={201} y={105} scale={.6}/><path d="m192 30 4-9 5 9 10 2-8 7 2 11-9-5-10 5 2-11-8-7Z" fill="#edc76c"/></svg></div><div className="story-lines">{(lesson.story??[{en:lesson.exampleEn,zh:lesson.exampleZh}]).map((line,i)=><div className={i===storyIndex?'active':''} key={i}><span>{String(i+1).padStart(2,'0')}</span><p><strong lang="en-GB">{line.en}</strong><small>{line.zh}</small></p></div>)}</div></div>:
  visual==='timeline'?<div className="timeline-scene"><div className="scene-topline"><span>A LITTLE JOURNEY IN TIME</span><Icon name="clock" size={18}/></div><div className="timeline-illustration"><svg viewBox="0 0 540 124" role="img" aria-label={`用时间线理解${future?'将来计划':'过去发生的事'}`}><path d="M47 83h440m-10-7 10 7-10 7" stroke="#97ad89" strokeWidth="3" strokeLinecap="round"/>{[90,270,450].map((x,i)=><g key={i}><circle cx={x} cy="83" r="7" fill={i===1?'#285d4c':'#d2dfc2'}/><text x={x} y="112" textAnchor="middle" fontSize="15" fill="#5e745e">{['过去','现在','将来'][i]}</text></g>)}<g transform={`translate(${270+(timeTarget-270)*Math.min(1,p*2)} 37)`}><path d="m0-17 7 13 15 2-11 10 2 15-13-7-13 7 2-15-11-10 15-2Z" fill="#e9bb5f"/></g></svg></div><div className="timeline-sentence" lang="en-GB">{activeText&&englishActive?activeText:lesson.exampleEn}</div><p>{lesson.exampleZh}</p><div className="rule-chips">{lesson.focus.map(f=><span key={f}>{f}</span>)}</div></div>:
  visual==='compare'&&quantity?<QuantityScene unit={unit} lesson={lesson} p={p}/>:
  visual==='compare'?<div className="compare-scene"><div className="scene-topline"><span>LOOK, COMPARE & SAY</span><Icon name="bulb" size={17}/></div><div className="compare-bars">{[.45,.7,1].map((v,i)=><div key={i}><span>{['A','B','C'][i]}</span><div style={{height:35+v*85*(.5+p*.5)}}/><small>{['观察','比较','发现'][i]}</small></div>)}</div><div className="timeline-sentence" lang="en-GB">{lesson.exampleEn}</div><p>{lesson.exampleZh}</p><div className="rule-chips">{lesson.focus.map(f=><span key={f}>{f}</span>)}</div></div>:
  visual==='mission'?<div className="mission-scene"><div className="scene-topline"><span>YOUR LITTLE BIG MISSION</span><Icon name="star" size={17}/></div><span className="mission-stamp"><Icon name="star" size={30}/></span><h3>{unit.missionZh}</h3><div className="mission-checklist">{['想一想：我想表达什么？','选一选：用上今天的单词。','说一说：把想法变成英语。'].map((s,i)=><p key={s}><span className={p>(i+1)/4?'checked':''}>{p>(i+1)/4?<Icon name="check" size={13}/>:i+1}</span>{s}</p>)}</div><span className="mission-example" lang="en-GB">{lesson.exampleEn}</span></div>:
  <Sentence lesson={lesson} p={p} englishActive={englishActive} text={englishActive?activeText:undefined}/>}
 </div>;
}

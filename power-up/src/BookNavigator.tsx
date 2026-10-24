import Icon from './Icons';
import {units,levelInfo,lessonKey} from './content';
import {completedInUnit} from './progress';
import type {Level,Unit,Lesson,Progress} from './types';

const topics:Record<Level,string>={
 1:'学校 · 家人 · 食物 · 运动',
 2:'一周作息 · 动物 · 天气 · 城镇',
 3:'健康 · 丛林 · 舞台 · 旅行',
};

export function BookShelf({level,onSelect}:{level:Level;onSelect:(level:Level)=>void}){
 return <section className="book-shelf" aria-label="三册教材入口">
  <div className="book-shelf-heading"><h2>选一本，开始探索</h2><span>第一版 · 动画 / 双语 / 练习</span></div>
  <div className="book-shelf-grid">{([1,2,3] as Level[]).map(n=>{
   const book=units.filter(u=>u.level===n),count=book.reduce((sum,u)=>sum+u.lessons.length,0);
   return <button key={n} className={`book-entry book-entry-${n} ${level===n?'active':''}`} aria-pressed={level===n} onClick={()=>onSelect(n)}>
    <span className="book-entry-number" aria-hidden="true">{n}</span>
    <span className="book-entry-copy"><strong lang="en-GB">Power Up {n}</strong><span>{levelInfo[n].label}</span><small>{book.length} 个单元 · {count} 节微课</small><small className="book-topics">{topics[n]}</small></span>
    <span className="book-entry-action">{level===n?'正在学习':'进入课堂'}<Icon name={level===n?'check':'arrow'} size={14}/></span>
   </button>;
  })}</div>
 </section>;
}

export function BookContents({unit,lesson,progress,onVisit}:{unit:Unit;lesson:Lesson;progress:Progress;onVisit:(unit:Unit,lesson?:Lesson)=>void}){
 const book=units.filter(u=>u.level===unit.level),count=book.reduce((sum,u)=>sum+u.lessons.length,0);
 return <details key={unit.level} className="book-contents">
  <summary><span><Icon name="book" size={18}/><strong>Power Up {unit.level} 本册课程目录</strong></span><span>{book.length} 个单元 · {count} 节微课 <Icon name="chevron" size={15}/></span></summary>
  <div className="book-contents-body"><p>选单元或微课进入动画课堂。每节课都有中文讲解、英文示范和小练习。</p>
   {book.map(u=><section key={u.id} className={`book-unit${u.id===unit.id?' active':''}`}>
    <button className="book-unit-title" onClick={()=>onVisit(u)}><span>{u.number===0?'导入':`Unit ${u.number}`}</span><strong><span lang="en-GB">{u.title}</span><small>{u.titleZh}</small></strong><small>{completedInUnit(progress,u)}/{u.lessons.length} 节</small><Icon name="arrow" size={15}/></button>
    <div className="book-lesson-links">{u.lessons.map(l=><button key={l.id} className={u.id===unit.id&&l.id===lesson.id?'active':''} aria-current={u.id===unit.id&&l.id===lesson.id?'step':undefined} onClick={()=>onVisit(u,l)}><Icon name={progress.records[lessonKey(u,l)]?.completed?'check':'play'} size={12}/>{l.titleZh}</button>)}</div>
   </section>)}
   <small className="book-content-note">依据官方单元纲要编排，例句、故事与练习为原创，词汇为代表性选编。</small>
  </div>
 </details>;
}

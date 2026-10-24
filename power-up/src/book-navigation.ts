import {units,defaultUnit} from './content.ts';
import {loadProgress} from './progress.ts';
import type {Level,Progress,Unit} from './types.ts';

export function bookEntry(progress:Progress,level:Level):Unit{
 const current=units.find(u=>u.id===progress.selectedUnit&&u.level===level);
 return current??units.find(u=>u.level===level&&u.number===1)!;
}

export function selectBook(progress:Progress,level:Level):Progress{
 const unit=bookEntry(progress,level);
 const lesson=unit.lessons.find(l=>unit.id===progress.selectedUnit&&l.id===progress.selectedLesson)??unit.lessons[0];
 return {...progress,selectedUnit:unit.id,selectedLesson:lesson.id};
}

export function progressForBookLink(progress:Progress,search:string):Progress{
 const book=new URLSearchParams(search).get('book');
 return book==='1'||book==='2'||book==='3'?selectBook(progress,Number(book) as Level):progress;
}

export function loadBookProgress():Progress{
 const progress=loadProgress();
 return typeof window==='undefined'?progress:progressForBookLink(progress,window.location.search);
}

export function activeBook(progress:Progress):Level{
 return (units.find(u=>u.id===progress.selectedUnit)??defaultUnit).level;
}

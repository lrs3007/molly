import assert from 'node:assert/strict';
import {createServer}from 'vite';
import React from 'react';
import {renderToStaticMarkup}from 'react-dom/server';
const server=await createServer({server:{middlewareMode:true,watch:null,hmr:false,ws:false},appType:'custom'});
try{
 const {default:App,NarrationText}=await server.ssrLoadModule('/src/App.tsx');
 const {default:Scene}=await server.ssrLoadModule('/src/Scene.tsx');
 const {units,defaultUnit,narrationSegments}=await server.ssrLoadModule('/src/content.ts');
 const {default:Games,Ordering,Listening}=await server.ssrLoadModule('/src/LearningGames.tsx');
 const html=renderToStaticMarkup(React.createElement(App));
 for(const label of ['Power Up','Our new school','开始讲解','双语讲解','英文练习','课桌','我的复习','学习足迹','单元小练习','本单元微课'])assert.ok(html.includes(label),label);
 assert.ok(html.includes('三册教材入口')&&html.includes('Power Up 2')&&html.includes('Power Up 3'),'All books must be visible outside the mobile sidebar');
 const {emptyProgress}=await server.ssrLoadModule('/src/progress.ts');
 for(const level of [2,3]){
  const previous=emptyProgress();
  globalThis.window={location:{search:`?book=${level}`},localStorage:{getItem:()=>JSON.stringify(previous)}};
  try{
   const bookHtml=renderToStaticMarkup(React.createElement(App)),unit=units.find(u=>u.level===level&&u.number===1);
   assert.ok(bookHtml.includes(`<h1 lang="en-GB">${unit.title}<`),'Book link must change the actual classroom heading');
   assert.ok(bookHtml.includes(`Power Up ${level} 本册课程目录`));
   assert.equal((bookHtml.match(/class="book-unit(?: active)?"/g)??[]).length,10);
   assert.equal((bookHtml.match(/class="book-lesson-links"/g)??[]).length,10);
   for(const u of units.filter(u=>u.level===level))for(const l of u.lessons)assert.ok(bookHtml.includes(l.titleZh),'The book directory must expose all 66 lessons');
  }finally{delete globalThis.window;}
 }
 assert.match(html,/<option(?=[^>]*value="0\.75")(?=[^>]*selected)[^>]*>/,'Natural reading must select 0.75 speed by default');
 const vocabulary=defaultUnit.lessons.find(l=>l.id==='vocabulary');
 assert.ok(html.includes('整句连读')&&html.includes('词组跟读'));
 const naturalSegment=narrationSegments(defaultUnit,vocabulary,true,'natural')[0];
 const naturalSubtitle=renderToStaticMarkup(React.createElement(NarrationText,{segment:naturalSegment,fallback:''}));
 assert.equal(naturalSubtitle,naturalSegment.text);assert.ok(!naturalSubtitle.includes('<mark'));
 for(const segment of narrationSegments(defaultUnit,vocabulary,true,'guided').slice(0,4)){
  const subtitle=renderToStaticMarkup(React.createElement(NarrationText,{segment,fallback:''}));
  assert.equal(subtitle.replace(/<[^>]*>/g,''),segment.sentenceText,'Keep the entire reported sentence visible');
  assert.ok(subtitle.includes(`<mark class="current-reading-phrase">${segment.text}</mark>`),'Highlight only the currently spoken phrase');
 }
 const teacherScene=renderToStaticMarkup(React.createElement(Scene,{unit:defaultUnit,lesson:vocabulary,p:1,englishActive:true,wordIndex:6,onWord:()=>{},onPosition:()=>{},playing:false}));
 assert.ok(teacherScene.includes('data-vocabulary-word="teacher" aria-pressed="true"'),'The matching picture must stay visible even beyond the first six words');
 const naturalScene=renderToStaticMarkup(React.createElement(Scene,{unit:defaultUnit,lesson:vocabulary,p:.5,englishActive:true,wordIndex:-1,onWord:()=>{},onPosition:()=>{},playing:true}));
 for(const word of defaultUnit.vocabulary)assert.ok(naturalScene.includes(`data-vocabulary-word="${word.en}"`),'Show the complete vocabulary context during natural sentence reading');
 assert.ok(!naturalScene.includes('aria-pressed="true"'),'Without word timestamps, natural reading must not guess the highlighted word');
 let count=0;
 for(const unit of units){for(const [component,props]of [[Games,{unit}],[Ordering,{unit}],[Listening,{words:unit.vocabulary.slice(0,4)}]]){const game=renderToStaticMarkup(React.createElement(component,{...props,onListen:()=>{},onKnown:()=>{}}));assert.ok(!/NaN|undefined|Infinity/.test(game));assert.ok(game.includes('button'));}}
 for(const unit of units)for(const lesson of unit.lessons)for(const p of [0,.5,1]){
  const scene=renderToStaticMarkup(React.createElement(Scene,{unit,lesson,p,englishActive:true,activeText:lesson.exampleEn,wordIndex:0,onWord:()=>{},onPosition:()=>{},playing:true}));
  assert.ok(scene.includes('role="group"'));assert.ok(!/NaN|undefined|Infinity/.test(scene),`${unit.id}/${lesson.id}`);assert.ok(scene.includes(lesson.titleZh));
  if(lesson.visual==='position'&&unit.id==='l1-u1')assert.ok(scene.includes('改变蜡笔位置'));
  if(unit.id==='l1-u8'&&lesson.id==='grammar-2')assert.ok(scene.includes('between')&&!scene.includes('改变蜡笔位置'),'furniture relations use their own diagram');
  if(unit.id==='l2-u2'&&lesson.id==='grammar-1')assert.ok(scene.includes('sometimes')&&!scene.includes('A LITTLE JOURNEY IN TIME'),'frequency uses frequency grid');
  if(unit.id==='l1-u7'&&lesson.id==='grammar-1')assert.ok(scene.includes('right now')&&!scene.includes('将来'),'ongoing actions stay in the present');
  count++;
 }
 console.log(`✔ Classroom shell and ${count} scene states render without invalid geometry.`);
}finally{await server.close();}

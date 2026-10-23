// Component smoke checks, no browser or screenshot infrastructure required.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const { default: Scene } = await server.ssrLoadModule('/src/Scene.tsx');
  const { default: ProblemImages } = await server.ssrLoadModule('/src/ProblemImages.tsx');
  const { lessons } = await server.ssrLoadModule('/src/content.ts');
  const { resolveNarration } = await server.ssrLoadModule('/src/narration.ts');
  const app = renderToStaticMarkup(React.createElement(App));
  assert.ok(app.includes('数学小花园'));
  assert.ok(app.includes('小路两端都种树'));
  assert.ok(app.includes(resolveNarration(lessons[0], 0).src));
  assert.ok(app.includes('打开年级导航'));
  for (const grade of ['二年级', '三年级', '四年级']) assert.ok(new RegExp(`${grade}.*?筹备中`).test(app), `${grade} must be coming soon`);
  assert.ok(app.includes('一年级'));
  assert.ok(!app.includes('探索三年级') && !app.includes('探索四年级'));
  assert.equal(Object.keys((await server.ssrLoadModule('/src/narration.ts')).audioCatalog.entries).length, 410);
  assert.ok(app.includes('本类学习路径') && app.includes('从基础到变化'));
  for (const lesson of lessons.filter(l => l.images?.length)) {
    const html = renderToStaticMarkup(React.createElement(ProblemImages, {images:lesson.images}));
    for (const image of lesson.images) assert.ok(html.includes(`src="${image.src}"`) && html.includes('查看原图'));
  }
  for (const lesson of lessons) for (const step of lesson.steps.keys()) for (const fraction of [0, .5, 1]) {
    const html = renderToStaticMarkup(React.createElement(Scene, { lesson, step, fraction }));
    assert.ok(html.includes('role="img"'));
    if (lesson.scene.kind === 'storyboard' && lesson.scene.frames[step].kind === 'planting-loop') {
      const f = lesson.scene.frames[step], count = f.sides.reduce((a,b)=>a+b,0)/f.spacing;
      assert.equal((html.match(/data-tree-position=/g) ?? []).length, count, 'Closing must reuse the first tree.');
      if (f.phase === 'check') assert.equal((html.match(/data-planted="true"/g) ?? []).length, count);
    }
    if (lesson.scene.kind === 'storyboard') {
      const f=lesson.scene.frames[step];
      if(f.kind==='production-grid') {
        const target=['question','produce','check'].includes(f.phase),count=target?f.targetWorkers*f.targetHours:f.workers*f.hours;
        assert.equal((html.match(/data-production-cell=/g)??[]).length,count);
        if(f.phase==='check') assert.equal((html.match(/data-produced="true"/g)??[]).length,count);
      }
      if(f.kind==='food-supply') {
        const consumed=(html.match(/data-consumed="true"/g)??[]).length,green=(html.match(/data-consumed="false"/g)??[]).length;
        const ration=Number(html.match(/data-rations="(\d+)"/)[1]);
        if(['regroup','check'].includes(f.phase)) assert.equal(green*ration,f.people*(f.days-f.eatenDays),'Regrouping must conserve all remaining food.');
        else assert.equal((green+consumed)*ration,f.people*f.days);
      }
      if(f.kind==='source-count') {
        assert.ok(html.includes(`data-source-figure="${f.figure}"`));
        if(f.phase!=='outline')assert.ok(html.includes('原图逐个计数')&&html.includes('下一个图形')&&html.includes('跟随讲解'));
      }
      if(f.kind==='age-story')assert.ok(html.includes(`data-age-time="${f.time}"`));
      if(f.kind==='transfer-story'&&fraction===1) {
        const points=[...html.matchAll(/<circle[^>]*cx="([\d.]+)" cy="([\d.]+)"/g)].map(m=>[Number(m[1]),Number(m[2])]);
        const left=points.filter(([x,y])=>x>=71&&x<=225&&y>=81&&y<=223).length;
        const right=points.filter(([x,y])=>x>=361&&x<=515&&y>=81&&y<=223).length;
        assert.deepEqual([left,right],f.values,`${lesson.id} final tray counts must match the explanation`);
      }
    }
    assert.ok(!html.includes('NaN') && !html.includes('undefined') && !html.includes('Infinity'), `${lesson.id} step ${step} must render valid geometry`);
  }
  console.log(`✔ Application shell and all ${lessons.reduce((n, l) => n + l.steps.length * 3, 0)} lesson scene states render successfully.`);
} finally { await server.close(); }

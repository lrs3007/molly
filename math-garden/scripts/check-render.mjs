// Component smoke checks, no browser or screenshot infrastructure required.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const { default: Scene } = await server.ssrLoadModule('/src/Scene.tsx');
  const { lessons } = await server.ssrLoadModule('/src/content.ts');
  const { resolveNarration } = await server.ssrLoadModule('/src/narration.ts');
  const app = renderToStaticMarkup(React.createElement(App));
  assert.ok(app.includes('数学小花园'));
  assert.ok(app.includes('小路两端都种树'));
  assert.ok(app.includes(resolveNarration(lessons[0], 0).src));
  assert.ok(app.includes('打开年级导航'));
  for (const lesson of lessons) for (const step of lesson.steps.keys()) for (const fraction of [0, .5, 1]) {
    const html = renderToStaticMarkup(React.createElement(Scene, { lesson, step, fraction }));
    assert.ok(html.includes('role="img"'));
    assert.ok(!html.includes('NaN') && !html.includes('undefined') && !html.includes('Infinity'), `${lesson.id} step ${step} must render valid geometry`);
  }
  console.log(`✔ Application shell and all ${lessons.reduce((n, l) => n + l.steps.length * 3, 0)} lesson scene states render successfully.`);
} finally { await server.close(); }

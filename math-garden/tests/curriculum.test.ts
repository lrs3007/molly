import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { lessons, topics } from '../src/content.ts';
import { referenceDocument, referenceImages, referenceText } from '../src/courses/reference-20261017.ts';
import { enumerateTriangles, lShapeSquares } from '../src/figure-math.ts';
import { emptyProgress, parseProgress, progressKey } from '../src/progress.ts';

test('all nine topics start with a foundation and cover every reference question and image', () => {
  const counts = [9, 10, 3, 5, 4, 4, 14, 18, 15];
  topics.forEach((topic, i) => {
    const path = lessons.filter(l => l.topic === topic.id);
    assert.equal(path.length, counts[i]);
    assert.equal(path[0].id, `${topic.id}-1`);
    assert.ok(path.slice(1).every(l => l.level && l.exercises.length));
  });
  const originals = lessons.filter(l => l.source?.document === referenceDocument);
  assert.equal(originals.length, 17); // The three diagrams in one source question are taught separately.
  assert.deepEqual([...new Set(originals.map(l => l.source!.paragraph))].sort((a,b) => a-b), [2,4,5,8,10,13,15,19,22,26,28,31,33,36,39]);
  for (const l of originals) assert.ok(l.problem.startsWith(referenceText[l.source!.paragraph]), l.id);
  for (const image of referenceImages) {
    const data = readFileSync(`public${image.src}`);
    assert.equal(data.length, image.bytes);
    assert.equal(createHash('sha256').update(data).digest('hex'), image.sha256);
    const matches = originals.filter(l => l.images?.some(i => i.src === image.src));
    assert.equal(matches.length, image.paragraph === 23 ? 3 : 1);
    assert.ok(matches.every(l => l.source!.paragraph === image.paragraph - 1));
  }
  for (const l of lessons) {
    assert.equal(new Set(l.exercises.map(e => e.id)).size, l.exercises.length);
    if (l.scene.kind === 'storyboard') assert.equal(l.scene.frames.length, l.steps.length);
    for (const e of l.exercises) if (e.choices) assert.ok(e.choices.includes(e.answer), e.id);
  }
});

test('every new practice answer has an independent calculation', () => {
  const week = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
  const cases: Record<string, number | string> = {
    treescircle: 36/4, treestriangle: 12*3/3, treesrectangle: 15*4/5, treesloopspacing: 60/10,
    treesone: 24/4, treesnone: 30/5-1, treesperiod: (10-1)/3*(1+2+3), treesobjects: 1+2+3+4+5,
    unitworkone: 72/4/3*5*2, unitworktwo: 30/2/3*6*4, unitmachine: 48/2/4*3*5,
    unitfoodone: 10*(12-2)/(10+10), unitfoodtwo: 20*(18-6)/(20+10), unitfoodthree: 8*(30-6)/(8+4),
    unitinverse: 18/(12/4), unitdelay: 1800/(12-3), unitremaining: (90-36)/(36/4),
    sumsmall: (40-8)/2, sumchange: (40+8)/2,
    cycleweek: week[(0+9)%7], cyclecentury: week[(new Date(Date.UTC(1927,7,1)).getUTCDay()+6)%7],
    cyclemonth: week[(5+20-1)%7], cyclemore: week[(1+18-1)%7],
    averagemissing: 90*3-85-89, averageweighted: 2*(11-8)/(13-11), averagescores: 4*80-70-85-90,
    ratiodifference: 28/(5-1)*5, ratiorope: 18*2/3, ratiocards: 12+4,
    transferreverse: 16+4, transferratio: 30-36*2/3,
    geometrysquare: 2*2+1, geometrylshape: 1*3,
    geometrytriangleone: '不能', geometrytriangletwo: '不能', geometrytrianglethree: '不能',
    agepast: 16-(40-16)/(3-1), agemother: 36-6, agefather: 5+11,
  };
  const extensions = lessons.filter(l => !l.audioSourceId && l.source?.document !== '数学原题分类汇编.docx');
  assert.equal(extensions.length, Object.keys(cases).length);
  for (const l of extensions) {
    assert.ok(l.id.slice(0,-2) in cases, l.id);
    assert.equal(l.exercises[0].answer, String(cases[l.id.slice(0,-2)]), `${l.id}: ${l.exercises[0].prompt}`);
  }
});

test('reference arithmetic satisfies every original condition, including exclusions', () => {
  const startsWithFourTuesdayFriday = [], startsWithExtraTuesday = [];
  for (let length = 28; length <= 31; length++) for (let start = 0; start < 7; start++) {
    const frequencies = Array.from({length:7}, (_, day) => Array.from({length}, (_, i) => (start+i)%7).filter(x => x === day).length);
    if (length === 31 && frequencies[1] === 4 && frequencies[4] === 4) startsWithFourTuesdayFriday.push(start);
    if (frequencies[1] > frequencies[0]) startsWithExtraTuesday.push(start);
  }
  assert.deepEqual(startsWithFourTuesdayFriday, [5]);
  assert.deepEqual(startsWithExtraTuesday, [1,1,1]);
  assert.equal((Date.UTC(2027,7,1)-Date.UTC(1927,7,1))/86400000, 36525);
  assert.equal(new Date(Date.UTC(1927,7,1)).getUTCDay(), 1);

  const ropes = [], cards = [], teachers = [], mothers = [], fathers = [], scores = [];
  for (let n=1; n<=100; n++) {
    if (n/2-9 === n/3-2 && n/2-9 > 0) ropes.push([n,n/2-9]);
    for (let m=1; m<=100; m++) {
      if (n+13 === 2*(m-13)-10 && m-13+29 === 7*(n+13-29)-10 && n+13-29 >= 0) cards.push([n,m]);
      if (m-n === 13 && 27*n+32*m === 30*(n+m)) teachers.push([n,m]);
      if (n === 6*m && n+9 === 3*(m+9)) mothers.push([n,m]);
      if (m>11 && n-11 === 7*(m-11) && n+14 === 2*(m+14)) fathers.push([n,m]);
    }
  }
  for (let c=0; c<=100; c++) for (let f=0; f<=100; f++) {
    const others = [74,48,c,90,33,60,78];
    if (others.reduce((a,b)=>a+b,0)+f === 64*8 && f>Math.max(...others) && others.some(x => 2*x === f)) scores.push([c,f]);
  }
  assert.deepEqual(ropes, [[42,12]]);
  assert.deepEqual(cards, [[25,37]]);
  assert.deepEqual(teachers, [[26,39]]);
  assert.deepEqual(mothers, [[36,6]]);
  assert.deepEqual(fathers, [[46,16]]);
  assert.deepEqual(scores, [[33,96]]);
  const repeatSum = (pattern:number[], count:number) => Array.from({length:count}, (_,i) => pattern[i%pattern.length]).reduce((a,b)=>a+b,0);
  assert.equal(repeatSum([1,2,3], 19), 37);
  assert.equal(repeatSum([1,2,3],20)+repeatSum([4,5,6,7],19), 142);
  assert.equal(3000/(20-5), 200);
  assert.equal((200-120)/(120/15), 10);
});

test('source figure enumeration has no duplicates, missing edges or zero-area triangles', () => {
  const { cells, squares } = lShapeSquares();
  assert.equal(cells.size, 21);
  assert.deepEqual([1,2,3].map(size => squares.filter(s => s.size === size).length), [21,11,3]);
  assert.equal(squares.length, 35);
  const totals = [34,47,64], tops = [24,30,36]; // Cross-checked independently with rational coordinates.
  for (let figure=1; figure<=3; figure++) {
    const triangles = enumerateTriangles(figure);
    assert.equal(triangles.length, totals[figure-1]);
    assert.equal(triangles.filter(t => t.some(([x,y]) => Math.abs(x)<1e-7 && Math.abs(y)<1e-7)).length, tops[figure-1]);
    assert.equal(new Set(triangles.map(t => t.map(p => p.map(n=>n.toFixed(6)).join(',')).sort().join('|'))).size, triangles.length);
    for (const [a,b,c] of triangles) assert.ok(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))>1e-7);
  }
});

test('a chosen variation and its independent learning progress survive reload', () => {
  const l = lessons.find(l => l.id === 'geometrytriangletwo-1')!;
  const p = {...emptyProgress(), lessonId:l.id};
  p.lessons[progressKey(l.id,l.version)] = {step:3,results:{}};
  p.lessons['geometry-1:v1'] = {completed:true,step:4,results:{}};
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
});

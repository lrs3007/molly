import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/content.ts';
import {loopLayout} from '../src/planting-loop.ts';

test('closed routes close onto the first tree and keep each shared corner only once', () => {
  const cases = [
    {shape:'circle',sides:[40],spacing:5,expected:8,corners:[]},
    {shape:'triangle',sides:[18,18,18],spacing:6,expected:9,corners:[0,3,6]},
    {shape:'rectangle',sides:[18,12,18,12],spacing:6,expected:10,corners:[0,3,5,8]},
    {shape:'circle',sides:[48],spacing:4,expected:12,corners:[]},
  ] as const;
  for (const c of cases) {
    const layout=loopLayout({...c,sides:[...c.sides]});
    assert.equal(layout.count,c.expected);
    assert.equal(new Set(layout.nodes.map(p=>p.map(n=>n.toFixed(7)).join(','))).size,c.expected);
    assert.deepEqual(layout.corners,[...c.corners]);
    assert.deepEqual(layout.intervals.at(-1)!.to,layout.nodes[0]);
    assert.deepEqual(layout.pointAt(layout.perimeter),layout.pointAt(0));
    layout.intervals.forEach((interval,i) => {
      assert.deepEqual(interval.from,layout.nodes[i]);
      assert.deepEqual(interval.to,layout.nodes[(i+1)%layout.count]);
    });
    if (c.shape!=='circle') {
      const countedBySides=c.sides.reduce((sum,side)=>sum+side/c.spacing+1,0);
      assert.equal(countedBySides-layout.corners.length,c.expected);
    }
  }
});

test('polygon corner planting rejects a spacing that does not divide every side', () => {
  assert.throws(()=>loopLayout({shape:'rectangle',sides:[15,9,15,9],spacing:4}),/每边/);
  assert.throws(()=>loopLayout({shape:'circle',sides:[40],spacing:0}),/正间距/);
});

test('closed route courses follow open-end conditions and precede the original challenges', () => {
  const path=lessons.filter(l=>l.topic==='trees').sort((a,b)=>(a.pathOrder??0)-(b.pathOrder??0));
  assert.deepEqual(path.map(l=>l.id), ['trees-1','treesone-1','treesnone-1','treescircle-1','treestriangle-1','treesrectangle-1','treesloopspacing-1','treesperiod-1','treesobjects-1']);
  for (const l of path.slice(3,7)) {
    assert.equal(l.steps.length,5);
    assert.equal(l.scene.kind,'storyboard');
    if (l.scene.kind==='storyboard') {
      assert.equal(l.scene.frames.filter(f=>f.kind==='planting-loop').length,5);
      assert.deepEqual(l.scene.frames.map(f=>f.kind==='planting-loop' && loopLayout(f).count),Array(5).fill(l.id==='treescircle-1'?8:l.id==='treestriangle-1'?9:l.id==='treesrectangle-1'?10:12));
    }
  }
});

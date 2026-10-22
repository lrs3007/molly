import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/content.ts';
import {compoundUnitLessons} from '../src/courses/grade-1/compound-unit.ts';
import {productionAmounts,foodAmounts} from '../src/compound-unit-math.ts';

const originals=[
  '6名工人2小时一共加工72个零件。每名工人每小时加工的零件数相同，照这样计算，8名工人3小时一共能加工多少个零件？',
  '5名工人4小时一共加工100个零件。每名工人每小时加工的零件数相同，照这样计算，7名工人6小时一共能加工多少个零件？',
  '3台机器5小时一共生产90个零件。每台机器每小时生产的零件数相同，照这样计算，4台机器8小时一共能生产多少个零件？',
  '营地为20人准备了够吃24天的食物。吃了4天后，又来了20人。若每人每天吃的食物一样多，且中途没有补充食物，剩下的食物还够现在这些人吃多少天？',
  '营地为30人准备了够吃20天的食物。吃了5天后，又来了15人。若每人每天吃的食物一样多，且中途没有补充食物，剩下的食物还够现在这些人吃多少天？',
  '营地为12人准备了够吃40天的食物。吃了10天后，又来了6人。若每人每天吃的食物一样多，且中途没有补充食物，剩下的食物还够现在这些人吃多少天？',
];

test('all six user problems are preserved exactly with five animated explanations and follow-up practice',()=>{
  assert.equal(compoundUnitLessons.length,6);
  compoundUnitLessons.forEach((l,i)=>{
    assert.equal(l.problem,originals[i]);
    assert.ok(l.title.startsWith(`第${31+i}题·`));
    assert.equal(l.grade,1);
    assert.equal(l.topic,'unit');
    assert.equal(l.steps.length,5);
    assert.ok(l.steps[2].question);
    assert.equal(new Set(l.steps[2].question!.choices).size,l.steps[2].question!.choices.length);
    assert.equal(l.exercises.length,1);
    assert.equal(l.scene.kind,'storyboard');
    if(l.scene.kind==='storyboard') assert.equal(l.scene.frames.length,5);
  });
  const path=lessons.filter(l=>l.topic==='unit').sort((a,b)=>(a.pathOrder??0)-(b.pathOrder??0));
  assert.deepEqual(path.map(l=>l.id),['unit-1','unitinverse-1','unitworkone-1','unitworktwo-1','unitmachine-1','unitdelay-1','unitremaining-1','unitfoodone-1','unitfoodtwo-1','unitfoodthree-1']);
});

test('the three production answers agree with an independently enumerated fixed hourly rate',()=>{
  const values=[{workers:6,hours:2,total:72,targetWorkers:8,targetHours:3,rate:6,answer:144},
    {workers:5,hours:4,total:100,targetWorkers:7,targetHours:6,rate:5,answer:210},
    {workers:3,hours:5,total:90,targetWorkers:4,targetHours:8,rate:6,answer:192}];
  values.forEach((q,i)=>{
    const rates=Array.from({length:100},(_,j)=>j+1).filter(rate=>Array(q.workers*q.hours).fill(rate).reduce((sum,n)=>sum+n,0)===q.total);
    assert.deepEqual(rates,[q.rate]);
    assert.equal(Array(q.targetWorkers*q.targetHours).fill(rates[0]).reduce((sum,n)=>sum+n,0),q.answer);
    const a=productionAmounts(q);
    assert.equal(a.perHour,q.rate);
    assert.equal(a.answer,q.answer);
    const l=compoundUnitLessons[i];
    assert.ok(l.steps[3].formula?.endsWith(`= ${q.answer}（个）`));
    if(l.scene.kind==='storyboard') for(const f of l.scene.frames) {
      assert.equal(f.kind,'production-grid');
      if(f.kind==='production-grid') assert.deepEqual(productionAmounts(f),a);
    }
  });
});

test('food conservation gives unique remaining days and identical green food packs after regrouping',()=>{
  const values=[{people:20,days:24,eatenDays:4,newcomers:20,total:480,remaining:400,now:40,answer:10,group:20},
    {people:30,days:20,eatenDays:5,newcomers:15,total:600,remaining:450,now:45,answer:10,group:15},
    {people:12,days:40,eatenDays:10,newcomers:6,total:480,remaining:360,now:18,answer:20,group:6}];
  values.forEach((q,i)=>{
    const possible=Array.from({length:101},(_,d)=>d).filter(d=>q.people*q.eatenDays+(q.people+q.newcomers)*d===q.people*q.days);
    assert.deepEqual(possible,[q.answer]);
    const a=foodAmounts(q);
    assert.equal(a.total,q.total);
    assert.equal(a.remaining,q.remaining);
    assert.equal(a.now,q.now);
    assert.equal(a.answer,q.answer);
    assert.equal(a.group,q.group);
    assert.equal(a.oldRows*(q.days-q.eatenDays),a.newRows*a.answer);
    assert.equal(a.remainingPacks*a.group,q.remaining);
    assert.equal(a.used+a.now*a.answer,a.total);
    const l=compoundUnitLessons[i+3];
    assert.ok(l.steps[3].formula?.endsWith(`= ${q.answer}（天）`));
    if(l.scene.kind==='storyboard') for(const f of l.scene.frames) {
      assert.equal(f.kind,'food-supply');
      if(f.kind==='food-supply') assert.deepEqual(foodAmounts(f),a);
    }
  });
});

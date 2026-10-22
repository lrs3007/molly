import {lesson,choose} from './extensions.ts';
import type {Lesson} from '../../content.ts';
import type {StoryFrame} from '../../story-types.ts';

export interface ProductionProblem {
  id:string; number:number; workers:number; hours:number; total:number; targetWorkers:number; targetHours:number; machine?:boolean;
}
export const productionProblems:ProductionProblem[] = [
  {id:'unitworkone-1',number:31,workers:6,hours:2,total:72,targetWorkers:8,targetHours:3},
  {id:'unitworktwo-1',number:32,workers:5,hours:4,total:100,targetWorkers:7,targetHours:6},
  {id:'unitmachine-1',number:33,workers:3,hours:5,total:90,targetWorkers:4,targetHours:8,machine:true},
];
export interface FoodProblem {id:string; number:number; people:number; days:number; eatenDays:number; newcomers:number}
export const foodProblems:FoodProblem[] = [
  {id:'unitfoodone-1',number:34,people:20,days:24,eatenDays:4,newcomers:20},
  {id:'unitfoodtwo-1',number:35,people:30,days:20,eatenDays:5,newcomers:15},
  {id:'unitfoodthree-1',number:36,people:12,days:40,eatenDays:10,newcomers:6},
];
const productionPractice = [
  ['4名工人3小时加工72个零件，同样效率，5名工人2小时加工多少个？',60,'72÷4÷3＝6，每人每小时6个；6×5×2＝60个。'],
  ['2名工人3小时加工30个零件，同样效率，6名工人4小时加工多少个？',120,'30÷2÷3＝5，每人每小时5个；5×6×4＝120个。'],
  ['2台机器4小时生产48个零件，同样效率，3台机器5小时生产多少个？',90,'48÷2÷4＝6，每台每小时6个；6×3×5＝90个。'],
] as const;
const foodPractice = [
  ['10人原有够吃12天的食物，吃了2天后又来10人。剩余食物还能吃几天？',5,'剩余10×(12－2)＝100份；现在20人，100÷20＝5天。'],
  ['20人原有够吃18天的食物，吃了6天后又来10人。剩余食物还能吃几天？',8,'剩余20×(18－6)＝240份；现在30人，240÷30＝8天。'],
  ['8人原有够吃30天的食物，吃了6天后又来4人。剩余食物还能吃几天？',16,'剩余8×(30－6)＝192份；现在12人，192÷12＝16天。'],
] as const;

const productionLessons=productionProblems.map((q,i)=>{
  const noun=q.machine?'机器':'工人', classifier=q.machine?'台':'名', agent=q.machine?'每台机器':'每名工人', verb=q.machine?'生产':'加工';
  const each=q.total/q.workers,rate=each/q.hours,units=q.targetWorkers*q.targetHours,answer=rate*units;
  const practice=productionPractice[i];
  const course=lesson(q.id,'unit',`第${q.number}题·${q.machine?'机器数量和时间一起变':'工人数和时间一起变'}`,'综合应用',
    `${q.workers}${classifier}${noun}${q.hours}小时一共${verb}${q.total}个零件。${agent}每小时${verb}的零件数相同，照这样计算，${q.targetWorkers}${classifier}${noun}${q.targetHours}小时一共能${verb}多少个零件？`,
    '先连续除以数量和时间，求每名工人（每台机器）每小时的产量，再乘新的数量与时间。',[
      ['两种数量一起看',`${q.workers}${classifier}${noun}、${q.hours}小时，共${q.total}个。`,`请先把两种数量圈出来，${q.workers}${classifier}${noun}和${q.hours}小时，合起来${verb}${q.total}个零件。接下来数量和时间都变了。${agent}每小时的效率相同，咱们要找的这一份，是一${classifier}${noun}工作一小时的产量。`],
      ['连续两次平均分',`先求一${classifier}${noun}${q.hours}小时，再求一小时。`,`${q.total}个平均分给${q.workers}${classifier}${noun}，一${classifier}${noun}${q.hours}小时${verb}${each}个。再把${each}平均分到${q.hours}小时，每小时${rate}个。看格子，一行代表一${classifier}${noun}，一列代表一小时，一个小格才是${agent}每小时的${rate}个。`,`${q.total} ÷ ${q.workers} ÷ ${q.hours} = ${rate}（个）`],
      ['先想一想',`新任务有${q.targetWorkers}行、${q.targetHours}列，要算多少个小格？`,`现在换成${q.targetWorkers}${classifier}${noun}，工作${q.targetHours}小时。图里要排${q.targetWorkers}行，每行${q.targetHours}个小格。已经知道每个小格是${rate}个零件，接下来要算几个这样的小格呢？请先分清数量和时间，别漏掉其中一个。`],
      ['把新的小份合起来',`${units}个小格，每格${rate}个，共${answer}个。`,`${q.targetWorkers}乘${q.targetHours}，一共${units}个小格。每格${rate}个零件，把这些相同的小份合起来，就是${rate}乘${q.targetWorkers}再乘${q.targetHours}，得到${answer}个。看高亮一格一格填满，增加数量和增加时间，都在增加相同的小份。`,`${rate} × ${q.targetWorkers} × ${q.targetHours} = ${answer}（个）`],
      ['回到原条件检查',`${rate}×${q.workers}×${q.hours}＝${q.total}，效率没有变。`,`用一份${rate}个放回原题，${rate}乘${q.workers}再乘${q.hours}，正好${q.total}个，说明每小时的一份找对了。新任务同样按每格${rate}个计算，答案${answer}个。记住，先求每一${classifier}每一小时，再乘新的数量和新的小时数。`,`${q.total} ÷ ${q.workers} ÷ ${q.hours} × ${q.targetWorkers} × ${q.targetHours} = ${answer}（个）`],
    ],(['known','unit','question','produce','check'] as const).map((phase,index):StoryFrame=>({kind:'production-grid',...q,phase,title:['人数和时间组成产量格子','一个小格＝一名工人或一台机器工作1小时','新任务有多少个相同的小格','每个小格装入相同产量','同一效率，分别核对两次总产量'][index],footer:'每行对应一名工人或一台机器，每列对应1小时；小格内数字表示零件数'})),
    choose('新任务应该计算多少个“每人（每台）每小时”的小格？',[`${q.targetWorkers}个`,`${q.targetHours}个`,`${units}个`],2,`${q.targetWorkers}×${q.targetHours}＝${units}个小格，数量和时间都要考虑。`),
    [practice[0],practice[1],'个','先连续除以原来的数量和小时数，得到每人（每台）每小时的产量。',practice[2]]);
  course.pathOrder=i+3;
  course.tip='用手指沿着一行，再看一列：一个小格表示一名工人（或一台机器）工作一小时。';
  course.mistakes=['只除以工人数，得到的是每人在原来几小时内的产量，还要再除以小时数。','求新总量时，新的工人数（或机器数）和工作时间都要乘上。'];
  return course;
});

const foodLessons=foodProblems.map((q,i)=>{
  const total=q.people*q.days,used=q.people*q.eatenDays,remaining=total-used,now=q.people+q.newcomers,answer=remaining/now;
  const practice=foodPractice[i];
  const course=lesson(q.id,'unit',`第${q.number}题·${q.people}人营地又来${q.newcomers}人`,'综合应用',
    `营地为${q.people}人准备了够吃${q.days}天的食物。吃了${q.eatenDays}天后，又来了${q.newcomers}人。若每人每天吃的食物一样多，且中途没有补充食物，剩下的食物还够现在这些人吃多少天？`,
    '把1人吃1天的食物记作1份，先扣除已经吃掉的份数，再按现在的人数平均分。',[
      ['把食物换成小份',`1人吃1天＝1份，原来共${total}份。`,`先不用知道食物有多少千克。把一个人一天吃的食物，记作一份。${q.people}个人吃${q.days}天，需要${q.people}乘${q.days}，一共${total}份。这样把人数和天数一起算进去，也叫用人天数表示食物总量。`,`${q.people} × ${q.days} = ${total}（份）`],
      ['先扣掉已经吃的',`吃了${used}份，还剩${remaining}份。`,`先来的还是${q.people}个人，他们已经吃了${q.eatenDays}天，用掉${q.people}乘${q.eatenDays}，就是${used}份。动画把这些天的食物标成金色，剩下的绿色食物是${remaining}份。也可以先算原来的${q.days}天减${q.eatenDays}天，再乘${q.people}人。`,`${q.people} × (${q.days} − ${q.eatenDays}) = ${remaining}（份）`],
      ['先想一想',`现在${now}人，每天要吃${now}份。`,`接下来又来了${q.newcomers}个人。原来的${q.people}个人还在，所以现在一共有多少人？食物没有补充，绿色的剩余份数不变。请先算现在每天要吃几份，再想还能吃几天。`],
      ['按现在人数重新分',`${remaining}份，每天${now}份，还能吃${answer}天。`,`现在${q.people}加${q.newcomers}，共${now}人，每天需要${now}份。把剩余${remaining}份重新排一排，人数增加，能吃的天数就变少了。${remaining}除以${now}，等于${answer}，所以从新朋友到来以后，还能吃${answer}天。`,`${remaining} ÷ (${q.people} + ${q.newcomers}) = ${answer}（天）`],
      ['把吃过与剩余合起来检查',`以前${used}份＋以后${now}×${answer}份＝${total}份。`,`检查一下，以前吃掉${used}份，今后${now}人吃${answer}天，要${now}乘${answer}，正好${remaining}份。两部分合起来${total}份，食物没有变多也没有变少。题目问剩下还能吃几天，所以答案是${answer}天，不把已经吃过的${q.eatenDays}天再加进去。`,`${used} + ${now} × ${answer} = ${total}（份）`],
    ],(['stock','consume','question','regroup','check'] as const).map((phase,index):StoryFrame=>({kind:'food-supply',...q,phase,title:['先把食物总量表示成份数','金色是已吃掉，绿色是剩余','新朋友加入，剩余食物不会增加','同样多的绿色食物，换成更多人一起吃','核对以前与以后吃的总份数'][index],footer:'1份＝1人吃1天的食物；图中每小格代表一组人吃1天的食物'})),
    choose('新朋友到来后，现在每天需要多少份食物？',[`${q.people}份`,`${now}份`,`${now+q.newcomers}份`],1,`原来的人加上新来的人：${q.people}＋${q.newcomers}＝${now}人，每天吃${now}份。`),
    [practice[0]+'每人每天吃得一样多，中途没有补充食物。',practice[1],'天','先求剩余份数，再除以原来人数与新来人数的和。',practice[2]]);
  course.pathOrder=i+8;
  course.tip='先说清楚“谁先吃了几天”，再看“现在有多少人”。剩余食物要用现在的人数来分。';
  course.mistakes=['新朋友来之前吃掉的食物要先扣掉，不能把全部食物直接分给现在的人。','现在人数＝原来人数＋新来人数；答案是剩下还能吃的天数，不包含已经吃过的天数。'];
  return course;
});

export const compoundUnitLessons:Lesson[]=[...productionLessons,...foodLessons];
compoundUnitLessons.forEach((course,i)=>{course.tags=['综合应用',`用户补充第${31+i}题`,i<3?'双重归一':'剩余食物与人天数'];});

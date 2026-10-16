import { extraLessons } from './extra-lessons.ts';
export type TopicId = 'trees' | 'unit' | 'sum' | 'cycle' | 'average' | 'ratio' | 'transfer' | 'geometry' | 'age';
export type Scene =
  | { kind: 'trees'; length: number; spacing: number; ends: 'both' | 'one' }
  | { kind: 'unit'; count: number; total: number; target: number; item: string; unit: string }
  | { kind: 'sum'; total: number; difference: number; names: [string, string]; unit: string }
  | { kind: 'cycle'; colors: string[]; target: number }
  | { kind: 'average'; values: number[]; mode: 'mean' | 'missing' }
  | { kind: 'ratio'; relation: 'sum' | 'difference'; amount: number; multiple: number }
  | { kind: 'transfer'; left: number; right: number; mode: 'forward' | 'reverse' }
  | { kind: 'geometry'; rows: number; columns: number; shape: 'rectangle' | 'square' }
  | { kind: 'age'; older: number; younger: number; multiple: number; direction: 'future' | 'past' };
export interface Question { prompt: string; choices: string[]; answer: number; explanation: string }
export interface Step { title: string; caption: string; narration: string; formula?: string; question?: Question }
export interface Exercise {
  id: string; level: string; prompt: string; answer: string; unit: string;
  hint: string; explanation: string; choices?: string[];
  diagram?: { rows: number; columns: number };
}
export interface Lesson {
  id: string; version: number; grade: number; topic: TopicId; title: string; description: string;
  problem: string; tags: string[]; scene: Scene; steps: Step[]; exercises: Exercise[];
  takeaway: string; mistakes: string[]; tip?: string;
}
export const topics: { id: TopicId; name: string; icon: string; subtitle: string }[] = [
  { id: 'trees', name: '植树问题', icon: 'tree', subtitle: '发现间隔里的小秘密' },
  { id: 'unit', name: '归一问题', icon: 'box', subtitle: '先找一份，再找几份' },
  { id: 'sum', name: '和差问题', icon: 'ruler', subtitle: '用线段看见数量关系' },
  { id: 'cycle', name: '周期问题', icon: 'shapes', subtitle: '找到重复出现的规律' },
  { id: 'average', name: '平均数问题', icon: 'average', subtitle: '把不一样多变成一样多' },
  { id: 'ratio', name: '和差倍问题', icon: 'ratio', subtitle: '用相同的份数看懂倍数' },
  { id: 'transfer', name: '移多补少', icon: 'transfer', subtitle: '搬一次，数量差变多少' },
  { id: 'geometry', name: '平面图形计数', icon: 'grid', subtitle: '按大小和位置有序地数' },
  { id: 'age', name: '年龄问题', icon: 'clock', subtitle: '年龄一起变，年龄差不变' },
];
const exercise = (id: string, level: string, prompt: string, answer: string, unit: string, hint: string, explanation: string, choices?: string[]): Exercise => ({ id, level, prompt, answer, unit, hint, explanation, choices });
function treeLesson(grade: number, length: number, spacing: number, ends: 'both' | 'one'): Lesson {
  const n = length / spacing, count = n + (ends === 'both' ? 1 : 0), both = ends === 'both';
  return {
    id: `trees-${grade}`, version: 1, grade, topic: 'trees', title: both ? '小路两端都种树' : '小路只在一端种树',
    description: both ? '树和间隔，为什么总差一个？' : '换一个条件，再数一数。',
    problem: `一条小路长 ${length} 米，在道路一侧每隔 ${spacing} 米种一棵树，${both ? '两端都种' : '起点种树，终点不种'}。一共需要多少棵树？`,
    tags: ['画图理解', both ? '两端都种' : '只种一端'], scene: { kind: 'trees', length, spacing, ends },
    steps: [
      { title: '读懂题目', caption: `路长 ${length} 米，每隔 ${spacing} 米种树。特别注意：${both ? '两端都种' : '起点种，终点不种'}。`, narration: `欢迎来到数学小花园。我们一起给小路种树。小路长${length}米，每隔${spacing}米种一棵树。题目说，${both ? '两端都种。起点和终点都要有树' : '起点种树，终点不种树'}。先记住这个条件。` },
      { title: '把路分成几段', caption: `每段 ${spacing} 米，共有 ${n} 个间隔。间隔是两棵相邻树之间的距离。`, narration: `先把小路分成一样长的小段。每一段都是${spacing}米。${length}除以${spacing}，等于${n}。所以，一共有${n}个间隔。注意，我们现在数的是间隔，还不是树。`, formula: `${length} ÷ ${spacing} = ${n}（个间隔）` },
      { title: '先想一想', caption: `${n} 个间隔，${both ? '两端都种' : '只种一端'}，你觉得需要几棵树？`, narration: `先停下来想一想。现在有${n}个间隔，${both ? '两端都种树' : '起点种树，终点不种树'}，到底需要几棵树呢？你可以在纸上画几个点，再选一个答案。`, question: { prompt: `需要几棵树？`, choices: [`${n - 1} 棵`, `${n} 棵`, `${n + 1} 棵`], answer: both ? 2 : 1, explanation: both ? '从起点开始，每增加一个间隔，就多一棵树。起点还有一棵，所以要加 1。' : '两端都种本来有间隔数＋1棵，终点不种，去掉一棵后正好等于间隔数。' } },
      { title: '让树告诉我们', caption: both ? `从起点的第一棵开始，再种 ${n} 棵。${n} 个间隔对应 ${count} 棵树。` : `先看两端都有树，再去掉终点的那棵。${n} 个间隔对应 ${count} 棵树。`, narration: both ? `现在一棵一棵种树。起点先种一棵。接下来，每走过一个间隔，就种下一棵。你发现了吗？${n}个间隔，需要${count}棵树。树的数量，比间隔的数量多一。` : `现在看分界点上的树。如果两端都种，一共有${n + 1}棵。但终点不种，我们把最后一棵去掉。还剩${count}棵。只种一端时，树的数量，就等于间隔的数量。` },
      { title: '把方法记下来', caption: both ? '两端都种：树的棵数 = 间隔数 + 1。' : '只种一端：树的棵数 = 间隔数。', narration: `我们来写出答案。${length}除以${spacing}${both ? '，再加一' : ''}，等于${count}棵。做植树问题，要先求间隔数，再看两端是否种树。现在，去试试下面的练习吧。`, formula: `${length} ÷ ${spacing}${both ? ' + 1' : ''} = ${count}（棵）` },
    ],
    takeaway: '先算间隔数，再看两端：两端都种＋1；只种一端不加减；两端都不种－1。',
    mistakes: ['把间隔数直接当成树的棵数。', '忽略“两端都种”或“终点不种”的条件。', '题目说道路一侧，不要把答案再乘 2。'],
    exercises: grade === 3 ? [
      exercise('trees-3-a', '基础巩固', '一条小路长40米，在一侧每隔5米种一棵树，两端都种。需要多少棵树？', '9', '棵', '先算40米里有几个5米，再考虑起点。', '40÷5＝8个间隔。两端都种，8＋1＝9棵。'),
      exercise('trees-3-b', '条件变化', '一条小路长30米，在一侧每隔5米种一棵树，起点种、终点不种。需要多少棵树？', '6', '棵', '终点的树去掉后，树和间隔的数量一样多。', '30÷5＝6个间隔。只种一端，树的棵数就是6棵。'),
      exercise('trees-3-c', '情境迁移', '一段栏杆长24米，每隔4米立一根柱子，两端都有柱子。一共有多少根柱子？', '7', '根', '把柱子想成树，找出间隔数。', '24÷4＝6个间隔。两端都有柱子，6＋1＝7根。'),
    ] : [
      exercise('trees-4-a', '基础巩固', '一条路长48米，在一侧每隔6米种一棵树，起点种、终点不种。需要多少棵树？', '8', '棵', '只种一端，棵数等于间隔数。', '48÷6＝8个间隔，所以需要8棵树。'),
      exercise('trees-4-b', '条件变化', '一条路长36米，在一侧每隔6米种一棵树，两端都不种。需要多少棵树？', '5', '棵', '先想象两端都种，再去掉两端的两棵。', '36÷6＝6个间隔。两端都不种，6－1＝5棵。'),
      exercise('trees-4-c', '情境迁移', '一段走廊长45米，每隔5米放一盆花，入口放、出口不放。需要多少盆花？', '9', '盆', '入口和出口就是这段走廊的两端。', '45÷5＝9个间隔。只放一端，所以需要9盆花。'),
    ],
  };
}
function unitLesson(grade: number, count: number, total: number, target: number): Lesson {
  const each = total / count, result = each * target;
  return {
    id: `unit-${grade}`, version: 1, grade, topic: 'unit', title: grade === 3 ? '买铅笔的小计划' : '给全班准备铅笔', description: '先知道一支多少钱，问题就简单了。',
    problem: `${count} 支同样的铅笔一共 ${total} 元，每支价格相同。买 ${target} 支这样的铅笔，一共需要多少元？`,
    tags: ['先求一份', '价格相同'], scene: { kind: 'unit', count, total, target, item: '铅笔', unit: '元' },
    steps: [
      { title: '读懂题目', caption: `${count} 支铅笔一共 ${total} 元，要算 ${target} 支的价钱。每支价格相同。`, narration: `我们一起去文具店。${count}支同样的铅笔一共${total}元。现在要买${target}支，每支价格相同。怎样算出要花多少钱呢？` },
      { title: '先找一份', caption: `把 ${total} 元平均分成 ${count} 份，每份是 ${each} 元。`, narration: `先不急着算${target}支。因为每支价格一样，可以把${total}元平均分成${count}份。${total}除以${count}，等于${each}。原来，每支铅笔是${each}元。`, formula: `${total} ÷ ${count} = ${each}（元 / 支）` },
      { title: '先想一想', caption: `一支 ${each} 元，${target} 支的价钱应该怎么求？`, narration: `现在知道一支是${each}元了。要买${target}支，你会用哪个算式呢？选一选，再继续看。`, question: { prompt: `${target} 支铅笔的价钱用哪个算式？`, choices: [`${each} + ${target}`, `${each} × ${target}`, `${target} ÷ ${each}`], answer: 1, explanation: `${target}支就是${target}个${each}元，用乘法求总价。` } },
      { title: '再找几份', caption: `${target} 支就有 ${target} 个 ${each} 元，总价是 ${result} 元。`, narration: `我们把一支铅笔复制成${target}支。每支${each}元，${target}支就是${target}个${each}元。用${each}乘${target}，得到${result}元。`, formula: `${each} × ${target} = ${result}（元）` },
      { title: '把方法记下来', caption: '归一问题：先求一份是多少，再求需要的几份。', narration: `这就是归一问题。先用总价除以支数，求一支的价钱；再用一支的价钱乘新的支数。注意，每支的价格必须相同。现在，去练习一下吧。`, formula: `${total} ÷ ${count} × ${target} = ${result}（元）` },
    ], takeaway: '先求一份：总量 ÷ 份数；再求几份：一份的量 × 新份数。',
    mistakes: ['直接把已知总价乘新的份数，忘记先求一份。', '没有确认每份的数量或价格是否相同。'],
    exercises: grade === 3 ? [
      exercise('unit-3-a', '基础巩固', '4支同样的铅笔一共12元。买7支需要多少元？', '21', '元', '先算一支铅笔多少钱。', '12÷4＝3元/支，3×7＝21元。'),
      exercise('unit-3-b', '条件变化', '5本同样的练习本一共20元。12元可以买几本？', '3', '本', '先求一本的价格，再看12元里有几个这样的价格。', '20÷5＝4元/本，12÷4＝3本。'),
      exercise('unit-3-c', '情境迁移', '3个同样的盒子共装18块积木。5个这样的盒子共装多少块积木？', '30', '块', '每个盒子装的积木一样多。', '18÷3＝6块/盒，6×5＝30块。'),
    ] : [
      exercise('unit-4-a', '基础巩固', '6支同样的铅笔一共24元。买9支需要多少元？', '36', '元', '先求单价，再求总价。', '24÷6＝4元/支，4×9＝36元。'),
      exercise('unit-4-b', '条件变化', '8本同样的本子一共40元。35元可以买几本？', '7', '本', '这次求份数，最后一步用除法。', '40÷8＝5元/本，35÷5＝7本。'),
      exercise('unit-4-c', '情境迁移', '水龙头保持相同速度，4分钟流出28升水。9分钟流出多少升水？', '63', '升', '先求每分钟流出的水量。', '28÷4＝7升/分钟，7×9＝63升。'),
    ],
  };
}
function sumLesson(grade: number, total: number, difference: number): Lesson {
  const small = (total - difference) / 2, large = small + difference;
  return {
    id: `sum-${grade}`, version: 1, grade, topic: 'sum', title: '两个人的弹珠', description: '剪掉多出来的一段，就能平均分了。',
    problem: `小米和小禾一共有 ${total} 颗弹珠，小米比小禾多 ${difference} 颗。小米有多少颗弹珠？`,
    tags: ['线段图', '已知和与差'], scene: { kind: 'sum', total, difference, names: ['小米', '小禾'], unit: '颗' },
    steps: [
      { title: '读懂题目', caption: `一共 ${total} 颗，是“和”；多 ${difference} 颗，是“差”。`, narration: `小米和小禾一共有${total}颗弹珠。小米比小禾多${difference}颗。题目要问小米有多少颗。我们用两条线段，把两个人的弹珠画出来。` },
      { title: '画出和与差', caption: `长线段表示小米，短线段表示小禾。多出来的部分是 ${difference} 颗。`, narration: `小米更多，所以小米的线段更长。两条线段加起来是${total}颗。长线段比短线段多的这一小段，就是${difference}颗。我们把它标出来。` },
      { title: '先想一想', caption: '如果去掉小米多出来的弹珠，两个人的数量会怎样？', narration: `想一想，如果把小米多出来的${difference}颗拿走，小米和小禾剩下的弹珠，是一样多，还是仍然不一样多呢？`, question: { prompt: '去掉多出来的部分后，两份会……', choices: ['一样多', '小米仍然更多', '小禾变成两倍'], answer: 0, explanation: '差就是多出来的部分，去掉差，两条线段一样长。' } },
      { title: '变成相等的两份', caption: `先去掉 ${difference} 颗，剩下 ${total - difference} 颗，平均分成两份。`, narration: `去掉多出来的${difference}颗，剩下${total - difference}颗。现在，两个人一样多，可以平均分成两份。${total - difference}除以二，等于${small}。这是小禾的数量。`, formula: `(${total} − ${difference}) ÷ 2 = ${small}（颗）` },
      { title: '求出较大的数', caption: `小禾有 ${small} 颗，小米比小禾多 ${difference} 颗，所以有 ${large} 颗。`, narration: `题目问的是小米。小禾有${small}颗，小米还要加上多出来的${difference}颗，所以小米有${large}颗。检查一下，两人加起来是${total}颗，相差${difference}颗，都符合题目。`, formula: `${small} + ${difference} = ${large}（颗）` },
    ], takeaway: '较小数 =（和－差）÷2；较大数 = 较小数＋差。也可以用（和＋差）÷2求较大数。',
    mistakes: ['和减差以后忘记除以2。', '求出了较小数，却没有继续求题目要求的较大数。'],
    exercises: grade === 3 ? [
      exercise('sum-3-a', '基础巩固', '两人共有30颗弹珠，小米比小禾多8颗。小米有多少颗？', '19', '颗', '先求小禾，再加上8颗。', '小禾有(30－8)÷2＝11颗，小米有11＋8＝19颗。'),
      exercise('sum-3-b', '条件变化', '两人共有28颗弹珠，小米比小禾多4颗。小禾有多少颗？', '12', '颗', '这次问的是较小的数。', '(28－4)÷2＝12颗。检查：小米16颗，合计28颗。'),
      exercise('sum-3-c', '情境迁移', '两根绳子共长36米，长绳比短绳长6米。长绳有多长？', '21', '米', '把绳长画成两条线段。', '短绳(36－6)÷2＝15米，长绳15＋6＝21米。'),
    ] : [
      exercise('sum-4-a', '基础巩固', '两人共有56颗弹珠，小米比小禾多12颗。小米有多少颗？', '34', '颗', '先去掉差，再分成相等的两份。', '(56－12)÷2＝22颗，22＋12＝34颗。'),
      exercise('sum-4-b', '条件变化', '两人共有64张卡片，姐姐比弟弟多18张。弟弟有多少张？', '23', '张', '弟弟是较少的那一份。', '(64－18)÷2＝23张。姐姐有41张，合计64张。'),
      exercise('sum-4-c', '情境迁移', '两个书架共有80本书，上层比下层多16本。上层有多少本？', '48', '本', '把上下两层想成两份数量。', '下层(80－16)÷2＝32本，上层32＋16＝48本。'),
    ],
  };
}
function cycleLesson(grade: number, colors: string[], target: number): Lesson {
  const k = colors.length, q = Math.floor(target / k), r = target % k, color = colors[(target - 1) % k];
  return {
    id: `cycle-${grade}`, version: 1, grade, topic: 'cycle', title: '彩色珠子的秘密', description: '找到一组规律，不用一颗颗数到最后。',
    problem: `珠子按“${colors.join('、')}”的顺序不断重复。从第1颗开始数，第 ${target} 颗是什么颜色？`,
    tags: ['寻找规律', `${k} 个一组`], scene: { kind: 'cycle', colors, target },
    steps: [
      { title: '读懂题目', caption: `从第1颗开始，颜色按照“${colors.join(' → ')}”重复。`, narration: `看，这里有一串彩色珠子。它们按照${colors.join('、')}的顺序不断重复。我们要找的是第${target}颗珠子的颜色。` },
      { title: '找出重复的一组', caption: `每 ${k} 颗是一组，下一组的颜色顺序完全相同。`, narration: `先找到最小的重复单元。${colors.join('、')}，这${k}颗是一组。后面每一组的颜色顺序都相同。我们把相同的一组圈起来。` },
      { title: '先想一想', caption: '把珠子按完整的重复单元分组，每组有几颗？', narration: `先检查一下你找到的规律。一个完整的重复单元里有几颗珠子？选出答案，再往下看。`, question: { prompt: '每个完整的重复单元有几颗？', choices: ['2 颗', '3 颗', '4 颗'], answer: k - 2, explanation: `${colors.join('、')}正好${k}颗，这${k}颗才构成一个完整的重复单元。` } },
      { title: '分组，看余数', caption: `${target} 颗可以分成 ${q} 个完整组，还剩 ${r} 颗。`, narration: `${target}除以${k}，商是${q}，余数是${r}。这说明，前面有${q}组完整的珠子，然后还有${r}颗。我们只需要在新的一组里，找到第${r}颗。`, formula: `${target} ÷ ${k} = ${q} …… ${r}` },
      { title: '定位这一颗', caption: `余数是 ${r}，对应这一组的第 ${r} 颗，所以是${color}色。`, narration: `余数是${r}，就看一组里的第${r}颗。它是${color}色，所以，第${target}颗是${color}色。还有一个小提醒，如果余数是零，要看每一组的最后一颗。`, formula: `第 ${target} 颗 → 组内第 ${r} 颗 → ${color}色` },
    ], takeaway: '先找每组数量，再用序号除以每组数量。余数对应组内位置；余数为0时，对应一组的最后一个。',
    mistakes: ['没有找完整的重复单元就开始计算。', '把余数0当作“第0个”；它对应每组最后一个。', '序号要从1开始数。'],
    exercises: grade === 3 ? [
      exercise('cycle-3-a', '基础巩固', '珠子按红、黄、蓝重复排列。第17颗是什么颜色？', '黄', '', '17除以3，余数对应组内位置。', '17÷3＝5……2，第2颗是黄色。', ['红', '黄', '蓝']),
      exercise('cycle-3-b', '条件变化', '珠子按红、黄、蓝重复排列。第18颗是什么颜色？', '蓝', '', '余数为0时，取每组最后一颗。', '18÷3＝6，余数0，取每组第3颗，所以是蓝色。', ['红', '黄', '蓝']),
      exercise('cycle-3-c', '情境迁移', '旗子按红、黄、蓝重复排列。从第1面开始数，第22面是什么颜色？', '红', '', '物品变了，分组的方法没有变。', '22÷3＝7……1，第1面是红色。', ['红', '黄', '蓝']),
    ] : [
      exercise('cycle-4-a', '基础巩固', '珠子按红、黄、蓝、绿重复排列。第31颗是什么颜色？', '蓝', '', '先确定每组有4颗。', '31÷4＝7……3，组内第3颗是蓝色。', ['红', '黄', '蓝', '绿']),
      exercise('cycle-4-b', '条件变化', '珠子按红、黄、蓝、绿重复排列。第32颗是什么颜色？', '绿', '', '整除时取这一组的最后一颗。', '32÷4＝8，余数0，组内最后一颗是绿色。', ['红', '黄', '蓝', '绿']),
      exercise('cycle-4-c', '情境迁移', '彩旗按红、黄、蓝、绿重复排列。第45面是什么颜色？', '红', '', '用序号除以重复单元的长度。', '45÷4＝11……1，组内第1面是红色。', ['红', '黄', '蓝', '绿']),
    ],
  };
}
export const lessons: Lesson[] = [
  treeLesson(3, 30, 5, 'both'), treeLesson(4, 36, 6, 'one'),
  unitLesson(3, 3, 6, 5), unitLesson(4, 6, 18, 8),
  sumLesson(3, 24, 6), sumLesson(4, 42, 10),
  cycleLesson(3, ['红', '黄', '蓝'], 14), cycleLesson(4, ['红', '黄', '蓝', '绿'], 26),
  ...extraLessons,
];
export function audioPath(lesson: Lesson, step: number) { return `/audio/${lesson.id}-${step + 1}.m4a`; }

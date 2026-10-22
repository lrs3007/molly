import type { Lesson } from '../src/content.ts';
export const speechProfileVersion = 1;
export const voices = {
  xiaohe: { speaker: 'zh_female_xiaohe_uranus_bigtts', label: '亲切老师 · 小何 2.0' },
  storybook: { speaker: 'zh_female_xiaoxue_uranus_bigtts', label: '温暖讲述 · 儿童绘本 2.0' },
  yunzhou: { speaker: 'zh_male_m191_uranus_bigtts', label: '耐心老师 · 云舟 2.0' },
};
export type VoiceName = keyof typeof voices;
export const speechRate = -8;
export const sampleRate = 24000;
export const teacherDirection = '请用清晰、自然的标准普通话，为小学一年级奥数班学生讲数学。像耐心亲切的老师在和一个孩子交流，语速稍慢，声线放松，句子连贯。关键数量关系稍作强调，问句自然上扬，句末适当停顿。保持成年老师的正常声线，避免播音腔、夸张卖萌和地方方言。只朗读提供的讲稿，不添加内容。';

export function spokenNumber(number: number): string {
  if (!Number.isInteger(number) || number < 0 || number >= 10000) throw new Error('Spoken numbers must be integers between 0 and 9999.');
  if (number === 0) return '零';
  const digits = '零一二三四五六七八九';
  const units = ['', '十', '百', '千'];
  let text = '', pendingZero = false;
  for (let position = 3; position >= 0; position--) {
    const digit = Math.floor(number / 10 ** position) % 10;
    if (digit) { if (pendingZero) text += '零'; text += digits[digit] + units[position]; pendingZero = false; }
    else if (text) pendingZero = true;
  }
  return text.replace(/^一十/, '十');
}
export function teachingText(lesson: Lesson, step: number): string {
  const s = lesson.scene;
  let lines: string[];
  if (s.kind === 'trees') {
    const intervals = s.length / s.spacing, both = s.ends === 'both', count = intervals + (both ? 1 : 0);
    lines = [
      `来，咱们一起给小路种树。小路长${s.length}米，只在一侧，每隔${s.spacing}米种一棵。先看清楚：${both ? '起点和终点，都要种树' : '起点种树，终点不种'}。这个条件很重要，等会儿咱们还会用到它。`,
      `先别急着数树。看图，两棵相邻的树之间，有一小段路，咱们叫它一个间隔。每段${s.spacing}米，${s.length}米能分成几段呢？${s.length}除以${s.spacing}，等于${intervals}。所以，有${intervals}个间隔。`,
      `现在请你猜一猜：${intervals}个间隔，${both ? '两端都种' : '只在一端种'}，需要几棵树呢？可以拿笔画几个点，再数一数。不着急，想好了再选。`,
      both ? `看，咱们从起点开始，先种第一棵。每走过一个间隔，再种一棵。发现了吗？${intervals}个间隔的两端，一共有${count}棵树。多出来的这一棵，就是起点的那棵。` : `看，先在每个分界点上种树。如果两端都种，就有${intervals + 1}棵。可是，题目说终点不种。把终点这棵去掉，还剩${count}棵。只种一端，树和间隔就一样多啦。`,
      `咱们把方法连起来：先用${s.length}除以${s.spacing}，求出${intervals}个间隔。${both ? `两端都种，还要加一，所以是${count}棵` : `只种一端，间隔数就是树的棵数，所以是${count}棵`}。记住，先数间隔，再看两端。去试一道小练习吧！`,
    ];
  } else if (s.kind === 'unit') {
    const each = s.total / s.count;
    lines = [
      `咱们去文具店看看。${s.count}支同样的铅笔，一共${s.total}元。现在想买${s.target}支，要花多少钱呢？先记住，每支铅笔的价格都一样。`,
      `要算${s.target}支，可以先找一支。把${s.total}元平均分给${s.count}支铅笔。${s.total}除以${s.count}，等于${each}。原来，一支铅笔是${each}元。咱们找到最重要的这一份啦。`,
      `一支是${each}元，那${s.target}支呢？应该把${each}和${s.target}相加，还是相乘？想一想，${s.target}支里面，有几个${each}元？选好再继续。`,
      `看，把一支变成${s.target}支。每支${each}元，就有${s.target}个${each}元。几个相同的数相加，可以用乘法。所以，${each}乘${s.target}，等于${each * s.target}元。`,
      `这类题有个小办法：先找一份，再找几份。咱们先求一支多少钱，再乘要买的支数。答案是${each * s.target}元。换成积木或水量，也可以想想这个办法。去练练吧！`,
    ];
  } else if (s.kind === 'sum') {
    const small = (s.total - s.difference) / 2, large = small + s.difference;
    lines = [
      `小米和小禾，一共有${s.total}颗弹珠。小米比小禾多${s.difference}颗。咱们要找小米有多少颗。这次，试着把数量画成线段，好不好？`,
      `看，长一点的线段代表小米，短一点的代表小禾。两条加起来，是${s.total}颗。长出来的这一小段，就是多出来的${s.difference}颗。题目里的和与差，现在都看得见啦。`,
      `想一想，如果暂时拿走小米多出来的${s.difference}颗，两个人剩下的弹珠，会不会一样多？看看两条线段，再选一选。`,
      `对，去掉多出来的一段，两份就相等啦。${s.total}减${s.difference}，还剩${s.total - s.difference}颗。把它平均分成两份，每份是${small}颗。注意，这一步求出的是小禾的数量。`,
      `题目问的是小米，还要再走一步。小禾有${small}颗，小米多${s.difference}颗，加起来就是${large}颗。检查一下，两人一共${s.total}颗，又正好多${s.difference}颗。都对上啦！`,
    ];
  } else if (s.kind === 'cycle') {
    const k = s.colors.length, quotient = Math.floor(s.target / k), remainder = s.target % k, index = remainder || k;
    lines = [
      `来看这串彩色珠子。${s.colors.join('、')}，后面又是一样的顺序。咱们要找第${s.target}颗是什么颜色。你发现它藏着什么规律了吗？`,
      `把${s.colors.join('、')}这${k}颗，圈成一组。下一组，颜色和顺序都一样。原来，珠子是每${k}颗重复一次。找到了这一组，就不用一颗一颗数到最后啦。`,
      `先来检查一下：一个完整的重复单元，应该有几颗珠子呢？记得，要从一组的开头，数到这一组的结尾。想好了再选。`,
      `${s.target}除以${k}，商是${quotient}，余数是${remainder}。前面有${quotient}个完整组，后面还剩${remainder}颗。所以，咱们只要看新的一组里，第${index}颗是什么颜色。`,
      `看，一组里的第${index}颗，是${s.colors[index - 1]}色。所以，第${s.target}颗也是${s.colors[index - 1]}色。还有个小提醒：如果正好分完，余数是零，就看每一组的最后一颗。去试试这个规律吧！`,
    ];
  } else {
    lines = lesson.steps.map(item => item.narration);
  }
  if (!lines[step]) throw new Error(`Unknown teaching step ${lesson.id}/${step}`);
  return lines[step].replace(/\d+/g, value => spokenNumber(Number(value)))
    .replace(/(?<![第零一二三四五六七八九十百千])二(?=[个支棵份颗元段根本张])/gu, '两');
}
export function directionForStep(step: number) {
  return teacherDirection + (step === 2 ? '这一段是让孩子独立思考的提问，语气带一点好奇，结尾轻轻收住。' : step === 4 ? '这一段是方法总结，肯定孩子的思考，语气温暖、平稳。' : '这一段是在带着孩子看图，提示关键关系时自然强调。');
}

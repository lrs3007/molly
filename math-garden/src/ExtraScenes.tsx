import type { Scene } from './content';
import { GridLines } from './GridDiagram';
import { gridShapes } from './grid';
type Props<K extends Scene['kind']> = { scene: Extract<Scene, { kind: K }>; step: number; p: number };
const ink = '#52775e', green = '#79a58a', gold = '#dfb765';
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function AverageScene({ scene, step, p }: Props<'average'>) {
  const { values, mode } = scene, total = values.reduce((a, b) => a + b, 0), mean = total / values.length;
  const gap = 410 / (values.length - 1), x = (col: number) => 100 + col * gap, y = (index: number) => 231 - index * 12;
  const targets: { col: number; index: number }[] = [];
  values.forEach((n, col) => { for (let i = n; i < mean; i++) targets.push({ col, index: i }); });
  let moved = 0;
  const t = mode === 'mean' ? step === 3 ? clamp((p - .1) / .65) : step >= 4 ? 1 : 0 : step >= 4 ? clamp(p * 1.5) : 0;
  return <>
    <text x="305" y="31" textAnchor="middle" fill={ink} fontSize="14">{mode === 'missing' ? '先用平均数找总数，再找缺少的一盒' : '移动积木，总数不变'}</text>
    {values.map((n, col) => {
      const hidden = mode === 'missing' && col === values.length - 1 && step < 3;
      return <g key={col}>
        <path d={`M${x(col) - 28} 91v155h56V91`} fill="#fffdf7" stroke="#d1ddc8" strokeWidth="2"/>
        {!hidden && Array.from({ length: n }, (_, index) => {
          const target = index >= mean ? targets[moved++] : undefined;
          const tx = target ? x(target.col) : x(col), ty = target ? y(target.index) : y(index);
          const progress = target ? t : 0;
          return <rect key={index} x={lerp(x(col), tx, progress) - 17} y={lerp(y(index), ty, progress) - Math.sin(progress * Math.PI) * 44} width="34" height="10" rx="2" fill={target ? gold : green}/>;
        })}
        {hidden && <text x={x(col)} y="178" textAnchor="middle" fontSize="40" fill="#bd9c54">?</text>}
        <text x={x(col)} y="270" textAnchor="middle" fill={ink} fontSize="14">第{col + 1}盒 · {hidden ? '?' : t >= .99 ? mean : n}块</text>
      </g>;
    })}
    {(mode === 'missing' || step >= 3) && <g><path d={`M65 ${y(mean - 1) - 3}H545`} stroke="#bd9c54" strokeDasharray="5 5"/><text x="545" y={y(mean - 1) - 9} textAnchor="end" fill="#a08241" fontSize="12">{mode === 'missing' ? `平均每盒${mean}块` : t >= .99 ? `每盒${mean}块` : '向同一高度靠齐'}</text></g>}
    {step >= 1 && <text x="305" y="65" textAnchor="middle" fill={ink} fontSize="15">总数 {total} 块{mode === 'missing' ? `＝${mean}×${values.length}` : `＝${values.join('＋')}`}</text>}
  </>;
}

function RatioScene({ scene, step, p }: Props<'ratio'>) {
  const { multiple: m, amount, relation } = scene, difference = relation === 'difference';
  const parts = difference ? m - 1 : m + 1, each = amount / parts, width = 350 / m;
  const shown = step === 1 ? Math.max(1, Math.ceil(p * m)) : m;
  return <>
    <text x="305" y="32" textAnchor="middle" fill={ink} fontSize="14">弟弟是1份，姐姐是{m}个同样的1份</text>
    <text x="84" y="111" textAnchor="end" fill={ink} fontSize="15">姐姐</text>
    <text x="84" y="211" textAnchor="end" fill={ink} fontSize="15">弟弟</text>
    {Array.from({ length: m }, (_, i) => <g key={i} opacity={i < shown ? 1 : .15}>
      <rect x={110 + i * width} y="82" width={width - 4} height="45" rx="5" fill={difference && i > 0 ? gold : green}/>
      <text x={110 + (i + .5) * width - 2} y="110" textAnchor="middle" fill="white" fontSize="14">{step >= 3 ? `${each}支` : '1份'}</text>
    </g>)}
    <rect x="110" y="182" width={width - 4} height="45" rx="5" fill={green}/>
    <text x={110 + width / 2 - 2} y="210" textAnchor="middle" fill="white" fontSize="14">{step >= 3 ? `${each}支` : '1份'}</text>
    {difference ? <><path d={`M${110 + width} 73v-16H460v16`} fill="none" stroke="#ae904b"/><text x={285 + width / 2} y="50" textAnchor="middle" fill="#a08241" fontSize="14">多出的{parts}份＝{amount}支</text></> : <><path d="M480 82h14v145h-14" fill="none" stroke="#91a480"/><text x="507" y="149" fill={ink} fontSize="14">共{parts}份</text><text x="507" y="174" fill={ink} fontSize="14">{amount}支</text></>}
    <text x="305" y="273" textAnchor="middle" fill={ink} fontSize="15">{step >= 4 ? `姐姐${each * m}支，弟弟${each}支` : step >= 3 ? `${amount}÷${parts}＝${each}支 / 份` : difference ? `${m}−1＝${parts}份` : `${m}＋1＝${parts}份`}</text>
  </>;
}

function TransferScene({ scene, step, p }: Props<'transfer'>) {
  const { left, right, mode } = scene, moved = (left - right) / 2, equal = (left + right) / 2, reverse = mode === 'reverse';
  const leftStart = reverse ? equal : left, rightStart = reverse ? equal : right;
  const t = step === 1 && !reverse ? clamp(p * 2) / moved : step === 3 ? clamp((p - .08) / .8) : step >= 4 ? 1 : 0;
  const movedNow = Math.floor(t * moved + 1e-6);
  const leftNow = leftStart + (reverse ? movedNow : -movedNow), rightNow = rightStart + (reverse ? -movedNow : movedNow);
  const point = (col: number, index: number) => ({ x: (col === 0 ? 120 : 365) + index % 6 * 22, y: 223 - Math.floor(index / 6) * 23 });
  const movingCol = reverse ? 1 : 0, sourceCount = reverse ? rightStart : leftStart, targetCol = 1 - movingCol, targetCount = reverse ? leftStart : rightStart;
  return <>
    <text x="305" y="30" textAnchor="middle" fill={ink} fontSize="14">{reverse ? '从移动后的相等，倒着还原' : '一边减少，另一边同时增加'}</text>
    {[0, 1].map(col => <g key={col}><rect x={col === 0 ? 101 : 346} y="102" width="154" height="137" rx="18" fill="#fffdf7" stroke="#cbd9c3"/><text x={col === 0 ? 178 : 423} y="269" textAnchor="middle" fill={ink} fontSize="16">{col === 0 ? '小米' : '小禾'} · {col === 0 ? leftNow : rightNow}颗</text></g>)}
    {[leftStart, rightStart].flatMap((count, col) => Array.from({ length: count }, (_, index) => {
      const movingIndex = col === movingCol && index >= sourceCount - moved ? index - (sourceCount - moved) : -1;
      const from = point(col, index), to = movingIndex >= 0 ? point(targetCol, targetCount + movingIndex) : from;
      const progress = movingIndex >= 0 ? clamp(t * moved - movingIndex) : 0;
      return <circle key={`${col}-${index}`} cx={lerp(from.x, to.x, progress)} cy={lerp(from.y, to.y, progress) - Math.sin(progress * Math.PI) * 80} r="8" fill={movingIndex >= 0 ? gold : green}/>;
    }))}
    <path d={reverse ? 'M362 80H248m14-8-14 8 14 8' : 'M248 80h114m-14-8 14 8-14 8'} fill="none" stroke="#b99c53" strokeWidth="2"/>
    <text x="305" y="63" textAnchor="middle" fill="#a08241" fontSize="13">{reverse ? '还回去' : '移过去'} {step >= 3 || reverse ? moved : step === 1 ? 1 : '?'}颗</text>
    <text x="305" y="297" textAnchor="middle" fill={ink} fontSize="12">总数始终是{left + right}颗 · 现在相差{Math.abs(leftNow - rightNow)}颗</text>
  </>;
}

function GeometryScene({ scene, step, p }: Props<'geometry'>) {
  const square = scene.shape === 'square', shapes = gridShapes(scene.rows, scene.columns, square);
  const sizes = Array.from({ length: square ? scene.rows : scene.columns }, (_, i) => i + 1);
  const groups = sizes.map(size => shapes.filter(s => square ? s.height === size : s.width === size));
  const activeGroups = step <= 1 ? [0] : step === 2 ? [1] : step === 3 ? [1, 2] : [0, 1, 2];
  const sequence = activeGroups.flatMap(i => groups[i] ?? []), index = Math.min(sequence.length - 1, Math.floor(p * sequence.length));
  const active = step === 0 ? undefined : sequence[Math.max(0, index)], cell = square ? 58 : 72;
  const y = square ? 62 : 110;
  return <>
    <text x="305" y="30" textAnchor="middle" fill={ink} fontSize="14">按{square ? '边长' : '宽度'}分类，同一类按位置逐个数</text>
    <g transform={`translate(92 ${y})`}>
      <GridLines rows={scene.rows} columns={scene.columns} cell={cell}/>
      {active && <rect x={active.column * cell + 3} y={active.row * cell + 3} width={active.width * cell - 6} height={active.height * cell - 6} rx="3" fill={gold} fillOpacity=".24" stroke="#bc9550" strokeWidth="3"/>}
    </g>
    {groups.map((group, i) => <g key={i} opacity={step === 0 ? .35 : 1}>
      <rect x="351" y={65 + i * 58} width="188" height="43" rx="9" fill={active && (square ? active.height : active.width) === i + 1 ? '#f9edce' : '#fffdf6'} stroke="#dce4d2"/>
      <text x="368" y={92 + i * 58} fill={ink} fontSize="14">{square ? '边长' : '宽'}{i + 1}格</text>
      <text x="522" y={92 + i * 58} textAnchor="end" fill={ink} fontSize="16">{step >= 4 || step >= 3 && i >= 1 || step >= 1 && i === 0 ? `${group.length}个` : '?个'}</text>
    </g>)}
    <text x="305" y="277" textAnchor="middle" fill={ink} fontSize="15">{step >= 4 ? `${groups.map(g => g.length).join('＋')}＝${shapes.length}个${square ? '正方形' : '长方形'}` : active ? `当前框：高${active.height}格、宽${active.width}格 · 第${active.row + 1}行第${active.column + 1}列起` : square ? '只数正方形，边都沿格线' : '长方形包括正方形，边都沿格线'}</text>
  </>;
}

function AgeScene({ scene, step, p }: Props<'age'>) {
  const { older, younger, multiple, direction } = scene, past = direction === 'past', gap = older - younger;
  const targetYoung = gap / (multiple - 1), delta = targetYoung - younger, years = Math.abs(delta);
  const change = step === 1 ? Math.min(1, Math.floor(p * 2)) * (past ? -1 : 1) : step >= 4 ? Math.round(delta * clamp(p * 1.5)) : 0;
  const nowYoung = younger + change, nowOld = older + change;
  const scale = 340 / Math.max(older, targetYoung * multiple);
  const barMode = step === 2 || step === 3;
  return <>
    <text x="305" y="31" textAnchor="middle" fill={ink} fontSize="14">{barMode ? '目标时刻：大人3份，孩子1份，相差2份' : '时间一起走，年龄差不变'}</text>
    {[nowOld, nowYoung].map((age, i) => <g key={i}>
      <text x="90" y={103 + i * 80} textAnchor="end" fill={ink} fontSize="15">{i === 0 ? past ? '妈妈' : '爸爸' : past ? '小禾' : '小明'}</text>
      <rect x="111" y={77 + i * 80} width={barMode ? (i === 0 ? 3 : 1) * 110 : age * scale} height="39" rx="6" fill={i === 0 ? green : gold}/>
      <text x="126" y={102 + i * 80} fill={i === 0 ? 'white' : '#735627'} fontSize="15">{barMode ? step === 3 ? `${i === 0 ? targetYoung * 3 : targetYoung}岁` : i === 0 ? '3份' : '1份' : `${age}岁`}</text>
      {barMode && i === 0 && [1, 2].map(part => <path key={part} d={`M${111 + part * 110} 77v39`} stroke="white" strokeWidth="2" strokeDasharray="4 3"/>)}
    </g>)}
    <text x="477" y="144" fill={ink} fontSize="14">相差{gap}岁</text>
    <path d="M108 237H490m-8-5 8 5-8 5" fill="none" stroke="#9db08d" strokeWidth="2"/>
    <text x="108" y="263" textAnchor="middle" fill={ink} fontSize="12">{past ? step >= 4 ? `${years}年前` : '?年前' : '今年'}</text>
    <text x="490" y="263" textAnchor="middle" fill={ink} fontSize="12">{past ? '今年' : `${years}年后`}</text>
    <circle cx={barMode ? past ? 108 : 490 : past ? lerp(490, 108, -change / years) : lerp(108, 490, change / years)} cy="237" r="7" fill={green}/>
    <text x="305" y="293" textAnchor="middle" fill={ink} fontSize="13">{step >= 4 ? `${years}年${past ? '前' : '后'}：${targetYoung * multiple}÷${targetYoung}＝${multiple}` : barMode ? `${gap}岁对应3−1＝2份` : change ? `两个人都${past ? '减少' : '增加'}${Math.abs(change)}岁，差仍是${gap}岁` : '同过1年，两个人都增加1岁'}</text>
  </>;
}

export default function ExtraScenes({ scene, step, p }: { scene: Scene; step: number; p: number }) {
  switch (scene.kind) {
    case 'average': return <AverageScene scene={scene} step={step} p={p}/>;
    case 'ratio': return <RatioScene scene={scene} step={step} p={p}/>;
    case 'transfer': return <TransferScene scene={scene} step={step} p={p}/>;
    case 'geometry': return <GeometryScene scene={scene} step={step} p={p}/>;
    case 'age': return <AgeScene scene={scene} step={step} p={p}/>;
    default: return null;
  }
}

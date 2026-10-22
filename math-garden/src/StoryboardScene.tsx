import { useState } from 'react';
import PlantingLoopScene from './PlantingLoopScene';
import CompoundUnitScene from './CompoundUnitScene';
import type { Lesson } from './content';
import type { StoryFrame } from './story-types';
import { enumerateTriangles, lShapeSquares, triangleSegments } from './figure-math';
const green = '#7da58a', ink = '#4f745b', gold = '#d3a951';
const progress = (p: number) => Math.max(0, Math.min(1, p));
function Body({ frame, previous, p }: { frame: Exclude<StoryFrame, { kind: 'figures' }>; previous?: StoryFrame; p: number }) {
  const t = progress(p * 1.8);
  switch (frame.kind) {
    case 'production-grid':
    case 'food-supply': return <CompoundUnitScene frame={frame} p={p}/>;
    case 'planting-loop': return <PlantingLoopScene frame={frame} p={p}/>;
    case 'bars': {
      const max = Math.max(1, ...frame.rows.map(row => row.value)), count = frame.rows.length;
      return <>{frame.rows.map((row, i) => {
        const y = 72 + i * Math.min(65, 176 / count), width = row.value / max * 330;
        const before = previous?.kind === 'bars' ? previous.rows.find(r => r.label === row.label)?.value ?? row.value : row.value;
        const shownWidth = (before + (row.value - before) * t) / max * 330;
        const parts = row.parts && row.parts <= 24 ? row.parts : 1;
        const part = Math.min(parts - 1, Math.floor(p * parts));
        return <g key={i}><text x="132" y={y + 23} textAnchor="end" fontSize="13" fill={ink}>{row.label}</text>
          <rect x="146" y={y} width={Math.max(1, shownWidth)} height="36" rx="5" fill={i % 2 ? '#dfbd76' : green}/>
          {parts > 1 && <rect x={146 + width * part / parts} y={y} width={width / parts} height="36" fill="#f7df9c" fillOpacity=".65"/>}
          {Array.from({ length: parts - 1 }, (_, j) => <path key={j} d={`M${146 + width * (j + 1) / parts} ${y}v36`} stroke="white" strokeDasharray="4 3"/>)}
          <text x={Math.min(554, 158 + width)} y={y + 23} fontSize="14" fill={ink}>{row.display ?? row.value}</text></g>;
      })}</>;
    }
    case 'calendar': {
      const names = ['一','二','三','四','五','六','日'];
      const prevFocus = previous?.kind === 'calendar' ? previous.focus ?? frame.focus : frame.focus;
      const focus = frame.focus ? Math.round((prevFocus ?? frame.focus) + (frame.focus - (prevFocus ?? frame.focus)) * t) : undefined;
      return <>{names.map((name, i) => <text key={name} x={106 + i * 64} y="65" textAnchor="middle" fontSize="13" fill={ink}>周{name}</text>)}
        {Array.from({ length: frame.days }, (_, i) => {
          const day = i + 1, col = (frame.start + i) % 7, row = Math.floor((frame.start + i) / 7), x = 79 + col * 64, y = 76 + row * 30;
          const selected = day === focus, highlighted = frame.weekdays?.includes(col);
          return <g key={day}><rect x={x} y={y} width="54" height="25" rx="5" fill={selected ? gold : highlighted ? '#dce9d2' : '#fffdf5'} stroke={selected ? '#b68d3d' : '#dfe7d5'}/><text x={x + 27} y={y + 18} textAnchor="middle" fontSize="12" fill={ink}>{day}</text></g>;
        })}</>;
    }
    case 'sequence': {
      const items = frame.count + 1, active = Math.min(frame.count - 1, Math.floor(p * frame.count)), columns = items <= 10 ? items : 10;
      const gap = Math.min(58, 520 / columns), offset = 305 - (columns - 1) * gap / 2;
      return <>{Array.from({ length: items }, (_, i) => {
        const x = offset + i % columns * gap, y = items > 10 ? 111 + Math.floor(i / columns) * 85 : 145;
        const excluded = !!frame.excludedEnds && (i === frame.count || frame.excludedEnds === 'both' && i === 0);
        const wraps = (i + 1) % columns === 0 && i < frame.count;
        return <g key={i}><text x={x} y={y - 35} textAnchor="middle" fontSize="10" fill={ink}>{frame.excludedEnds ? `${i * frame.pattern[0]}米` : `第${i + 1}个`}</text>
          {frame.widths ? <><rect x={x - 13} y={y - 15} width="26" height="28" rx="5" fill={i % 2 ? gold : green}/><text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="white">{frame.widths[i % frame.widths.length]}米</text></> : excluded ? <><circle cx={x} cy={y} r="11" fill="none" stroke="#ad9c80" strokeDasharray="3 2"/><path d={`M${x-6} ${y-6}l12 12m0-12-12 12`} stroke="#ad9c80" strokeWidth="2"/><text x={x} y={y+48} textAnchor="middle" fontSize="10" fill={ink}>不种</text></> : <circle cx={x} cy={y} r="11" fill={i % 3 === 0 ? '#527e5d' : i % 3 === 1 ? gold : green}/>}
          {wraps && <text x={x + 25} y={y - 20} fontSize="9" fill={ink}>续下行</text>}
          {i < frame.count && <><path d={`M${x + 15} ${y + 6}h${Math.max(10, gap - 30)}`} stroke={i === active ? '#bb8f35' : '#b6c6a7'} strokeWidth={i === active ? 4 : 2}/><text x={x + gap / 2} y={y + 28} textAnchor="middle" fill={i === active ? '#a17b32' : ink} fontSize="10">{frame.pattern[i % frame.pattern.length]}米</text></>}
        </g>;
      })}<text x="305" y="248" textAnchor="middle" fontSize="12" fill={ink}>当前看第{active + 1}个间隔 · 示意图不按实际比例</text></>;
    }
    case 'table': {
      const cell = Math.min(65, 510 / frame.headers.length), start = 305 - cell * frame.headers.length / 2;
      return <>{frame.headers.map((header, i) => <g key={header}>
        <rect x={start + i * cell} y="88" width={cell} height="49" fill="#e0ead6" stroke="#9db28f"/>
        <rect x={start + i * cell} y="137" width={cell} height="56" fill={frame.highlights.includes(i) ? '#f6e3b5' : '#fffdf7'} stroke="#9db28f"/>
        <text x={start + (i + .5) * cell} y="119" textAnchor="middle" fontSize="18" fill={ink}>{header}</text>
        <text x={start + (i + .5) * cell} y="171" textAnchor="middle" fontSize={String(frame.values[i]).length > 4 ? 10 : 18} fill={ink}>{frame.values[i]}</text>
        {frame.highlights.includes(i) && <path d={`M${start + i * cell + 7} 204h${(cell - 14) * (.2 + .8 * t)}`} stroke={gold} strokeWidth="4"/>}
      </g>)}</>;
    }
    case 'route': {
      const previousDistance = previous?.kind === 'route' ? previous.covered : frame.covered;
      const covered = previousDistance + (frame.covered - previousDistance) * t, ratio = covered / frame.total;
      return <>
        <path d="M70 151H540" stroke="#d5dfc5" strokeWidth="23" strokeLinecap="round"/>
        <path d={`M70 151h${470 * ratio}`} stroke={green} strokeWidth="23" strokeLinecap="round"/>
        <circle cx={70 + 470 * ratio} cy="151" r="16" fill={gold} stroke="#fffdf5" strokeWidth="3"/>
        <text x="305" y="101" textAnchor="middle" fontSize="18" fill={ink}>全程 {frame.total} {frame.total >= 1000 ? '米' : '千米'}</text>
        <text x="70" y="204" fontSize="13" fill={ink}>{frame.labels[0]}</text><text x="540" y="204" textAnchor="end" fontSize="13" fill={ink}>{frame.labels[1]}</text>
      </>;
    }
  }
}

function FigureBody({ frame, p, selectedGroup, selected }: { frame: Extract<StoryFrame, { kind: 'figures' }>; p: number; selectedGroup?: string; selected: number | null }) {
  const group = selectedGroup ?? frame.group;
  if (frame.figure === 'l-squares') {
    const { cells, squares } = lShapeSquares(), size = group === 'small' ? 1 : group === 'medium' ? 2 : group === 'large' ? 3 : 0;
    const items = squares.filter(s => !size || s.size === size), index = Math.min(items.length - 1, selected ?? Math.floor(p * items.length)), shape = items[Math.max(0,index)];
    return <><g transform="translate(198 45)">
      {[...cells].map(cell => { const [x,y] = cell.split(',').map(Number); return <rect key={cell} x={x * 34} y={y * 34} width="34" height="34" fill="#fffdf5" stroke="#638469" strokeWidth="1.5"/>; })}
      {shape && <rect x={shape.column * 34 + 2} y={shape.row * 34 + 2} width={shape.size * 34 - 4} height={shape.size * 34 - 4} fill={gold} fillOpacity=".22" stroke="#ba8b33" strokeWidth="3"/>}
    </g><text x="305" y="266" textAnchor="middle" fontSize="12" fill={ink}>正在看：{size ? `边长${size}格` : '所有大小'} · 第{Math.max(0,index) + 1} / {items.length}个</text></>;
  }
  const figure = Number(frame.figure.at(-1)), all = enumerateTriangles(figure), top = (t: number[][]) => t.some(([x,y]) => Math.abs(x) < 1e-7 && Math.abs(y) < 1e-7);
  const items = all.filter(t => group === 'top' ? top(t) : group === 'other' ? !top(t) : true), index = Math.min(items.length - 1, selected ?? Math.floor(p * items.length)), shape = items[Math.max(0,index)];
  const point = ([x,y]: number[]) => `${305 + x * 43},${46 + y * 32}`;
  return <>
    {triangleSegments(figure).map(([a,b], i) => <polyline key={i} points={`${point(a)} ${point(b)}`} fill="none" stroke="#5a7d61" strokeWidth="2"/>)}
    {shape && <polygon points={shape.map(point).join(' ')} fill={gold} fillOpacity=".23" stroke="#b8872c" strokeWidth="3"/>}
    <circle cx="305" cy="46" r="4" fill="#9e6e20"/><text x="318" y="50" fontSize="12" fill={ink}>最上顶点</text>
    <text x="305" y="266" textAnchor="middle" fill={ink} fontSize="12">{group === 'top' ? '含最上顶点' : group === 'other' ? '不含最上顶点' : '全部三角形'} · 由小到大 · 第{Math.max(0,index) + 1} / {items.length}个</text>
  </>;
}
export default function StoryboardScene({ lesson, step, fraction }: { lesson: Lesson; step: number; fraction: number }) {
  const [selected, setSelected] = useState<number | null>(null), [selectedGroup, setSelectedGroup] = useState<string>();
  if (lesson.scene.kind !== 'storyboard') return null;
  const frame = lesson.scene.frames[step], previous = lesson.scene.frames[step - 1];
  const group = selectedGroup ?? (frame.kind === 'figures' ? frame.group : 'all');
  let count = 0;
  if (frame.kind === 'figures') {
    if (frame.figure === 'l-squares') count = lShapeSquares().squares.filter(s => group === 'small' ? s.size === 1 : group === 'medium' ? s.size === 2 : group === 'large' ? s.size === 3 : true).length;
    else count = enumerateTriangles(Number(frame.figure.at(-1))).filter(t => { const top = t.some(([x,y]) => Math.abs(x) < 1e-7 && Math.abs(y) < 1e-7); return group === 'top' ? top : group === 'other' ? !top : true; }).length;
  }
  const current = Math.min(count - 1, selected ?? Math.floor(fraction * count));
  return <div className="storyboard-scene"><svg className="lesson-scene" viewBox="0 0 610 300" role="img" aria-label={`${lesson.steps[step].title}：${lesson.steps[step].caption}`}>
    <text x="305" y="26" textAnchor="middle" fill={ink} fontSize="14">{frame.title}</text>
    {frame.kind === 'figures' ? <FigureBody frame={frame} p={fraction} selected={selected} selectedGroup={selectedGroup}/> : <Body frame={frame} previous={previous} p={fraction}/>}
    <text x="305" y="291" textAnchor="middle" fill={ink} fontSize="11">{frame.footer}</text>
  </svg>{frame.kind === 'figures' && <div className="figure-controls">
    <label>计数分组<select aria-label="计数分组" value={group} onChange={event => { setSelectedGroup(event.target.value); setSelected(null); }}><option value="all">全部图形</option>{frame.figure === 'l-squares' ? <><option value="small">边长1格</option><option value="medium">边长2格</option><option value="large">边长3格</option></> : <><option value="top">含最上顶点</option><option value="other">不含最上顶点</option></>}</select></label>
    <button disabled={current <= 0} onClick={() => setSelected(Math.max(0,current - 1))}>上一个图形</button><span>{current + 1} / {count}</span><button disabled={current >= count - 1} onClick={() => setSelected(Math.min(count - 1,current + 1))}>下一个图形</button>
    <button className={selected === null ? 'following' : ''} onClick={() => { setSelected(null); setSelectedGroup(undefined); }}>跟随讲解</button>
  </div>}</div>;
}

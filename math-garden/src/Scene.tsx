import type { Lesson, Scene as SceneData } from './content';
import ExtraScenes from './ExtraScenes';
import StoryboardScene from './StoryboardScene';
const palette: Record<string, string> = { 红: '#da7c69', 黄: '#e2ba57', 蓝: '#7aadd0', 绿: '#71a286' };
function Tree({ x, y, index, opacity = 1, ghost = false }: { x: number; y: number; index: number; opacity?: number; ghost?: boolean }) {
  return <g transform={`translate(${x} ${y})`} opacity={opacity} className="scene-object">
    <ellipse cy="5" rx="24" ry="5" fill="#426849" opacity=".1" />
    <path d="M-4 0v-31h8V0" fill={ghost ? '#c6cbbf' : '#b28a5e'} />
    <path d="m0-88-27 36h12l-22 27h74L15-52h12Z" fill={ghost ? '#ccd3c6' : index % 2 ? '#6b997a' : '#4d8465'} stroke={ghost ? '#ccd3c6' : '#427453'} strokeWidth="1.5" strokeLinejoin="round" />
    {!ghost && <><path d="m-7-67-7 12M-15-43l-7 10" stroke="#a7c69a" strokeWidth="3" strokeLinecap="round"/><circle cx="-6" cy="-37" r="1.6" fill="#254d3b"/><circle cx="6" cy="-37" r="1.6" fill="#254d3b"/><path d="M-3-31q3 3 6 0" stroke="#254d3b" fill="none" strokeWidth="1.4" strokeLinecap="round"/></>}
  </g>;
}
function Nature() {
  return <><circle cx="553" cy="40" r="19" fill="#f4d887"/><path d="M76 46c-3-15 20-22 28-9 9-9 26 0 21 11H76Z" fill="#fff"/><path d="M420 32c-2-10 13-15 19-6 7-6 18 0 15 8h-34Z" fill="#fff"/><path d="m184 46 5-3 5 3m12-9 5-3 5 3" fill="none" stroke="#a1b4a0" strokeWidth="1.4" strokeLinecap="round"/></>;
}
function PlantScene({ scene, step, p }: { scene: Extract<SceneData, { kind: 'trees' }>; step: number; p: number }) {
  const n = scene.length / scene.spacing, gap = 450 / n;
  const reveal = step === 3 ? Math.max(1, Math.ceil(p * (n + 1) * 1.3)) : step >= 4 ? n + 1 : 0;
  return <>
    <Nature />
    <path d="M0 170Q120 133 278 164T650 164v140H0Z" fill="#e2eddb" />
    <path d="M0 220q250-40 650-11v95H0Z" fill="#d5e6c8" opacity=".7" />
    <rect x="52" y="188" width="506" height="30" rx="15" fill="#e4d5ad" />
    <path d="M69 203h471" stroke="#f7efd5" strokeDasharray="8 10" strokeWidth="2" />
    <path d="M80 256h450m-450-5v10m450-10v10" stroke="#729079" strokeWidth="1.5" />
    <rect x="249" y="244" width="112" height="25" rx="12" fill="#f1f5e9" />
    <text x="305" y="262" textAnchor="middle" fill="#52725c" fontSize="14">全长 {scene.length} 米</text>
    {Array.from({ length: n + 1 }, (_, i) => {
      const x = 80 + i * gap, removed = scene.ends === 'one' && i === n && (step >= 4 || (step === 3 && p > .8));
      return <g key={i}>
        <circle cx={x} cy="203" r="3.5" fill={step >= 1 ? '#9a9472' : '#c5bb98'} />
        {step >= 1 && <text x={x} y="236" textAnchor="middle" fill="#78876d" fontSize="11">{i * scene.spacing}m</text>}
        {(step >= 3 && i < reveal) && <Tree x={x} y={191} index={i} opacity={removed ? .22 : 1} ghost={removed} />}
        {step === 0 && (i === 0 || i === n) && <><circle cx={x} cy="166" r="17" fill="#fffaf0" stroke="#e5c379"/><text x={x} y="171" textAnchor="middle" fontSize="12" fill="#8c733f">{i === 0 ? '起' : '终'}</text></>}
        {removed && <text x={x} y="89" textAnchor="middle" fill="#907554" fontSize="12">不种树</text>}
      </g>;
    })}
    {step >= 1 && Array.from({ length: n }, (_, i) => <g key={i} opacity={step === 1 && i > Math.floor(p * n * 1.4) ? .12 : 1}>
      <path d={`M${80 + i * gap + 6} 183q${gap / 2 - 6}-14 ${gap - 12} 0`} fill="none" stroke="#bd9c54" strokeWidth="1.5" />
      <text x={80 + (i + .5) * gap} y="169" textAnchor="middle" fill="#907644" fontSize="12" paintOrder="stroke" stroke="#eff5e8" strokeWidth="4">{scene.spacing} 米</text>
    </g>)}
    {step >= 3 && <><rect x="228" y="20" width="155" height="30" rx="15" fill="#fffaf0" stroke="#dfdfc5"/><text x="305" y="40" textAnchor="middle" fill="#52725c" fontSize="13">{n} 个间隔 · {step === 3 ? Math.min(reveal, scene.ends === 'one' && p > .8 ? n : n + 1) : n + (scene.ends === 'both' ? 1 : 0)} 棵树</text></>}
  </>;
}
function Pencil({ x, y, faded = false }: { x: number; y: number; faded?: boolean }) {
  return <g transform={`translate(${x} ${y}) rotate(12)`} opacity={faded ? .18 : 1}>
    <rect x="-8" y="-37" width="16" height="68" rx="2" fill="#e8bd6c"/><rect x="-2" y="-37" width="5" height="68" fill="#f6d28a"/><path d="m-8 31 8 18 8-18Z" fill="#dfc8a5"/><path d="m-3 42 3 7 3-7Z" fill="#526050"/><rect x="-8" y="-49" width="16" height="12" rx="3" fill="#d98c87"/><rect x="-8" y="-40" width="16" height="7" fill="#a9b8aa"/>
  </g>;
}
function UnitScene({ scene, step, p }: { scene: Extract<SceneData, { kind: 'unit' }>; step: number; p: number }) {
  const each = scene.total / scene.count, count = step >= 3 ? scene.target : scene.count;
  const gap = Math.min(70, 430 / count), start = 305 - (count - 1) * gap / 2;
  return <>
    <text x="305" y="37" textAnchor="middle" fill="#758d77" fontSize="14">{step >= 3 ? '把一份复制成几份' : '每支铅笔的价格相同'}</text>
    <rect x="48" y="205" width="514" height="11" rx="5" fill="#deceb4"/>
    {Array.from({ length: count }, (_, i) => <g key={i} opacity={step === 3 && i > Math.floor(p * count * 1.4) ? .15 : 1}>
      <Pencil x={start + i * gap} y={133} faded={step === 1 && p < .45 && i > 0}/>
      {step >= 1 && <><rect x={start + i * gap - 24} y="226" width="48" height="27" rx="9" fill="#fffdf6" stroke="#e2ddcd"/><text x={start + i * gap} y="245" textAnchor="middle" fill="#987942" fontSize="14">{each} 元</text></>}
    </g>)}
    <path d={`M${start - 27} 77v-10h${(count - 1) * gap + 54}v10`} fill="none" stroke="#89a387" strokeWidth="1.6"/>
    <rect x="227" y="51" width="156" height="26" rx="13" fill="#f1f5e9"/>
    <text x="305" y="70" textAnchor="middle" fill="#4d795e" fontSize="15">{count} 支 · {step >= 3 ? count * each : scene.total} 元</text>
  </>;
}
function SumScene({ scene, step, p }: { scene: Extract<SceneData, { kind: 'sum' }>; step: number; p: number }) {
  const small = (scene.total - scene.difference) / 2, large = small + scene.difference;
  const base = small / large * 360, excess = scene.difference / large * 360;
  const removed = step === 3 && p > .3;
  return <>
    <text x="305" y="36" textAnchor="middle" fill="#758d77" fontSize="14">{step === 3 ? '去掉多出来的部分，两份就一样多' : '用线段表示两个人的弹珠数量'}</text>
    <text x="77" y="123" textAnchor="end" fill="#557b62" fontSize="16">{scene.names[0]}</text>
    <text x="77" y="218" textAnchor="end" fill="#9c7d40" fontSize="16">{scene.names[1]}</text>
    <rect x="101" y="97" width={base} height="38" rx="7" fill="#7aa387"/>
    <g transform={removed ? 'translate(0 -32)' : ''} opacity={removed ? .25 : 1} className="scene-object"><rect x={101 + base} y="97" width={excess} height="38" rx="7" fill="#b1c59e"/><path d={`M${101 + base} 97v38`} stroke="#f1f5e9" strokeWidth="2" strokeDasharray="4 3"/></g>
    <rect x="101" y="191" width={base} height="38" rx="7" fill="#e7bf76"/>
    {(step === 3 && p > .3 || step >= 4) && <><text x="234" y="122" textAnchor="middle" fill="white" fontSize="17">{step >= 4 ? `${small} ＋ ${scene.difference}` : small} 颗</text><text x="234" y="216" textAnchor="middle" fill="#735627" fontSize="17">{small} 颗</text></>}
    {step >= 1 && <><path d={`M${101 + base} 89v-10h${excess}v10`} fill="none" stroke="#8a9b74" strokeWidth="1.5"/><text x={101 + base + excess / 2} y="68" textAnchor="middle" fill="#6b865e" fontSize="14">多 {scene.difference} 颗</text></>}
    <path d={`M${120 + base + excess} 96h15v133h-15`} fill="none" stroke="#8f9e81" strokeWidth="1.5"/>
    <text x={147 + base + excess} y="160" textAnchor="start" fill="#65805e" fontSize="14">{removed ? '剩' : '共'}</text><text x={147 + base + excess} y="184" textAnchor="start" fill="#65805e" fontSize="16">{removed ? scene.total - scene.difference : scene.total}颗</text>
    {step >= 4 && <text x="305" y="278" textAnchor="middle" fill="#4d795e" fontSize="16">小米有 {large} 颗，小禾有 {small} 颗</text>}
  </>;
}
function CycleScene({ scene, step, p }: { scene: Extract<SceneData, { kind: 'cycle' }>; step: number; p: number }) {
  const k = scene.colors.length, q = Math.floor(scene.target / k), r = scene.target % k;
  const items = k * 3, gap = 37, start = 305 - (items - 1) * gap / 2;
  return <>
    <text x="305" y="37" textAnchor="middle" fill="#758d77" fontSize="14">{step >= 3 ? `${q} 个完整组，剩下 ${r} 颗` : '发现不断重复的颜色顺序'}</text>
    <path d={`M${start - 24} 115h${(items - 1) * gap + 48}`} stroke="#c7c9a6" strokeWidth="2" />
    {Array.from({ length: 3 }, (_, group) => <g key={group}>
      {step >= 1 && <rect x={start + group * k * gap - 18} y="85" width={k * gap - 3} height="63" rx="15" fill="none" stroke="#9bad86" strokeDasharray="5 4" opacity={step === 1 && group > Math.floor(p * 4) ? .1 : 1}/ >}
      {step >= 1 && <text x={start + (group * k + (k - 1) / 2) * gap} y="174" textAnchor="middle" fill="#7b8f6e" fontSize="12">第 {group + 1} 组</text>}
    </g>)}
    {Array.from({ length: items }, (_, i) => <g key={i}><circle cx={start + i * gap} cy="115" r="13" fill={palette[scene.colors[i % k]]}/><circle cx={start + i * gap - 4} cy="111" r="3" fill="#fff" opacity=".4"/><text x={start + i * gap} y="145" textAnchor="middle" fill="#879179" fontSize="10">{i + 1}</text></g>)}
    {step >= 3 && <>
      <text x="154" y="232" textAnchor="end" fill="#68815c" fontSize="14">接下来的一组</text>
      {scene.colors.map((color, i) => <g key={color} opacity={step === 3 && i >= r ? .24 : 1}>
        {step >= 4 && i === r - 1 && <circle cx={210 + i * 53} cy="229" r="24" fill="none" stroke="#688c62" strokeWidth="2"/>}
        <circle cx={210 + i * 53} cy="229" r="16" fill={palette[color]}/><text x={210 + i * 53} y="233" textAnchor="middle" fontSize="11" fill="white">{color}</text>
        <text x={210 + i * 53} y="265" textAnchor="middle" fontSize="12" fill="#6b7d62">第 {i + 1} 颗</text>
      </g>)}
      {step >= 4 && <text x="473" y="234" fill="#4d795e" fontSize="15">← 第 {scene.target} 颗</text>}
    </>}
  </>;
}
export default function Scene({ lesson, step, fraction }: { lesson: Lesson; step: number; fraction: number }) {
  const s = lesson.scene;
  if (s.kind === 'storyboard') return <StoryboardScene key={`${lesson.id}-${step}`} lesson={lesson} step={step} fraction={fraction}/>;
  return <svg className="lesson-scene" viewBox="0 0 610 300" role="img" aria-label={`${lesson.steps[step].title}：${lesson.steps[step].caption}`}>
    {s.kind === 'trees' ? <PlantScene scene={s} step={step} p={fraction}/> : s.kind === 'unit' ? <UnitScene scene={s} step={step} p={fraction}/> : s.kind === 'sum' ? <SumScene scene={s} step={step} p={fraction}/> : s.kind === 'cycle' ? <CycleScene scene={s} step={step} p={fraction}/> : <ExtraScenes scene={s} step={step} p={fraction}/>}
  </svg>;
}

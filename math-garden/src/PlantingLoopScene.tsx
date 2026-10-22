import type { StoryFrame } from './story-types';
import { loopLayout } from './planting-loop';
type Loop = Extract<StoryFrame, {kind:'planting-loop'}>;
const ink='#4f745b', gold='#c6953e';
export default function PlantingLoopScene({frame,p}:{frame:Loop;p:number}) {
  const layout=loopLayout(frame), progress=Math.max(0,Math.min(1,p));
  const {count,perimeter,nodes,corners,intervals}=layout;
  const planting=frame.phase==='plant', checking=frame.phase==='check', grown=checking ? count : planting ? Math.min(count,1+Math.floor(progress*count)) : 1;
  const active=Math.min(count-1,Math.floor(progress*count)), walker=layout.pointAt(progress*perimeter);
  const sideVisits=frame.sides.reduce((sum,side)=>sum+side/frame.spacing+1,0);
  return <>
    {intervals.map((interval,i) => <path key={i} d={interval.path} fill="none" stroke={frame.phase!=='outline' && i===active ? gold:'#b4c9a3'} strokeWidth={i===active?5:3}/>)}
    {frame.phase!=='outline' && intervals.map(({middle},i) => {
      const dx=middle[0]-305,dy=middle[1]-151,length=Math.hypot(dx,dy),x=middle[0]+dx/length*19,y=middle[1]+dy/length*19;
      return <g key={i}><circle cx={x} cy={y} r="8" fill="#fffdf4"/><text x={x} y={y+3.5} fontSize="10" fill={ink} textAnchor="middle">{i+1}</text></g>;
    })}
    {nodes.map(([x,y],i) => <g key={i} data-tree-position={i} data-planted={i<grown}>
      {i<grown ? <><rect x={x-2} y={y-1} width="4" height="12" rx="1" fill="#9d8057"/><circle cx={x} cy={y-5} r="9" fill={i===0?'#34775b':'#7da58a'}/></> : <circle cx={x} cy={y} r="4" fill="#f8faf1" stroke="#8ba37d" strokeDasharray="2 2"/>}
      {corners.includes(i) && (planting || checking) && <circle cx={x} cy={y-2} r="15" fill="none" stroke={gold} strokeWidth="2"/>}
    </g>)}
    <circle cx={walker[0]} cy={walker[1]} r="5" fill="#e4af48" stroke="white" strokeWidth="2"/>
    <text x="305" y="40" textAnchor="middle" fontSize="10" fill={ink}>起点＝终点 · 第一棵只算一次</text>
    <text x="72" y="106" fontSize="12" fill={ink}>一圈 {perimeter} 米</text>
    <text x="72" y="133" fontSize="12" fill={ink}>间距 {frame.spacing} 米</text>
    {frame.phase!=='outline' && <text x="72" y="160" fontSize="12" fill={ink}>{count} 个间隔</text>}
    {(planting || checking) && <text x="465" y="109" fontSize="14" fill={ink}>已种 {grown} 棵</text>}
    {frame.shape!=='circle' && (planting || checking) && <><text x="465" y="140" fontSize="11" fill={ink}>按边计 {sideVisits} 次</text><text x="465" y="164" fontSize="11" fill={ink}>减重复顶点 {corners.length} 次</text></>}
    <text x="305" y="273" textAnchor="middle" fontSize="12" fill={ink}>{checking ? `${count} 个间隔 ↔ ${count} 棵树，不再加1` : planting && progress>.96 ? '最后一段回到第一棵，不新增树' : frame.phase==='outline' ? '金色小点沿外边走，最后回到起点' : `沿边逐段看：第 ${active+1} / ${count} 个间隔`}</text>
  </>;
}

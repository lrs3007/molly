import type { StoryFrame } from './story-types';
import { sourceFigures, sourceFigureGroup } from './reference-figure-math';
type Frame=Extract<StoryFrame,{kind:'source-count'|'transfer-story'|'age-story'}>;
const ink='#4f745b',green='#7da58a',gold='#d3a951';
const clip=(n:number)=>Math.max(0,Math.min(1,n));
export default function ReferenceStoryScene({frame,previous,p,selected}:{frame:Frame;previous?:StoryFrame;p:number;selected?:number|null}) {
  const t=clip(p*1.7);
  if(frame.kind==='source-count') {
    const definition=sourceFigures[frame.figure],all=sourceFigureGroup(frame.figure,frame.group);
    const shapes=frame.size?all.filter(shape=>Math.max(...shape.map(p=>p[0]))-Math.min(...shape.map(p=>p[0]))===frame.size):all;
    const index=Math.min(shapes.length-1,selected??Math.floor(clip(p)*shapes.length)),shape=shapes[index];
    const points=definition.segments.flat(),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
    const minX=Math.min(...xs),minY=Math.min(...ys),width=Math.max(...xs)-minX,height=Math.max(...ys)-minY;
    const scale=Math.min(420/width,178/Math.max(1,height)),ox=305-width*scale/2,oy=54+(178-height*scale)/2;
    const point=([x,y]:number[])=>`${ox+(x-minX)*scale},${oy+(y-minY)*scale}`;
    return <><g data-source-figure={frame.figure}>
      {definition.segments.map(([a,b],i)=><polyline key={i} points={`${point(a)} ${point(b)}`} fill="none" stroke={ink} strokeWidth="2.4"/>)}
      {definition.points?.map((a,i)=><g key={i}><circle cx={ox+(a[0]-minX)*scale} cy={oy+(a[1]-minY)*scale} r="4" fill={ink}/><text x={ox+(a[0]-minX)*scale} y={oy+(a[1]-minY)*scale+20} fontSize="11" textAnchor="middle" fill={ink}>{String.fromCharCode(65+i)}</text></g>)}
      {definition.marks?.map((m,i)=><text key={i} x={ox+(m.point[0]-minX)*scale} y={oy+(m.point[1]-minY)*scale+5} textAnchor="middle" fontSize="18" fill={ink}>{m.text}</text>)}
      {shape&&frame.phase!=='outline'&&(shape.length===2?<polyline points={shape.map(point).join(' ')} fill="none" stroke={gold} strokeWidth="6" opacity=".8"/>:<polygon data-counted-shape={index+1} points={shape.map(point).join(' ')} fill={gold} fillOpacity=".3" stroke="#b8872c" strokeWidth="3"/>)}
      <text x="305" y="255" textAnchor="middle" fill={ink} fontSize="12">{frame.phase==='outline'?'按原图的线段连接关系重绘，缺线处保持缺线':`逐个看图：${index+1} / ${shapes.length}${frame.size?` · 边长${frame.size}格`:''}`}</text>
    </g></>;
  }
  if(frame.kind==='age-story') {
    const before=previous?.kind==='age-story'&&previous.names.join()===frame.names.join()?previous.ages:frame.ages;
    const max=Math.max(...before,...frame.ages,1),height=frame.names.length===3?45:65;
    return <g data-age-time={frame.time}>
      <text x="305" y="57" textAnchor="middle" fontSize="15" fill={ink}>{frame.time} · {frame.masked?'先比较时间与人数':`年龄和 ${frame.ages.reduce((a,b)=>a+b,0)}岁`}</text>
      {frame.names.map((name,i)=>{const age=before[i]+(frame.ages[i]-before[i])*t,y=78+i*height;return <g key={name}>
        <text x="120" y={y+23} textAnchor="end" fontSize="13" fill={ink}>{name}</text>
        <rect x="135" y={y} width={frame.masked?110:age/max*315} height="32" rx="5" fill={i%2?gold:green}/>
        <text x={frame.masked?258:148+age/max*315} y={y+23} fontSize="15" fill={ink}>{frame.masked?'？':`${Math.round(age*10)/10}岁`}</text>
      </g>;})}
      <path d="M155 242H458m-8-5 8 5-8 5" stroke={ink} fill="none" strokeWidth="2"/>
      <circle cx={155+303*t} cy="242" r="5" fill={gold}/>
      <text x="305" y="270" textAnchor="middle" fontSize="12" fill={ink}>{frame.rule??'同过1年，每个人都加1岁；年龄差保持不变'}</text>
    </g>;
  }
  const before=frame.from??(previous?.kind==='transfer-story'&&previous.names.join()===frame.names.join()?previous.values:frame.values);
  const pos=(side:number,index:number)=>[side===0?92+index%6*22:382+index%6*22,103+Math.floor(index/6)*21];
  const tokens:{from:number[];to:number[];color:string;out?:boolean}[]=[];
  for(let side=0;side<2;side++){
    const stable=Math.min(before[side],frame.values[side]),loss=before[side]-stable;
    const received=Math.max(0,frame.values[1-side]-before[1-side]);
    for(let i=0;i<before[side];i++){
      const from=pos(side,i),moved=i>=stable,to=moved?(i-stable<received?pos(1-side,before[1-side]+i-stable):[270+(i-stable)%6*13,226]):pos(side,i);
      tokens.push({from,to,color:side===0?green:gold,out:moved&&i-stable>=received});
    }
    if(loss===0&&before[1-side]>=frame.values[1-side]&&frame.values[side]>before[side]&&before[1-side]===frame.values[1-side]){
      for(let i=before[side];i<frame.values[side];i++)tokens.push({from:pos(side,i),to:pos(side,i),color:side===0?green:gold});
    }
  }
  return <g data-transfer-left={frame.values[0]} data-transfer-right={frame.values[1]}>
    {frame.names.map((name,side)=><g key={name}><text x={side===0?147:437} y="65" textAnchor="middle" fill={ink} fontSize="14">{name} · {Math.round(before[side]+(frame.values[side]-before[side])*t)}{frame.unit}</text><rect x={side===0?71:361} y="81" width="154" height="142" rx="15" fill="#fffdf7" stroke="#d4dfca"/></g>)}
    {tokens.map(({from,to,color,out},i)=><circle key={i} cx={from[0]+(to[0]-from[0])*t} cy={from[1]+(to[1]-from[1])*t} r="7" fill={color} opacity={out?1-t*.6:1} stroke="white"/>) }
    <text x="292" y="112" textAnchor="middle" fill={ink} fontSize="12">{frame.action??'两边一起看'}</text>
    <text x="305" y="250" textAnchor="middle" fill={ink} fontSize="14">本步目标：左边 − 右边 ＝ {frame.values[0]-frame.values[1]}{frame.unit}</text>
    <text x="305" y="272" textAnchor="middle" fill={ink} fontSize="11">{frame.illustrative?'用一组符合条件的数量演示，原题只需比较数量差':'移动的物品会从一盘进入另一盘；共同送出时移到盘外'}</text>
  </g>;
}

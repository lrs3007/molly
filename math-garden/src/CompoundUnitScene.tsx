import type {StoryFrame} from './story-types';
import {foodAmounts,productionAmounts} from './compound-unit-math';
const green='#7da58a',ink='#4f745b',gold='#d5a64d';
type Production=Extract<StoryFrame,{kind:'production-grid'}>;
type Food=Extract<StoryFrame,{kind:'food-supply'}>;

function ProductionGrid({frame,p}:{frame:Production;p:number}) {
  const amounts=productionAmounts(frame),target=['question','produce','check'].includes(frame.phase);
  const rows=target?frame.targetWorkers:frame.workers,columns=target?frame.targetHours:frame.hours;
  const cellW=Math.min(48,288/columns),cellH=Math.min(30,160/rows),start=290-columns*cellW/2;
  const filled=frame.phase==='produce'?Math.min(amounts.targetUnits,Math.floor(p*amounts.targetUnits)):frame.phase==='check'?amounts.targetUnits:0;
  const unit=frame.phase==='unit',known=frame.phase==='known',highlightRow=unit&&p<.45;
  const label=frame.machine?'机器':'工人';
  return <>
    <text x="290" y="50" textAnchor="middle" fontSize="12" fill={ink}>{rows}{frame.machine?'台机器':'名工人'} × {columns}小时 · 一格表示一{frame.machine?'台':'人'}工作1小时</text>
    {Array.from({length:columns},(_,col)=><text key={col} x={start+(col+.5)*cellW} y="72" textAnchor="middle" fontSize="10" fill={ink}>第{col+1}小时</text>)}
    {Array.from({length:rows},(_,row)=><g key={row}>
      <text x={start-10} y={82+(row+.5)*cellH+4} textAnchor="end" fontSize="10" fill={ink}>{label}{row+1}</text>
      {Array.from({length:columns},(_,col)=>{
        const index=row*columns+col,produced=target&&index<filled,selected=unit&&(highlightRow?row===0:row===0&&col===0);
        return <g key={col} data-production-cell={index} data-produced={produced}>
          <rect x={start+col*cellW+1} y={82+row*cellH+1} width={cellW-2} height={cellH-2} rx="3" fill={selected?gold:produced?green:known?'#dce9d2':'#fffdf5'} stroke={selected?'#bb8c36':'#c4d2b9'}/>
          <text x={start+(col+.5)*cellW} y={82+(row+.5)*cellH+4} textAnchor="middle" fontSize="11" fill={produced?'white':ink}>{known||frame.phase==='question'?'?':amounts.perHour}</text>
        </g>;
      })}
    </g>)}
    <text x="463" y="105" fontSize="13" fill={ink}>{known?`总共${frame.total}个`:`每格${amounts.perHour}个`}</text>
    {unit&&<><text x="463" y="136" fontSize="11" fill={ink}>先平均分给{frame.workers}{frame.machine?'台':'人'}</text><text x="463" y="160" fontSize="11" fill={ink}>再平均分到{frame.hours}小时</text></>}
    {frame.phase==='question'&&<text x="463" y="137" fontSize="12" fill={ink}>要算多少个小格？</text>}
    {(frame.phase==='produce'||frame.phase==='check')&&<><text x="463" y="136" fontSize="12" fill={ink}>已填 {filled}/{amounts.targetUnits} 格</text><text x="463" y="166" fontSize="14" fill={ink}>产量 {filled*amounts.perHour} 个</text></>}
    <text x="305" y="270" textAnchor="middle" fontSize="12" fill={ink}>{unit?`${frame.total}÷${frame.workers}＝${amounts.perWorker} → ${amounts.perWorker}÷${frame.hours}＝${amounts.perHour}`:frame.phase==='check'?`原来：${amounts.perHour}×${frame.workers}×${frame.hours}＝${frame.total}；现在：${amounts.perHour}×${rows}×${columns}＝${amounts.answer}`:target?`数量和时间都要考虑，每个小格的产量保持相同`:`先看全部产量，再找到一${frame.machine?'台机器':'名工人'}一小时的产量`}</text>
  </>;
}

function FoodSupply({frame,p}:{frame:Food;p:number}) {
  const a=foodAmounts(frame),regroup=frame.phase==='regroup',after=regroup||frame.phase==='check';
  const t=regroup?Math.min(1,p*1.8):1,cellW=Math.min(17,345/frame.days),cellH=35,start=126;
  const consumedDays=frame.phase==='stock'?0:frame.phase==='consume'?Math.floor(Math.min(1,p*1.8)*frame.eatenDays):frame.eatenDays;
  const used=consumedDays*frame.people,remaining=a.total-used,rows=after?a.newRows:a.oldRows;
  const boxes=after?Array.from({length:a.remainingPacks},(_,i)=>{
    const fromCol=i%(frame.days-frame.eatenDays)+frame.eatenDays,fromRow=Math.floor(i/(frame.days-frame.eatenDays));
    const toCol=i%a.answer,toRow=Math.floor(i/a.answer);
    return {x:start+(regroup?fromCol+(toCol-fromCol)*t:toCol)*cellW,y:96+(regroup?fromRow+(toRow-fromRow)*t:toRow)*cellH,used:false};
  }):Array.from({length:a.oldRows*frame.days},(_,i)=>({x:start+i%frame.days*cellW,y:96+Math.floor(i/frame.days)*cellH,used:i%frame.days<consumedDays}));
  return <>
    <text x="305" y="56" textAnchor="middle" fontSize="12" fill={ink}>{after?`换成${a.now}人一起吃`:`按原来${frame.people}人的分组看食物`} · 每列1天</text>
    <text x="305" y="77" textAnchor="middle" fontSize="11" fill={ink}>每小格＝{a.group}人吃1天的食物＝{a.group}份</text>
    {Array.from({length:rows},(_,row)=><text key={row} x="115" y={117+row*cellH} textAnchor="end" fontSize="10" fill={ink}>第{row+1}组 · {a.group}人</text>)}
    {boxes.map((box,i)=><rect key={i} data-food-pack={i} data-rations={a.group} data-consumed={box.used} x={box.x+1} y={box.y+1} width={cellW-2} height={cellH-2} rx="2" fill={box.used?gold:green} opacity={box.used?.38:1} stroke={box.used?'#c4ac79':'#e8f0e1'}/>)}
    {frame.phase==='stock'?<><text x="485" y="117" fontSize="12" fill={ink}>原来{a.total}份</text><text x="485" y="144" fontSize="11" fill={ink}>够{frame.people}人吃{frame.days}天</text></>:
      frame.phase==='check'?<><text x="485" y="108" fontSize="11" fill={ink}>以前吃{a.used}份</text><text x="485" y="135" fontSize="11" fill={ink}>以后吃{a.remaining}份</text><text x="485" y="162" fontSize="12" fill={ink}>合计{a.total}份</text></>:
      <><text x="485" y="108" fontSize="11" fill={ink}>{after||frame.phase==='question'?`现在${a.now}人`:`已吃${consumedDays}天`}</text><text x="485" y="135" fontSize="12" fill={ink}>剩余{remaining}份</text><text x="485" y="162" fontSize="11" fill={ink}>{after?`每天${a.now}份`:`已吃掉${used}份`}</text></>}
    <text x="305" y="232" textAnchor="middle" fontSize="12" fill={ink}>{after?`重新分配：${a.newRows}组 × ${a.answer}天 × 每格${a.group}份＝${a.remaining}份`:`原定${frame.days}天：金色已吃${consumedDays}天，绿色还剩${frame.days-consumedDays}天`}</text>
    <text x="305" y="269" textAnchor="middle" fontSize="13" fill={ink}>{after?`${a.remaining}份 ÷ 每天${a.now}份＝还能吃${a.answer}天`:frame.phase==='question'?`新来${frame.newcomers}人，剩余食物没有增加`:frame.phase==='stock'?`${frame.people}人 × ${frame.days}天＝${a.total}份`:`先扣掉已吃的食物，再考虑新人数`}</text>
  </>;
}

export default function CompoundUnitScene({frame,p}:{frame:Production|Food;p:number}) {
  return frame.kind==='production-grid'?<ProductionGrid frame={frame} p={p}/>:<FoodSupply frame={frame} p={p}/>;
}

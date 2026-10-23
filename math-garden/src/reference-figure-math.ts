import { trianglesFromSegments, type Point, type Segment } from './figure-math.ts';

export interface SourceFigure {
  kind: 'segments' | 'rectangles' | 'squares' | 'triangles' | 'animals' | 'star';
  segments: Segment[];
  marks?: { point: Point; text: string }[];
  points?: Point[];
}
const line = (x1: number, y1: number, x2: number, y2: number): Segment => [[x1,y1],[x2,y2]];
const grid = (columns: number, rows: number): Segment[] => [
  ...Array.from({length:columns+1},(_,x)=>line(x,0,x,rows)),
  ...Array.from({length:rows+1},(_,y)=>line(0,y,columns,y)),
];
const fan = (layers: number): Segment[] => [
  ...[0,1,2,3,4].map(x=>line(2,0,x,4)),
  ...Array.from({length:layers},(_,i)=>{const y=4*(i+1)/layers;return line(2-y/2,y,2+y/2,y);}),
];
export const sourceFigures: Record<string, SourceFigure> = {
  segments: {kind:'segments',segments:[line(0,1,3,1),line(3,1,3.5,0)],points:[[0,1],[1,1],[2,1],[3,1],[3.5,0]]},
  strip: {kind:'rectangles',segments:grid(5,1)},
  fan: {kind:'triangles',segments:fan(1)},
  missingRect: {kind:'rectangles',segments:[
    ...[0,1,2,4,5].map(x=>line(x,0,x,3)),line(3,0,3,1),
    ...[0,1,2,3].map(y=>line(0,y,5,y)),
  ]},
  missingSquare: {kind:'squares',segments:[
    ...[0,1,2,3,4].map(x=>line(x,0,x,4)),
    ...[0,2,4].map(y=>line(0,y,4,y)),
    ...[1,3].flatMap(y=>[line(0,y,1,y),line(3,y,4,y)]),
  ]},
  layeredTriangle: {kind:'triangles',segments:fan(3)},
  animals: {kind:'animals',segments:grid(5,5),marks:[{point:[4.5,1.5],text:'马'},{point:[2.5,2.5],text:'牛'},{point:[.5,3.5],text:'马'}]},
  nestedRect: {kind:'rectangles',segments:[
    ...[0,2,4,6].map(x=>line(x,0,x,4)),
    ...[0,2,4].map(y=>line(0,y,6,y)),
    line(1,1,5,1),line(1,3,5,3),line(1,1,1,3),line(5,1,5,3),
  ]},
  splitTriangle: {kind:'triangles',segments:[
    line(-3,4,0,0),line(0,0,4,4),line(-3,4,4,4),
    ...[[-2,8/3],[-1,4/3],[0,0],[4/3,4/3],[8/3,8/3]].map(p=>line(0,4,p[0],p[1])),
    line(-2,8/3,-2,4),
  ]},
  star: {kind:'star',segments:[
    line(1,0,6,0),line(0,1,6,1),line(0,2,6,2),line(0,3,6,3),line(0,4,5,4),
    line(0,1,0,4),...[1,2,3,4,5].map(x=>line(x,0,x,4)),line(6,0,6,3),
  ],marks:[{point:[3.5,1.5],text:'★'}]},
  brokenSquare: {kind:'squares',segments:[
    ...[0,1,2,3,4].map(y=>line(0,y,4,y)),
    ...[0,2,4].map(x=>line(x,0,x,4)),line(1,1,1,4),line(3,0,3,3),
  ]},
  partialRect: {kind:'rectangles',segments:[
    ...[0,1,4,6,7].map(x=>line(x,0,x,3)),line(4.5,1,4.5,3),
    ...[0,1,2,3].map(y=>line(0,y,7,y)),
  ]},
};

// Edges must be fully drawn, including when several collinear pieces join.
export function drawnEdge(a: Point, b: Point, segments: Segment[]) {
  const dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy;
  if (!length) return false;
  const cross=(p:Point)=>Math.abs((p[0]-a[0])*dy-(p[1]-a[1])*dx)<1e-7;
  const position=(p:Point)=>((p[0]-a[0])*dx+(p[1]-a[1])*dy)/length;
  const intervals=segments.filter(([p,q])=>cross(p)&&cross(q)).map(([p,q])=>[Math.min(position(p),position(q)),Math.max(position(p),position(q))]).sort((x,y)=>x[0]-y[0]);
  let end=0;
  for(const [lo,hi] of intervals){if(lo>end+1e-7)break;if(hi>=end)end=hi;if(end>=1-1e-7)return true;}
  return false;
}
const figureCache=new Map<string,Point[][]>();
export function sourceShapes(id:string):Point[][] {
  if(figureCache.has(id))return figureCache.get(id)!;
  const f=sourceFigures[id];
  let shapes:Point[][]=[];
  if(f.kind==='triangles') shapes=trianglesFromSegments(f.segments);
  else if(f.kind==='segments') {
    const points=f.points!;
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(drawnEdge(points[i],points[j],f.segments))shapes.push([points[i],points[j]]);
  }else{
    const xs=[...new Set(f.segments.flatMap(s=>s.map(p=>p[0])))].sort((a,b)=>a-b),ys=[...new Set(f.segments.flatMap(s=>s.map(p=>p[1])))].sort((a,b)=>a-b);
    for(let l=0;l<xs.length;l++)for(let r=l+1;r<xs.length;r++)for(let t=0;t<ys.length;t++)for(let b=t+1;b<ys.length;b++){
      if((f.kind==='squares'||f.kind==='star')&&Math.abs(xs[r]-xs[l]-(ys[b]-ys[t]))>1e-7)continue;
      const shape:Point[]=[[xs[l],ys[t]],[xs[r],ys[t]],[xs[r],ys[b]],[xs[l],ys[b]]];
      if(!shape.every((p,i)=>drawnEdge(p,shape[(i+1)%4],f.segments)))continue;
      const inside=(p:Point)=>p[0]>xs[l]&&p[0]<xs[r]&&p[1]>ys[t]&&p[1]<ys[b];
      if(f.kind==='animals'&&(f.marks!.filter(m=>m.text==='马'&&inside(m.point)).length!==1||!f.marks!.some(m=>m.text==='牛'&&inside(m.point))))continue;
      if(f.kind==='star'&&!inside(f.marks![0].point))continue;
      shapes.push(shape);
    }
  }
  const area=(s:Point[])=>s.length===2?Math.hypot(s[0][0]-s[1][0],s[0][1]-s[1][1]):Math.abs(s.reduce((n,p,i)=>n+p[0]*s[(i+1)%s.length][1]-p[1]*s[(i+1)%s.length][0],0))/2;
  shapes.sort((a,b)=>area(a)-area(b));figureCache.set(id,shapes);return shapes;
}
export function sourceFigureGroup(id:string,group?:string) {
  const all=sourceShapes(id);
  if(!group)return all;
  const has=(s:Point[],x:number,y?:number)=>s.some(p=>Math.abs(p[0]-x)<1e-7&&(y===undefined||Math.abs(p[1]-y)<1e-7));
  if(id==='segments')return all.filter(s=>group==='straight'?s.every(p=>p[1]===1):!s.every(p=>p[1]===1));
  if(id==='missingRect')return all.filter(s=>group==='short'?has(s,3):!has(s,3));
  if(id==='partialRect')return all.filter(s=>group==='short'?has(s,4.5):!has(s,4.5));
  if(id==='layeredTriangle')return all.filter(s=>Math.abs(Math.max(...s.map(p=>p[1]))-4*Number(group)/3)<1e-7);
  if(id==='splitTriangle')return all.filter(s=>group==='extra'?has(s,-2,4):!has(s,-2,4));
  if(id==='animals')return all.filter(s=>{const x=group==='left'?.5:4.5,y=group==='left'?3.5:1.5;return Math.min(...s.map(p=>p[0]))<x&&Math.max(...s.map(p=>p[0]))>x&&Math.min(...s.map(p=>p[1]))<y&&Math.max(...s.map(p=>p[1]))>y;});
  if(id==='nestedRect')return all.filter(s=>{
    const outer=s.every(p=>[0,2,4,6].includes(p[0])&&[0,2,4].includes(p[1]));
    const inner=s.every(p=>[1,2,4,5].includes(p[0])&&[1,2,3].includes(p[1]));
    return group==='outer'?outer:group==='inner'?inner:!outer&&!inner;
  });
  return all;
}

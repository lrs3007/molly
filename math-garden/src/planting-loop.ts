import type { StoryFrame } from './story-types.ts';
type Loop = Extract<StoryFrame, { kind: 'planting-loop' }>;
export type LoopPoint = [number, number];

// Distances are measured along the boundary, including the closing interval.
export function loopLayout({shape, sides, spacing}: Pick<Loop,'shape'|'sides'|'spacing'>) {
  const perimeter = sides.reduce((a,b) => a+b,0), count = perimeter/spacing;
  if (!sides.length || sides.some(s => !Number.isFinite(s) || s<=0) || !Number.isFinite(spacing) || spacing<=0 || !Number.isInteger(count) || count<2) throw new Error('封闭路线须能按正间距整分。');
  if (shape !== 'circle' && sides.some(s => !Number.isInteger(s/spacing))) throw new Error('要求顶点种树时，每边须能按间距整分。');
  const vertices: LoopPoint[] = shape === 'triangle' ? [[305,51],[305+Math.sqrt(3)*61,234],[305-Math.sqrt(3)*61,234]] : [[185,71],[425,71],[425,231],[185,231]];
  const pointAt = (distance: number): LoopPoint => {
    let remaining = ((distance%perimeter)+perimeter)%perimeter;
    if (shape === 'circle') {
      const angle = remaining/perimeter*Math.PI*2-Math.PI/2;
      return [305+94*Math.cos(angle),151+94*Math.sin(angle)];
    }
    for (let i=0; i<sides.length; i++) {
      if (remaining<=sides[i]+1e-8) {
        const a=vertices[i], b=vertices[(i+1)%vertices.length], t=remaining/sides[i];
        return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
      }
      remaining-=sides[i];
    }
    return vertices[0];
  };
  const nodes = Array.from({length:count},(_,i) => pointAt(i*spacing));
  let offset=0;
  const corners = shape === 'circle' ? [] : sides.map(side => { const index=offset/spacing; offset+=side; return index; });
  const intervals = nodes.map((from,i) => {
    const to=pointAt((i+1)*spacing), middle=pointAt((i+.5)*spacing);
    const path = shape === 'circle' ? `M${from}A94 94 0 ${spacing/perimeter>.5?1:0} 1 ${to}` : `M${from}L${to}`;
    return {from,to,middle,path};
  });
  return {perimeter,count,nodes,corners,intervals,pointAt};
}

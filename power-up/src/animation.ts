export const mapRoute:readonly (readonly [number,number])[]=[[113,190],[113,115],[268,115],[268,54],[368,54]];
export function pointAlongRoute(fraction:number,points=mapRoute):[number,number]{
 if(!points.length)return [0,0];
 const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
 let remaining=Math.max(0,Math.min(1,fraction))*lengths.reduce((a,b)=>a+b,0);
 for(let i=0;i<lengths.length;i++){if(remaining<=lengths[i]){const t=lengths[i]?remaining/lengths[i]:0;return [points[i][0]+(points[i+1][0]-points[i][0])*t,points[i][1]+(points[i+1][1]-points[i][1])*t];}remaining-=lengths[i];}
 return [...points[points.length-1]];
}

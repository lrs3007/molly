import type {StoryFrame} from './story-types.ts';
type Production=Extract<StoryFrame,{kind:'production-grid'}>;
type Food=Extract<StoryFrame,{kind:'food-supply'}>;
export function productionAmounts(q:Pick<Production,'workers'|'hours'|'total'|'targetWorkers'|'targetHours'>) {
  const perWorker=q.total/q.workers,perHour=perWorker/q.hours,targetUnits=q.targetWorkers*q.targetHours;
  return {perWorker,perHour,targetUnits,answer:perHour*targetUnits};
}
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
export function foodAmounts(q:Pick<Food,'people'|'days'|'eatenDays'|'newcomers'>) {
  const total=q.people*q.days,used=q.people*q.eatenDays,remaining=total-used,now=q.people+q.newcomers,group=gcd(q.people,now);
  return {total,used,remaining,now,answer:remaining/now,group,oldRows:q.people/group,newRows:now/group,remainingPacks:remaining/group};
}

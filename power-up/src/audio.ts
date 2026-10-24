import playback from './audio-playback.json' with { type: 'json' };
import type { AudioEntry, Language, Segment } from './types.ts';
export const catalog={schema:1,entries:playback as Record<string,Pick<AudioEntry,'src'|'duration'>>};
export function audioKey(lang:Language,text:string){return `${lang}:${text}`;}
export function resolveAudio(segment:Pick<Segment,'lang'|'text'>){return catalog.entries[audioKey(segment.lang,segment.text)];}
export function enrichedSegments(segments:Segment[]){return segments.map(s=>({...s,...resolveAudio(s)}));}
export function segmentAtTime(segments:Segment[],time:number){
 let offset=0;
 for(let i=0;i<segments.length;i++){const duration=segments[i].duration??0;if(time<offset+duration||i===segments.length-1)return {index:i,time:Math.max(0,Math.min(duration,time-offset))};offset+=duration;}
 return {index:0,time:0};
}

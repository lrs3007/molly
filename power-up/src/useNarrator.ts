import {useEffect,useState,useSyncExternalStore}from 'react';
import {enrichedSegments}from './audio.ts';
import {PlaybackEngine}from './playback-engine.ts';
import type {Level,ReadingMode}from './types.ts';
export function useNarrator(level:Level,readingMode:ReadingMode){
 const [engine]=useState(()=>new PlaybackEngine({level,readingMode,createAudio:()=>new Audio(),frame:fn=>requestAnimationFrame(fn),cancelFrame:id=>cancelAnimationFrame(id),resolve:enrichedSegments}));
 const state=useSyncExternalStore(engine.subscribe,engine.snapshot,engine.snapshot);
 useEffect(()=>{engine.setLevel(level);engine.setReadingMode(readingMode);},[engine,level,readingMode]);
 useEffect(()=>()=>engine.dispose(),[engine]);
 const total=state.queue.reduce((n,s)=>n+(s.duration??0),0),time=state.queue.slice(0,state.index).reduce((n,s)=>n+(s.duration??0),0)+state.elapsed,current=state.queue[state.index];
 return {...state,current,total,time,fraction:current?.duration?Math.min(1,state.elapsed/current.duration):0,play:engine.play,pause:engine.pause,resume:engine.resume,stop:engine.stop,seek:engine.seek,changeRate:engine.changeRate,changeGap:engine.changeGap,skipWait:engine.skipWait,toggleLoop:engine.toggleLoop};
}

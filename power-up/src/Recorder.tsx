import {useEffect,useRef,useState}from 'react';
import Icon from './Icons';
export default function Recorder({onStart,narrationPlaying=false}:{onStart:()=>void;narrationPlaying?:boolean}){
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),urlRef=useRef(''),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),alive=useRef(true),player=useRef<HTMLAudioElement|null>(null);
 const [state,setState]=useState<'idle'|'requesting'|'recording'|'ready'>('idle'),[url,setUrl]=useState(''),[error,setError]=useState('');
 const stop=()=>{if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());clearTimeout(timer.current);};
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop();if(urlRef.current)URL.revokeObjectURL(urlRef.current);};},[]);
 useEffect(()=>{if(narrationPlaying){player.current?.pause();stop();}},[narrationPlaying]);
 const start=async()=>{
  setError('');if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError('这个浏览器暂不支持录音，可以直接跟着示范开口练习。');return;}
  onStart();setState('requesting');
  try{
   const s=await navigator.mediaDevices.getUserMedia({audio:true});if(!alive.current){s.getTracks().forEach(t=>t.stop());return;}stream.current=s;
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(m=>MediaRecorder.isTypeSupported(m));
   const r=new MediaRecorder(s,mime?{mimeType:mime}:undefined);recorder.current=r;const chunks:BlobPart[]=[];
   r.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};r.onstop=()=>{s.getTracks().forEach(t=>t.stop());if(!alive.current)return;const blob=new Blob(chunks,{type:r.mimeType});if(blob.size<128){setState('idle');setError('录音太短，试着说完一句话后再结束。');return;}if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=URL.createObjectURL(blob);setUrl(urlRef.current);setState('ready');};
   r.start();setState('recording');timer.current=setTimeout(stop,30000);
  }catch{stream.current?.getTracks().forEach(t=>t.stop());setState('idle');setError('没有获得麦克风权限。可以在浏览器设置中允许麦克风后重试。');}
 };
 return <div className="recorder"><button className={`record-button ${state==='recording'?'is-recording':''}`} disabled={state==='requesting'} onClick={()=>state==='recording'?stop():void start()}><Icon name={state==='recording'?'stop':'mic'} size={17}/>{state==='recording'?'结束录音':state==='requesting'?'等待麦克风…':url?'再录一次':'录下我的声音'}</button>{url&&<audio ref={player} aria-label="听听我的录音" controls src={url} onPlay={onStart}/>}<small>{state==='recording'?'正在录音，最长 30 秒':'录音只在当前页面回听，关闭后自动清除。'}</small>{error&&<p className="inline-error" role="status">{error}</p>}</div>;
}

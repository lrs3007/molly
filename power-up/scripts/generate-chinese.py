"""Generate Chinese lessons with the same local Qwen3 Serena teacher as math-garden.
Resume-safe, text-addressed audio; never overwrites the English catalog entries.
"""
import os, sys, json, time, hashlib, argparse
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
MATH = ROOT.parent / 'math-garden'
os.environ.setdefault('HF_HOME', str(MATH / '.cache/huggingface'))
os.environ.setdefault('XDG_CACHE_HOME', str(ROOT / '.cache'))
os.environ.setdefault('HF_HUB_DISABLE_TELEMETRY', '1')
os.environ.setdefault('TOKENIZERS_PARALLELISM', 'false')

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--sample',action='store_true')
    parser.add_argument('--limit',type=int)
    args=parser.parse_args()
    out=ROOT/'public/audio/zh-CN';out.mkdir(parents=True,exist_ok=True)
    catalog_path=ROOT/'src/audio-zh-catalog.json'
    if args.sample:
        text='来，咱们一起走进新教室。先看看蜡笔在哪里，再听英文老师怎么说。听到重点的词，可以暂停，自己试着说一遍。'
        jobs=[dict(id='teacher-sample',key='zh-CN:'+text,text=text,seed=7200,signature='sample-v1')]
    else:
        jobs=[j for j in json.loads((ROOT/'.audio-output/plan.json').read_text())['jobs'] if j['lang']=='zh-CN']
    pending=[]
    for job in jobs:
        entry=json.loads(catalog_path.read_text())['entries'].get(job['key'])
        if entry and entry.get('signature')==job['signature']:
            file=ROOT/'public'/entry['src'].lstrip('/')
            if file.exists() and hashlib.sha256(file.read_bytes()).hexdigest()==entry['sha256']:
                continue
        pending.append(job)
    if args.limit:pending=pending[:args.limit]
    if not pending:
        print('中文配音已经齐全。',flush=True);return
    import numpy as np
    import soundfile as sf
    import mlx.core as mx
    from mlx_audio.tts.utils import load_model
    model_path=MATH/'.cache/models/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit'
    source=json.loads((model_path/'model-source.json').read_text())
    if source.get('revision')!='41d3337e8b7f2843a75841595fc14e4b9a7a4b96':raise ValueError('Model revision mismatch')
    print(f'加载数学课堂的本地 Serena 模型；待生成 {len(pending)} 段。',flush=True)
    model=load_model(str(model_path))
    for i,job in enumerate(pending,1):
        start=time.monotonic();print(f'[{i}/{len(pending)}] {job["text"][:25]}',flush=True)
        for attempt in range(3):
            mx.random.seed(job['seed']+attempt)
            results=list(model.generate_custom_voice(text=job['text'],speaker='serena',language='Chinese',instruct='用温暖、亲切、耐心的成年女老师声音，给小学生讲英语。使用清晰的标准普通话，语速稍慢，自然连贯。像和孩子面对面交流，带孩子观察画面，发现规律。只朗读讲稿，不添加内容。',temperature=.8,top_k=50,top_p=1,repetition_penalty=1.05,max_tokens=1800))
            if not results:continue
            rate=int(results[0].sample_rate)
            audio=np.concatenate([np.asarray(r.audio).reshape(-1) for r in results]).astype(np.float32)
            duration=audio.size/rate
            if np.isfinite(audio).all() and 1<duration<max(35,len(job['text'])/1.4) and float(np.max(np.abs(audio)))>.005:break
        else:raise ValueError(f'Invalid audio: {job["id"]}')
        peak=float(np.max(np.abs(audio)))
        if peak>.97:audio*=.94/peak
        audio=np.concatenate([audio,np.zeros(round(rate*.32),dtype=np.float32)])
        target=out/(job['id']+'.wav');temporary=out/(job['id']+'.tmp.wav')
        sf.write(temporary,audio,rate,subtype='PCM_16');temporary.replace(target)
        catalog=json.loads(catalog_path.read_text())
        catalog['entries'][job['key']]=dict(src='/audio/zh-CN/'+target.name,text=job['text'],lang='zh-CN',voice='Serena · 普通话老师',provider='qwen3-tts',duration=audio.size/rate,signature=job['signature'],sha256=hashlib.sha256(target.read_bytes()).hexdigest())
        temporary_catalog=catalog_path.with_suffix('.json.zh.tmp');temporary_catalog.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n');temporary_catalog.replace(catalog_path)
        print(f'完成 {i}/{len(pending)} · {audio.size/rate:.1f} 秒音频 · 生成用时 {time.monotonic()-start:.1f} 秒',flush=True)
        mx.clear_cache()
    print('中文配音完成。',flush=True)

if __name__=='__main__':main()

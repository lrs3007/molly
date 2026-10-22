"""Generate reusable Qwen3-TTS teaching audio locally on Apple Silicon.

Usage: npm run audio:plan; .venv-tts/bin/python scripts/generate-qwen-audio.py --sample
No cloud speech API is used. Model downloads are cached inside the project.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
from pathlib import Path
import shutil
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
os.environ.setdefault("HF_HOME", str(ROOT / ".cache" / "huggingface"))
os.environ.setdefault("XDG_CACHE_HOME", str(ROOT / ".cache"))
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def write_json_atomic(path: Path, data: dict) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(path)


def render_review(output: Path, jobs: list, entries: dict, label: str) -> None:
    cards = []
    for job in jobs:
        entry = entries.get(job["id"])
        if not entry:
            continue
        filename = Path(entry["src"]).name
        cards.append(f'<article><h2>{html.escape(job["title"])}</h2><audio controls preload="metadata" src="{html.escape(filename)}"></audio><p>{html.escape(entry["text"])}</p><small>{entry["duration"]:.1f} 秒 · {html.escape(label)}</small></article>')
    page = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Qwen3-TTS 数学讲题试听</title><style>body{max-width:860px;margin:40px auto;padding:0 22px;font-family:system-ui;background:#f6f7f0;color:#304c36}article{padding:24px;background:white;border:1px solid #dce6d3;border-radius:14px;margin:20px 0}h1{font-size:26px}h2{font-size:18px}p{line-height:2}audio{width:100%}small{color:#849875}</style><h1>Qwen3-TTS 数学讲题试听</h1><p>Serena · 标准普通话 · 温暖耐心的小学数学老师</p>' + ''.join(cards) + '</html>'
    (output / "index.html").write_text(page)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--sample", action="store_true", help="Generate two planting lesson steps")
    mode.add_argument("--all", action="store_true", help="Generate or resume every lesson step")
    parser.add_argument("--plan", type=Path, default=ROOT / ".audio-output/qwen-plan.json")
    args = parser.parse_args()
    plan = json.loads(args.plan.read_text())
    if plan.get("schema") != 1 or plan.get("provider") != "qwen3-tts" or not plan.get("jobs") or len({j['id'] for j in plan['jobs']}) != len(plan['jobs']):
        raise ValueError("请先运行 npm run audio:plan，导出完整课程讲稿。")
    jobs = plan["jobs"]
    selected = [j for j in jobs if j["id"] in {"trees-1-1", "trees-1-4"}] if args.sample else jobs
    identity = {**plan, 'jobs': [{**j, **({'reuse': {k: v for k, v in j['reuse'].items() if k != 'src'}} if j.get('reuse') else {})} for j in jobs]}
    pack_signature = sha256(json.dumps(identity, ensure_ascii=False, sort_keys=True).encode())[:12]
    output = ROOT / ".audio-output" / f"qwen3-serena-{pack_signature}"
    output.mkdir(parents=True, exist_ok=True)
    checkpoint = output / "checkpoint.json"
    entries = json.loads(checkpoint.read_text()).get("entries", {}) if checkpoint.exists() else {}
    active_path = ROOT / 'src/audio-catalog.json'
    active = json.loads(active_path.read_text()) if active_path.exists() else {}
    for job in selected:
        if not job.get('reuse') or job['id'] in entries:
            continue
        entry = job['reuse']
        source = (ROOT / 'public' / entry['src'].lstrip('/')).resolve()
        if not source.is_relative_to((ROOT / 'public/audio').resolve()) or not source.is_file() or sha256(source.read_bytes()) != entry['sha256']:
            raise ValueError(f"历史配音{job['id']}缺失或损坏，请先恢复对应资源。")
        filename = f"{job['id']}.{entry['sha256'][:12]}.wav"
        shutil.copyfile(source, output / filename)
        entries[job['id']] = {**entry, 'src': f'/audio/qwen3/{pack_signature}/{filename}'}
    if all(active.get(key) == plan.get(key) for key in ('provider', 'model', 'modelRevision', 'speaker')):
        for job in selected:
            if job['id'] in entries:
                continue
            entry = active.get('entries', {}).get(job['id'])
            if not entry or entry.get('signature') != job['signature'] or entry.get('text') != job['text']:
                continue
            source = (ROOT / 'public' / entry['src'].lstrip('/')).resolve()
            if not source.is_relative_to((ROOT / 'public/audio').resolve()) or not source.is_file() or sha256(source.read_bytes()) != entry['sha256']:
                continue
            filename = source.name
            shutil.copyfile(source, output / filename)
            entries[job['id']] = {**entry, 'src': f'/audio/qwen3/{pack_signature}/{filename}'}
    metadata = {"schema": 1, "provider": "qwen3-tts", "model": plan["model"], "modelRevision": plan["modelRevision"], "speaker": plan["speaker"], "voiceLabel": plan["voiceLabel"], "entries": entries}
    write_json_atomic(checkpoint, metadata)

    import numpy as np
    import soundfile as sf

    pending = []
    for job in selected:
        entry = entries.get(job["id"])
        if entry and entry.get("signature") == job["signature"]:
            file = output / Path(entry["src"]).name
            if file.exists() and sha256(file.read_bytes()) == entry["sha256"]:
                print(f'复用 {job["id"]}: {entry["duration"]:.1f}秒', flush=True)
                continue
        pending.append(job)
        if job.get('reuse'):
            raise ValueError(f"历史配音{job['id']}的断点文件损坏，请修复后重试。")
    if pending:
        import mlx.core as mx
        from mlx_audio.tts.utils import load_model
        print(f'正在加载本地模型 {plan["model"]}；首次编译可能稍慢。', flush=True)
        local_model = ROOT / '.cache/models' / plan['model'].split('/')[-1]
        source_path = local_model / 'model-source.json'
        if not source_path.exists() or json.loads(source_path.read_text()).get('revision') != plan['modelRevision']:
            raise ValueError('请先运行 scripts/download-qwen-model.py，下载固定版本的本地模型。')
        model = load_model(str(local_model))
        for number, job in enumerate(pending, 1):
            started = time.monotonic()
            print(f'[{number}/{len(pending)}] 生成 {job["id"]} · {job["title"]}', flush=True)
            mx.random.seed(job["seed"])
            results = list(model.generate_custom_voice(
                text=job["text"], speaker=job["speaker"], language=job["language"],
                instruct=job["instruct"], **job['generation'],
            ))
            if not results:
                raise ValueError(f'{job["id"]}没有生成音频。')
            rates = {int(result.sample_rate) for result in results}
            if len(rates) != 1:
                raise ValueError("同一步骤返回了不同的采样率。")
            rate = rates.pop()
            waveform = np.concatenate([np.asarray(result.audio).reshape(-1) for result in results]).astype(np.float32)
            duration = waveform.size / rate
            if not np.isfinite(waveform).all() or duration < 1 or duration > max(30, len(job["text"]) / 1.5 + 12):
                raise ValueError(f'{job["id"]}的波形或时长异常（{duration:.1f}秒）。')
            peak = float(np.max(np.abs(waveform)))
            if peak < 0.005:
                raise ValueError(f'{job["id"]}仅包含静音。')
            if peak > .97:
                waveform *= .94 / peak
            waveform = np.concatenate([waveform, np.zeros(round(rate * job["tailSilenceMs"] / 1000), dtype=np.float32)])
            duration = waveform.size / rate
            temp = output / f'{job["id"]}.tmp.wav'
            sf.write(temp, waveform, rate, subtype="PCM_16")
            digest = sha256(temp.read_bytes())
            filename = f'{job["id"]}.{digest[:12]}.wav'
            temp.replace(output / filename)
            entries[job["id"]] = {"src": f'/audio/qwen3/{pack_signature}/{filename}', "text": job["text"], "duration": duration, "signature": job["signature"], "sha256": digest, "sampleRate": rate}
            write_json_atomic(checkpoint, metadata)
            render_review(output, jobs, entries, plan["voiceLabel"])
            print(f'完成 {job["id"]}: {duration:.1f}秒音频，耗时{time.monotonic()-started:.1f}秒', flush=True)
            mx.clear_cache()

    render_review(output, jobs, entries, plan["voiceLabel"])
    if len(entries) == len(jobs) and all(entries.get(j["id"], {}).get("signature") == j["signature"] for j in jobs):
        write_json_atomic(output / "catalog.json", metadata)
        print(f'完整音频包：{output}\n安装：npm run audio:install -- {output}', flush=True)
    else:
        print('样片已生成；继续运行 --all 可复用已有结果并完成课程。', flush=True)
    print(f'试听：{output / "index.html"}', flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f'Qwen3-TTS生成失败：{error}', file=sys.stderr)
        sys.exit(1)

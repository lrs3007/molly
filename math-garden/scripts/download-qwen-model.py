"""Download the selected public Qwen MLX weights, with resumable files and SHA256 checks."""
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import time
import threading
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
plan = json.loads((ROOT / '.audio-output/qwen-plan.json').read_text())
repo = plan['model']
if repo != 'mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit':
    raise ValueError('Unexpected model repository.')
target = ROOT / '.cache/models' / repo.split('/')[-1]
target.mkdir(parents=True, exist_ok=True)
with urlopen(f'https://huggingface.co/api/models/{repo}/revision/{plan["modelRevision"]}?blobs=true', timeout=60) as response:
    info = json.load(response)
revision = info['sha']
if revision != plan['modelRevision']: raise ValueError('Unexpected model revision.')
(target / 'download-manifest.json').write_text(json.dumps(info, ensure_ascii=False))

def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(8*1024*1024), b''): h.update(chunk)
    return h.hexdigest()

def parallel_file(entry, destination, expected, size):
    name = entry['rfilename']
    segment_size = 16*1024*1024
    segments = (size + segment_size-1)//segment_size
    parts = destination.parent / (destination.name + '.parts')
    parts.mkdir(exist_ok=True)
    # Keep useful bytes from the earlier sequential download.
    old = destination.with_suffix(destination.suffix + '.part')
    if old.exists():
        with old.open('rb') as existing:
            for index in range(segments):
                block = existing.read(segment_size)
                if not block: break
                piece = parts / str(index)
                if not piece.exists() or piece.stat().st_size < len(block): piece.write_bytes(block)
    mutex = threading.Lock()
    completed = [sum(min(p.stat().st_size, segment_size) for p in parts.iterdir() if p.name.isdigit())]
    started = time.monotonic()
    def segment(index):
        start, end = index*segment_size, min(size, (index+1)*segment_size)-1
        piece = parts / str(index)
        needed = end-start+1
        for attempt in range(5):
            offset = piece.stat().st_size if piece.exists() else 0
            if offset == needed: return
            try:
                request = Request(f'https://huggingface.co/{repo}/resolve/{revision}/{name}', headers={'Range':f'bytes={start+offset}-{end}'})
                with urlopen(request, timeout=90) as response:
                    if response.status != 206 or not response.headers.get('Content-Range','').startswith(f'bytes {start+offset}-'):
                        raise ValueError('Server returned an unexpected byte range.')
                    with piece.open('ab') as output:
                        while True:
                            block = response.read(1024*1024)
                            if not block: break
                            if output.tell()+len(block) > needed: raise ValueError('Oversized byte range.')
                            output.write(block)
                if piece.stat().st_size != needed: raise ValueError('Incomplete byte range.')
                with mutex:
                    completed[0] += needed-offset
                    print(f'{name}: {completed[0]/1048576:.0f}/{size/1048576:.0f} MB (分块续传)', flush=True)
                return
            except Exception as error:
                if attempt == 4: raise RuntimeError(f'{name} segment {index} failed ({type(error).__name__}); partial files retained.') from None
        raise RuntimeError('Unreachable segment state.')
    with ThreadPoolExecutor(max_workers=16) as executor:
        list(executor.map(segment, range(segments)))
    combined = destination.with_suffix(destination.suffix + '.combined')
    with combined.open('wb') as output:
        for index in range(segments):
            with (parts / str(index)).open('rb') as piece:
                for block in iter(lambda:piece.read(8*1024*1024), b''): output.write(block)
    if combined.stat().st_size != size or (expected and digest(combined) != expected): raise ValueError('Model checksum mismatch.')
    combined.replace(destination)
    print(f'模型文件校验通过 {name}，总用时 {time.monotonic()-started:.0f}秒', flush=True)

def download(entry):
    name = entry['rfilename']
    if name.startswith('.') or name.endswith('.md'): return
    destination = target / name
    if '..' in Path(name).parts or Path(name).is_absolute(): raise ValueError('Invalid model path.')
    destination.parent.mkdir(parents=True, exist_ok=True)
    expected = entry.get('lfs', {}).get('sha256')
    size = entry.get('size') or entry.get('lfs', {}).get('size')
    if destination.exists() and (not size or destination.stat().st_size == size) and (not expected or digest(destination) == expected):
        print(f'复用模型文件 {name}', flush=True); return
    if size and size > 32*1024*1024:
        parallel_file(entry, destination, expected, size)
        return
    temporary = destination.with_suffix(destination.suffix + '.part')
    for attempt in range(5):
        try:
            offset = temporary.stat().st_size if temporary.exists() else 0
            headers = {'Range': f'bytes={offset}-'} if offset else {}
            request = Request(f'https://huggingface.co/{repo}/resolve/{revision}/{name}', headers=headers)
            started = time.monotonic(); reported = started
            with urlopen(request, timeout=90) as response:
                append = offset > 0 and response.status == 206
                if not append: offset = 0
                with temporary.open('ab' if append else 'wb') as output:
                    total = offset
                    while True:
                        chunk = response.read(2*1024*1024)
                        if not chunk: break
                        output.write(chunk); total += len(chunk)
                        now = time.monotonic()
                        if now-reported > 15:
                            print(f'{name}: {total/1048576:.1f} MB，{(total-offset)/1048576/max(1,now-started):.1f} MB/s', flush=True); reported = now
            if size and temporary.stat().st_size != size: raise ValueError('Incomplete model file.')
            if expected and digest(temporary) != expected: raise ValueError('Model checksum mismatch.')
            temporary.replace(destination)
            print(f'下载并验证 {name} ({destination.stat().st_size/1048576:.1f} MB)', flush=True)
            return
        except Exception as error:
            print(f'{name} 下载重试 {attempt+1}/5 ({type(error).__name__})', flush=True)
            if attempt == 4: raise RuntimeError(f'Unable to download {name}; partial files are retained.') from None

with ThreadPoolExecutor(max_workers=4) as pool:
    list(pool.map(download, info['siblings']))
(target / 'model-source.json').write_text(json.dumps({'repo': repo, 'revision': revision}, indent=2))
print(f'模型就绪：{target}', flush=True)

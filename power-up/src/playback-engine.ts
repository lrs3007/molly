import type {Level,ReadingMode,Segment} from './types.ts';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'waiting' | 'paused' | 'ended' | 'error';
export type WaitKind = 'follow' | 'transition' | 'repeat';
export interface AudioPort {
  src: string; currentTime: number; duration: number; playbackRate: number;
  preservesPitch: boolean; ended: boolean; error: unknown;
  onloadedmetadata: ((event: Event) => unknown) | null;
  onended: ((event: Event) => unknown) | null;
  onerror: ((event: Event) => unknown) | null;
  play: () => Promise<void>; pause: () => void; load: () => void;
  removeAttribute: (name: string) => void;
}
export interface PlaybackSnapshot {
  queue: Segment[]; index: number; elapsed: number; status: PlaybackStatus;
  error: string; rate: number; loop: boolean; gapSeconds: number;
  gapRemaining: number; waitKind: WaitKind | null;
}
interface Options {
  level?:Level;
  readingMode?:ReadingMode;
  createAudio: () => AudioPort;
  frame: (callback: () => void) => number;
  cancelFrame: (id: number) => void;
  resolve: (segments: Segment[]) => Segment[];
  now?: () => number;
  schedule?: (callback: () => void, milliseconds: number) => (() => void);
}
interface PendingWait {
  remainingMs: number; totalMs: number; deadline: number; kind: WaitKind; action: () => void;
}

export class PlaybackEngine {
  private state: PlaybackSnapshot = {
    queue: [], index: 0, elapsed: 0, status: 'idle', error: '', rate: .75,
    loop: false, gapSeconds: 1, gapRemaining: 0, waitKind: null,
  };
  private listeners = new Set<() => void>();
  private audio: AudioPort | null = null;
  private generation = 0;
  private frameId = 0;
  private wantsPlay = false;
  private onDone: (() => void) | undefined;
  private pendingWait: PendingWait | null = null;
  private cancelTimer: (() => void) | undefined;
  private waitGeneration = 0;
  private options: Options;
  private level:Level;
  private readingMode:ReadingMode;
  private now: () => number;
  private schedule: (callback: () => void, milliseconds: number) => (() => void);

  constructor(options: Options) {
    this.options = options;
    this.level=options.level??2;
    this.readingMode=options.readingMode??'natural';
    this.state={...this.state,rate:this.defaultRate()};
    this.now = options.now ?? (() => performance.now());
    this.schedule = options.schedule ?? ((callback, milliseconds) => {
      const timer = setTimeout(callback, milliseconds);
      return () => clearTimeout(timer);
    });
  }
  snapshot = () => this.state;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  };
  private update(patch: Partial<PlaybackSnapshot>) {
    this.state = {...this.state, ...patch};
    this.listeners.forEach(fn => fn());
  }
  private clearWaitTimer() {
    this.waitGeneration++;
    this.cancelTimer?.();
    this.cancelTimer = undefined;
  }
  private clearWait() {
    this.clearWaitTimer();
    this.pendingWait = null;
  }
  private cancel() {
    this.generation++;
    this.wantsPlay = false;
    this.clearWait();
    this.options.cancelFrame(this.frameId);
    if (this.audio) {
      this.audio.onloadedmetadata = null;
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
    }
  }
  private applyRate() {
    if (!this.audio) return;
    // English is slowed without altering the existing Mandarin teacher's pace.
    this.audio.playbackRate = this.state.queue[this.state.index]?.lang === 'en-GB' ? this.state.rate : 1;
    this.audio.preservesPitch = true;
  }
  private tick = () => {
    if (!this.audio || !this.wantsPlay) return;
    this.update({elapsed: this.audio.currentTime});
    this.frameId = this.options.frame(this.tick);
  };
  private async playAudio(generation: number) {
    const audio = this.audio!;
    try {
      await audio.play();
      if (generation !== this.generation) return;
      if (!this.wantsPlay) {
        audio.pause();
        this.update({status: 'paused'});
        return;
      }
      this.update({status: 'playing', error: ''});
      this.options.cancelFrame(this.frameId);
      this.tick();
    } catch {
      if (generation !== this.generation) return;
      this.update({status: 'error', error: '声音暂时无法播放，请点击播放重试。'});
    }
  }
  private completeWait = () => {
    const wait = this.pendingWait;
    if (!wait) return;
    this.clearWait();
    this.update({gapRemaining: 0, waitKind: null});
    wait.action();
  };
  private runWait() {
    const wait = this.pendingWait;
    if (!wait) return;
    this.clearWaitTimer();
    const waitGeneration = this.waitGeneration;
    const generation = this.generation;
    wait.deadline = this.now() + wait.remainingMs;
    this.update({status: 'waiting', gapRemaining: Math.ceil(wait.remainingMs / 100) / 10, waitKind: wait.kind});
    const tick = () => {
      if (generation !== this.generation || waitGeneration !== this.waitGeneration ||
          this.pendingWait !== wait || !this.wantsPlay) return;
      const remaining = Math.max(0, wait.deadline - this.now());
      if (!remaining) { this.completeWait(); return; }
      const seconds = Math.ceil(remaining / 100) / 10;
      if (seconds !== this.state.gapRemaining) this.update({gapRemaining: seconds});
      this.cancelTimer = this.schedule(tick, Math.min(200, remaining));
    };
    this.cancelTimer = this.schedule(tick, Math.min(200, wait.remainingMs));
  }
  private wait(milliseconds: number, kind: WaitKind, action: () => void) {
    this.pendingWait = {remainingMs: milliseconds, totalMs: milliseconds, deadline: 0, kind, action};
    this.runWait();
  }
  private gapMs() {
    return this.state.gapSeconds * 1000;
  }
  private finish() {
    this.wantsPlay = false;
    this.update({status: 'ended', gapRemaining: 0, waitKind: null});
    this.onDone?.();
  }
  private segmentEnded(index: number, segment: Segment) {
    this.options.cancelFrame(this.frameId);
    if (!this.wantsPlay) return;
    const duration = Number.isFinite(this.audio?.duration) ? this.audio!.duration : segment.duration ?? 0;
    // Keep the completed sentence, caption and animation on screen during the gap.
    this.update({elapsed: duration});
    const hasNext = index + 1 < this.state.queue.length;
    const needsFollowTime = segment.lang === 'en-GB' && (hasNext || this.state.loop || !!this.onDone);
    const advance = () => {
      // Read loop state at the end of the wait so turning looping off takes effect immediately.
      if (this.state.loop) this.loadAt(index, 0, true);
      else if (hasNext) this.loadAt(index + 1, 0, true);
      else this.finish();
    };
    if (needsFollowTime) {
      this.wait(this.gapMs(), 'follow', advance);
    } else if (hasNext && this.state.queue[index + 1].lang !== segment.lang) {
      this.wait(this.gapMs(), 'transition', advance);
    } else if (this.state.loop) {
      this.wait(this.gapMs(), 'repeat', advance);
    } else advance();
  }
  private loadAt(index: number, time: number, autoplay: boolean) {
    const segment = this.state.queue[index];
    if (!segment) return;
    this.cancel();
    const generation = this.generation;
    const audio = this.audio ?? this.options.createAudio();
    this.audio = audio;
    this.wantsPlay = autoplay;
    this.update({index, elapsed: time, error: '', status: 'loading', gapRemaining: 0, waitKind: null});
    if (!segment.src) {
      audio.removeAttribute('src');
      audio.load();
      this.update({status: 'error', error: '本段配音尚未准备好，请先阅读讲解，或切换到其他课程。'});
      return;
    }
    audio.src = segment.src;
    this.applyRate();
    audio.onloadedmetadata = () => {
      if (generation !== this.generation) return;
      const duration = Number.isFinite(audio.duration) ? audio.duration : segment.duration ?? 0;
      audio.currentTime = Math.max(0, Math.min(time, duration));
      const queue = this.state.queue.map((s, i) => i === index ? {...s, duration} : s);
      this.update({queue, elapsed: audio.currentTime});
      if (!this.wantsPlay) { this.update({status: 'paused'}); return; }
      void this.playAudio(generation);
    };
    audio.onended = () => {
      if (generation !== this.generation) return;
      this.segmentEnded(index, segment);
    };
    audio.onerror = () => {
      if (generation !== this.generation) return;
      this.wantsPlay = false;
      this.clearWait();
      this.options.cancelFrame(this.frameId);
      this.update({status: 'error', gapRemaining: 0, waitKind: null, error: '音频未能加载，请重试。也可以继续阅读字幕和做练习。'});
    };
    audio.load();
  }
  play = (segments: Segment[], onDone?: () => void) => {
    this.cancel();
    this.onDone = onDone;
    const queue = this.options.resolve(segments);
    this.update({queue, index: 0, elapsed: 0, loop: false, error: '', gapRemaining: 0, waitKind: null});
    if (!queue.length) { this.update({status: 'idle'}); return; }
    this.loadAt(0, 0, true);
  };
  pause = () => {
    if (!this.state.queue.length) return;
    this.wantsPlay = false;
    if (this.pendingWait && this.state.status === 'waiting') {
      this.pendingWait.remainingMs = Math.max(0, this.pendingWait.deadline - this.now());
      this.clearWaitTimer();
    }
    this.audio?.pause();
    this.options.cancelFrame(this.frameId);
    this.update({status: 'paused'});
  };
  resume = () => {
    if (!this.audio || !this.state.queue.length) return;
    this.wantsPlay = true;
    if (this.pendingWait) { this.runWait(); return; }
    if (this.audio.ended || this.audio.error || !this.audio.src) {
      this.loadAt(this.state.index, 0, true);
      return;
    }
    void this.playAudio(this.generation);
  };
  skipWait = () => {
    if (!this.pendingWait) return;
    this.wantsPlay = true;
    this.completeWait();
  };
  stop = () => {
    this.cancel();
    this.onDone = undefined;
    if (this.audio) { this.audio.removeAttribute('src'); this.audio.load(); }
    this.update({queue: [], index: 0, elapsed: 0, status: 'idle', error: '', loop: false, gapRemaining: 0, waitKind: null});
  };
  seek = (time: number) => {
    if (!this.state.queue.length) return;
    let remaining = Math.max(0, time), index = this.state.queue.length - 1;
    for (let i = 0; i < this.state.queue.length; i++) {
      const duration = this.state.queue[i].duration ?? 0;
      if (remaining < duration || i === this.state.queue.length - 1) {
        index = i; remaining = Math.min(remaining, duration); break;
      }
      remaining -= duration;
    }
    if (!this.pendingWait && index === this.state.index && this.audio && Number.isFinite(this.audio.duration)) {
      this.audio.currentTime = remaining;
      this.update({elapsed: remaining});
    } else this.loadAt(index, remaining, this.wantsPlay);
  };
  changeRate = (rate: number) => {
    if (![.6, .75, 1].includes(rate)) return;
    this.update({rate});
    this.applyRate();
  };
  private defaultRate() {
    return this.level===1&&this.readingMode==='guided'?.6:.75;
  }
  setLevel = (level:Level) => {
    if(level===this.level)return;
    this.level=level;
    this.changeRate(this.defaultRate());
  };
  setReadingMode = (mode:ReadingMode) => {
    if(mode===this.readingMode)return;
    this.readingMode=mode;
    this.changeRate(this.defaultRate());
  };
  changeGap = (seconds: number) => {
    if (![.5, 1, 1.5, 2].includes(seconds)) return;
    this.update({gapSeconds: seconds});
    const wait = this.pendingWait;
    if (wait?.kind === 'follow') {
      const running = this.state.status === 'waiting';
      const remaining = running ? Math.max(0, wait.deadline - this.now()) : wait.remainingMs;
      const elapsed = wait.totalMs - remaining;
      wait.totalMs = this.gapMs();
      wait.remainingMs = Math.max(0, wait.totalMs - elapsed);
      this.update({gapRemaining: Math.ceil(wait.remainingMs / 100) / 10});
      if (running) this.runWait();
    }
  };
  toggleLoop = () => this.update({loop: !this.state.loop});
  dispose = () => {
    this.cancel();
    this.audio?.removeAttribute('src');
    this.onDone = undefined;
  };
}

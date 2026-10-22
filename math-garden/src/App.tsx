import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { availableGrades, coursesByGrade, defaultLesson, lessons, topics } from './content';
import { resolveNarration } from './narration';
import type { Exercise, Lesson, TopicId } from './content';
import { checkAnswer, countSolved, emptyProgress, parseProgress, progressKey, storageKey } from './progress';
import type { LessonProgress, Progress } from './progress';
import Icon from './Icon';
import Scene from './Scene';
import GridDiagram from './GridDiagram';
import ProblemImages from './ProblemImages';

const gradeNames = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
type Tab = 'learn' | 'practice' | 'summary';
const seconds = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function readInitial() { if (typeof window === 'undefined') return emptyProgress(); try { return parseProgress(localStorage.getItem(storageKey)); } catch { return emptyProgress(); } }
function subtitleAt(text: string, fraction: number) {
  const sentences = text.match(/[^。！？]+[。！？]?/g) || [text];
  const total = sentences.reduce((n, s) => n + s.length, 0);
  let accumulated = 0;
  for (const sentence of sentences) { accumulated += sentence.length; if (accumulated >= fraction * total) return sentence; }
  return sentences.at(-1)!;
}

function Help({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="help-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <button className="icon-button dialog-close" onClick={onClose} aria-label="关闭学习指南"><Icon name="close" /></button>
    <span className="large-icon"><Icon name="sprout" size={28}/></span><h2>在小花园里，慢慢想明白</h2>
    <p>每道题都有图、有声音，也有留给你思考的时间。</p>
    <ol><li>选年级和题型，打开一节课。</li><li>点击“开始讲解”，跟着动画一步步看。</li><li>遇到“先想一想”，选一个答案，再继续。</li><li>做配套练习，看看自己有没有掌握。</li></ol>
    <p className="muted">学习记录保存在当前浏览器。换设备或清理浏览器数据后，记录不会保留。</p>
    <button className="primary-button" onClick={onClose}>知道啦，开始学习 <Icon name="arrow" size={17}/></button>
  </dialog>;
}

function ExerciseCard({ exercise, index, result, onResult }: { exercise: Exercise; index: number; result?: LessonProgress['results'][string]; onResult: (result: LessonProgress['results'][string]) => void }) {
  const [input, setInput] = useState(result?.value ?? '');
  const [hint, setHint] = useState(false);
  const [message, setMessage] = useState('');
  const [solution, setSolution] = useState(result?.revealed ?? false);
  const solved = !!result?.correct && !result.revealed;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) { setMessage(exercise.choices ? '先选一个答案吧。' : '先填一个数字吧。'); return; }
    if (!exercise.choices && !/^\d+$/.test(input.trim().replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0)))) { setMessage('这里填一个整数就好，单位已经写在旁边啦。'); return; }
    const correct = checkAnswer(exercise, input);
    setMessage(correct ? '答对啦！你已经找到方法了。' : `再想一想：${exercise.hint}`);
    onResult({ correct, revealed: result?.revealed ?? false, attempts: (result?.attempts ?? 0) + 1, value: input });
  };
  return <article className={`exercise-card ${solved ? 'solved' : ''}`}>
    <div className="exercise-heading"><span className="exercise-index">{String(index + 1).padStart(2, '0')}</span><span className={`level level-${index}`}>{exercise.level}</span>{solved && <span className="solved-badge"><Icon name="check" size={15}/> 已掌握</span>}</div>
    <h3>{exercise.prompt}</h3>
    {exercise.diagram && <GridDiagram {...exercise.diagram}/>}
    <ProblemImages images={exercise.images}/>
    <form onSubmit={submit}>
      {exercise.choices ? <div className="exercise-choices" role="group" aria-label={`第${index + 1}题答案`}>{exercise.choices.map(choice => <button type="button" aria-pressed={input === choice} className={input === choice ? 'selected' : ''} key={choice} onClick={() => { setInput(choice); setMessage(''); }}>{choice}{exercise.choiceSuffix ?? exercise.unit}</button>)}</div> : <label className="answer-input"><span>我的答案</span><input aria-label={`第${index + 1}题答案`} inputMode="numeric" value={input} onChange={e => { setInput(e.target.value); setMessage(''); }} placeholder="填入数字" autoComplete="off"/><span>{exercise.unit}</span></label>}
      <div className="exercise-actions"><button className="primary-button" type="submit">检查答案 <Icon name="check" size={16}/></button><button type="button" className="text-button" onClick={() => setHint(!hint)}><Icon name="bulb" size={17}/>{hint ? '收起提示' : '给我一点提示'}</button><button type="button" className="text-button reveal-answer" onClick={() => { setSolution(!solution); if (!solution && !solved) onResult({ correct: false, revealed: true, attempts: result?.attempts ?? 0, value: input }); }}>{solution ? '收起解析' : '查看答案'}</button></div>
    </form>
    {hint && <p className="hint-box"><Icon name="bulb" size={18}/>{exercise.hint}</p>}
    <p className={`answer-feedback ${result?.correct ? 'correct' : ''}`} role="status">{message || (solved ? '已独立答对，真棒！' : '')}</p>
    {(solution || result?.correct) && <div className="solution-box"><strong>答案：{exercise.answer}{exercise.choiceSuffix ?? exercise.unit}</strong><p>{exercise.explanation}</p>{result?.revealed && <span className="muted">看过答案的题会留在“待复习”里。理解后，可以点击“重新练习”。</span>}</div>}
    {result && <button className="text-button retry" onClick={() => { setInput(''); setMessage(''); setSolution(false); setHint(false); onResult({ correct: false, revealed: false, attempts: 0, value: '' }); }}><Icon name="repeat" size={15}/> 重新练习</button>}
  </article>;
}

function LessonView({ lesson, saved, onUpdate, onNextLesson }: { lesson: Lesson; saved: LessonProgress; onUpdate: (patch: Partial<LessonProgress>) => void; onNextLesson?: () => void }) {
  const [tab, setTab] = useState<Tab>('learn');
  const [step, setStep] = useState(Math.min(saved.step ?? 0, lesson.steps.length - 1));
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [continuous, setContinuous] = useState(true);
  const [audioError, setAudioError] = useState('');
  const [replayKey, setReplayKey] = useState(0);
  const [quizChoices, setQuizChoices] = useState<Record<number, number>>({});
  const audio = useRef<HTMLAudioElement>(null);
  const frame = useRef(0);
  const autoplayNext = useRef(false);
  const request = useRef(0);
  const current = lesson.steps[step];
  const narration = resolveNarration(lesson, step);
  const fraction = audioError ? 1 : duration ? Math.min(1, elapsed / duration) : 0;
  const solved = lesson.exercises.filter(x => saved.results[x.id]?.correct && !saved.results[x.id]?.revealed).length;
  const quizSelected = quizChoices[step];
  const quizCorrect = current.question ? quizSelected === current.question.answer : true;
  const stepFinished = duration > 0 && elapsed >= duration;
  const play = async () => {
    const element = audio.current;
    if (!element) return;
    const token = ++request.current;
    try {
      if (element.ended) element.currentTime = 0;
      await element.play();
      if (token !== request.current) return;
      setAudioError('');
    } catch (e) { if (token === request.current && (e as Error).name !== 'AbortError') setAudioError('声音暂时无法播放。你可以阅读讲稿，点击步骤继续学习，或点击播放重试。'); }
  };
  const go = (next: number, autoplay = false) => {
    request.current++;
    audio.current?.pause();
    cancelAnimationFrame(frame.current);
    autoplayNext.current = autoplay;
    setPlaying(false); setElapsed(0); setDuration(0); setAudioError('');
    setStep(next); onUpdate({ step: next });
  };
  const restartLesson = () => {
    setReplayKey(key => key + 1);
    setQuizChoices({});
    if (step !== 0) go(0, true);
    else {
      if (audio.current) audio.current.currentTime = 0;
      setElapsed(0);
      void play();
    }
  };
  const handlePlayback = () => {
    if (playing) { request.current++; audio.current?.pause(); }
    else if ((audio.current?.ended || stepFinished) && step < lesson.steps.length - 1) go(step + 1, true);
    else void play();
  };
  useEffect(() => {
    const a = audio.current!;
    a.playbackRate = rate; a.muted = muted;
    if (autoplayNext.current) { autoplayNext.current = false; void play(); }
    return () => { request.current++; a.pause(); cancelAnimationFrame(frame.current); };
    // The audio element is keyed by the step. Settings have their own effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  useEffect(() => { if (audio.current) audio.current.playbackRate = rate; }, [rate]);
  useEffect(() => { if (audio.current) audio.current.muted = muted; }, [muted]);
  useEffect(() => { if (tab !== 'learn') { request.current++; audio.current?.pause(); setPlaying(false); cancelAnimationFrame(frame.current); } }, [tab]);
  const tick = () => { const a = audio.current; if (!a) return; setElapsed(a.currentTime); if (!a.paused) frame.current = requestAnimationFrame(tick); };
  const finish = () => { onUpdate({ completed: true, step: lesson.steps.length - 1 }); setTab('practice'); };

  return <>
    <div className="lesson-layout">
      <section className="lesson-card">
        <div className="lesson-heading"><div><span className="eyebrow"><span className="tiny-square"/> 典型题 · {lesson.level ?? '基础入门'}</span><h2>{lesson.title}</h2></div><span className="lesson-length"><Icon name="clock" size={15}/> 约 2 分钟</span></div>
        <div className="lesson-tabs" role="tablist" aria-label="课程内容">
          {[['learn', '动画讲解', 'play'], ['practice', '动手练习', 'pen'], ['summary', '方法小结', 'book']].map(([id, label, icon]) => <button role="tab" id={`tab-${id}`} aria-controls={`panel-${id}`} aria-selected={tab === id} key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id as Tab)}><Icon name={icon} size={17}/>{label}{id === 'practice' && <span className="tab-count">{lesson.exercises.length}</span>}</button>)}
        </div>
        <audio key={`${lesson.id}-${step}`} ref={audio} src={narration.src} preload="metadata" onLoadedMetadata={e => setDuration(e.currentTarget.duration)} onPlay={() => { setPlaying(true); cancelAnimationFrame(frame.current); tick(); }} onPause={() => { setPlaying(false); cancelAnimationFrame(frame.current); }} onError={() => setAudioError('声音暂时无法加载。你可以阅读讲稿，点击步骤继续学习，或点击播放重试。')} onEnded={() => { setPlaying(false); cancelAnimationFrame(frame.current); setElapsed(duration); if (step === lesson.steps.length - 1) onUpdate({ completed: true }); else if (continuous && !current.question) go(step + 1, true); }}/>
        {tab === 'learn' && <div role="tabpanel" id="panel-learn" aria-labelledby="tab-learn">
          <div className="problem-box"><span className="problem-label"><Icon name="book" size={17}/> 一起读题</span><p>{lesson.problem}</p>{lesson.source && <small className="source-note">参考资料原题 · {lesson.level}</small>}<ProblemImages images={lesson.images}/></div>
          <div className={`animation-stage stage-${lesson.topic}`}>
            <div className="stage-heading"><span><span className="live-dot"/> 把题目画出来</span><span className="step-chip">第 {step + 1} / {lesson.steps.length} 步</span></div>
            <Scene key={replayKey} lesson={lesson} step={step} fraction={fraction}/>
            <div className="stage-caption"><strong>{current.title}</strong><span>{current.caption}</span></div>
            {current.formula && <div className="formula">{current.formula}</div>}
          </div>
          <div className="narration"><span className={`narrator-icon ${playing ? 'talking' : ''}`}><Icon name={muted ? 'muted' : 'volume'} size={20}/></span><div><span className="narration-label">老师讲解 <span>{playing ? '正在讲解…' : '跟着声音，一步步想'}</span></span><p>{audioError ? current.caption : subtitleAt(narration.text, fraction)}</p></div></div>
          {audioError && <p className="audio-error" role="status">{audioError}</p>}
          <div className="player">
            <div className="player-timeline"><label className="sr-only" htmlFor="audio-progress">本步骤播放进度</label><input id="audio-progress" type="range" min="0" max={duration || 1} step="0.05" value={elapsed} disabled={!duration} onChange={e => { const t = Number(e.target.value); if (audio.current) audio.current.currentTime = t; setElapsed(t); }} style={{ '--progress': `${fraction * 100}%` } as React.CSSProperties}/><span>{seconds(elapsed)} / {seconds(duration)}</span></div>
            <div className="player-controls"><div className="main-controls"><button className="icon-button" aria-label="上一步" disabled={step === 0} onClick={() => go(step - 1)}><Icon name="back"/></button><button className="play-button" onClick={handlePlayback}><Icon name={playing ? 'pause' : 'play'} size={17}/>{playing ? '暂停讲解' : stepFinished && step === lesson.steps.length - 1 ? '重新讲解' : elapsed > 0 ? '继续讲解' : '开始讲解'}</button><button className="icon-button" aria-label="下一步" disabled={step === lesson.steps.length - 1} onClick={() => go(step + 1)}><Icon name="chevron"/></button><button className="icon-button replay" aria-label="从第一步重新演示" title="从第一步重新演示" onClick={restartLesson}><Icon name="repeat" size={18}/></button></div><div className="extra-controls"><label className="rate-select"><span className="sr-only">播放速度</span><select aria-label="播放速度" value={rate} onChange={e => setRate(Number(e.target.value))}><option value={.8}>0.8×</option><option value={1}>1.0×</option><option value={1.25}>1.25×</option></select></label><button className="icon-button" aria-label={muted ? '开启声音' : '关闭声音'} aria-pressed={muted} onClick={() => setMuted(!muted)}><Icon name={muted ? 'muted' : 'volume'} size={19}/></button></div></div>
          </div>
          {current.question && <div className="mini-quiz"><div className="mini-quiz-title"><Icon name="bulb" size={20}/><strong>先想一想</strong><span>选一选，再继续</span></div><p>{current.question.prompt}</p><div className="quiz-choices">{current.question.choices.map((choice, i) => <button key={choice} className={quizSelected === i ? (quizCorrect ? 'correct-choice' : 'wrong-choice') : ''} aria-pressed={quizSelected === i} onClick={() => setQuizChoices({ ...quizChoices, [step]: i })}><span>{String.fromCharCode(65 + i)}</span>{choice}{quizSelected === i && quizCorrect && <Icon name="check" size={17}/>}</button>)}</div>{quizSelected !== undefined && <p className="quiz-feedback" role="status">{quizCorrect ? `答对啦！${current.question.explanation}` : '再想一想，回头看看图里的数量关系。'}</p>}{quizCorrect && <button className="primary-button" onClick={() => go(step + 1, true)}>继续看动画 <Icon name="arrow" size={16}/></button>}</div>}
          <div className="lesson-footer"><label className="continuous"><input type="checkbox" checked={continuous} onChange={e => setContinuous(e.target.checked)}/> 自动连播 <span>思考题会暂停</span></label><details className="transcript"><summary>查看本步讲稿</summary><p>{narration.text}</p></details></div>
          {step === lesson.steps.length - 1 && <div className="finish-row"><span><Icon name="star" size={18}/> 方法学会了？来试试吧！</span><button className="primary-button" onClick={finish}>完成讲解，去练习 <Icon name="arrow" size={17}/></button>{onNextLesson && <button className="text-button" onClick={onNextLesson}>继续下一种变化 <Icon name="arrow" size={16}/></button>}</div>}
        </div>}
        {tab === 'practice' && <div className="practice-panel" role="tabpanel" id="panel-practice" aria-labelledby="tab-practice"><div className="practice-intro"><div><h3>现在，轮到你啦！</h3><p>从改数字到换情境，一步步试试自己的方法。</p></div><span className="practice-score">{solved}<small> / {lesson.exercises.length} 已掌握</small></span></div>{lesson.exercises.map((ex, i) => <ExerciseCard key={ex.id} exercise={ex} index={i} result={saved.results[ex.id]} onResult={r => onUpdate({ results: { ...saved.results, [ex.id]: r } })}/>)}{solved === lesson.exercises.length && <div className="celebration"><Icon name="star" size={25}/><h3>本课练习掌握啦！</h3><p>试着把今天的方法讲给家人听吧。</p></div>}{onNextLesson && <div className="finish-row"><span>把方法带到下一种变化里</span><button className="primary-button" onClick={onNextLesson}>继续下一种变化 <Icon name="arrow" size={17}/></button></div>}</div>}
        {tab === 'summary' && <div className="summary-panel" role="tabpanel" id="panel-summary" aria-labelledby="tab-summary"><span className="large-icon"><Icon name="bulb" size={28}/></span><h3>今天的小发现</h3><p className="takeaway">{lesson.takeaway}</p><div className="summary-steps">{lesson.steps.filter(s => s.formula).map(s => <div key={s.title}><span>{s.title}</span><strong>{s.formula}</strong></div>)}</div><h3>这些小地方要留心</h3><ul>{lesson.mistakes.map(m => <li key={m}>{m}</li>)}</ul><button className="primary-button" onClick={() => setTab('practice')}>用练习检查一下 <Icon name="arrow" size={17}/></button></div>}
      </section>
      <aside className="course-rail">
        <section className="rail-card"><div className="rail-heading"><Icon name="book" size={18}/><h3>这一课怎么学</h3></div><p className="rail-description">慢慢来，每一步都算数。</p><ol className="step-list">{lesson.steps.map((s, i) => <li key={s.title} className={tab === 'learn' && i === step ? 'current' : ''}><button onClick={() => { setTab('learn'); if (i !== step) go(i); }} aria-current={tab === 'learn' && i === step ? 'step' : undefined}><span className="step-number">{saved.completed || i < step ? <Icon name="check" size={13}/> : i + 1}</span><span><strong>{s.title}</strong><small>{['找出题目里的条件', '用图形帮助理解', '停一停，动动脑筋', '一步步发现关系', '记住今天的小方法'][i]}</small></span>{tab === 'learn' && i === step && <span className="current-dot"/>}</button></li>)}</ol><div className="rail-divider"/><button className={`practice-link ${tab === 'practice' ? 'active' : ''}`} onClick={() => setTab('practice')}><span className="practice-icon"><Icon name="pen" size={18}/></span><span><strong>动手练习</strong><small>{solved} / {lesson.exercises.length} 道已掌握</small></span><Icon name="chevron" size={17}/></button></section>
        <section className="tip-card"><span className="tip-icon"><Icon name="bulb" size={22}/></span><h3>学习小贴士</h3><p>{lesson.tip ?? (lesson.topic === 'trees' ? '拿出纸和笔，画几个点和几段线。亲手画一画，会更容易发现树和间隔的关系哦。' : lesson.topic === 'unit' ? '遇到“几份”的问题，先问自己：一份是多少？把这一份找出来，后面就容易啦。' : lesson.topic === 'sum' ? '把数量画成线段，长出来的那一段就是“差”。让两份一样长，再平均分。' : '先圈出重复的一组，再找位置。余数是0时，别忘了看这一组的最后一个。')}</p><div className="tip-doodle"><Icon name="pen" size={28}/><span>想一想 · 画一画</span></div></section>
      </aside>
    </div>
    <div className="bottom-note"><Icon name="heart" size={15}/> 学数学，可以慢一点。想明白，比做得快更重要。</div>
  </>;
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(readInitial);
  const [grade, setGrade] = useState(progress.grade);
  const [topic, setTopic] = useState<TopicId>(lessons.find(x => x.id === progress.lessonId)?.topic ?? defaultLesson.topic);
  const [selectedLessonId, setSelectedLessonId] = useState(progress.lessonId);
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState(false);
  const [overview, setOverview] = useState<'learn' | 'review'>('learn');
  const [storageWarning, setStorageWarning] = useState(false);
  const topicLessons = lessons.filter(x => x.grade === grade && x.topic === topic).sort((a,b) => (a.pathOrder ?? 0) - (b.pathOrder ?? 0));
  const lesson = topicLessons.find(x => x.id === selectedLessonId) ?? topicLessons[0];
  const nextLesson = topicLessons[topicLessons.findIndex(x => x.id === lesson?.id) + 1];
  const selectedTopic = topics.find(x => x.id === topic)!;
  const solved = countSolved(progress);
  const completed = Object.values(progress.lessons).filter(x => x.completed).length;
  const reviewLessons = lessons.filter(l => { const p = progress.lessons[progressKey(l.id, l.version)]; return p && Object.values(p.results).some(r => r.revealed || (r.attempts > 0 && !r.correct)); });
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { setStorageWarning(true); } }, [progress]);
  const select = (nextGrade: number, nextTopic = topic, nextId?: string) => {
    setGrade(nextGrade); setTopic(nextTopic); setMenu(false); setOverview('learn');
    const next = lessons.find(x => x.grade === nextGrade && x.topic === nextTopic && (!nextId || x.id === nextId));
    if (next) setSelectedLessonId(next.id);
    setProgress(p => ({ ...p, grade: nextGrade, lessonId: next?.id ?? p.lessonId }));
  };
  const updateLesson = (patch: Partial<LessonProgress>) => { if (lesson) setProgress(p => { const key = progressKey(lesson.id, lesson.version); return { ...p, lessons: { ...p.lessons, [key]: { ...(p.lessons[key] ?? { results: {} }), ...patch } } }; }); };
  return <div className="app-shell">
    {menu && <button className="sidebar-backdrop" aria-label="关闭导航" onClick={() => setMenu(false)}/>}
    <aside className={`sidebar ${menu ? 'open' : ''}`} aria-label="学习导航">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); select(defaultLesson.grade, defaultLesson.topic); }}><span className="brand-mark"><Icon name="sprout" size={27}/></span><span><strong>数学小花园</strong><small>让思考，慢慢发芽</small></span></a>
      <div className="sidebar-section-label">我的学习空间</div>
      <button className={`sidebar-link ${overview === 'learn' ? 'active' : ''}`} onClick={() => { setOverview('learn'); setMenu(false); }}><Icon name="book"/> 数学课堂 <span className="nav-dot"/></button>
      <button className={`sidebar-link ${overview === 'review' ? 'active' : ''}`} onClick={() => { setOverview('review'); setMenu(false); }}><Icon name="repeat"/> 待复习题目 {reviewLessons.length > 0 && <span className="review-count">{reviewLessons.length}</span>}</button>
      <div className="sidebar-section-label grade-section">按年级探索 <span>GRADE</span></div>
      <nav className="grade-nav" aria-label="选择年级">{gradeNames.map((name, i) => <div key={name}><button className={`grade-button ${grade === i + 1 && overview === 'learn' ? 'selected' : ''}`} aria-expanded={grade === i + 1 && overview === 'learn'} onClick={() => select(i + 1)}><span className="grade-symbol">{['1', '2', '3', '4', '5', '6'][i]}</span>{name}{coursesByGrade[i + 1]?.length ? <Icon name={grade === i + 1 && overview === 'learn' ? 'down' : 'chevron'} size={15}/> : <span className="coming-small">筹备中</span>}</button>{grade === i + 1 && overview === 'learn' && coursesByGrade[grade]?.length > 0 && <div className="topic-nav">{topics.filter(t => coursesByGrade[grade].some(l => l.topic === t.id)).map(t => <button key={t.id} className={topic === t.id ? 'selected' : ''} aria-current={topic === t.id ? 'page' : undefined} onClick={() => select(grade, t.id)}><Icon name={t.icon} size={17}/>{t.name}{coursesByGrade[grade].filter(l => l.topic === t.id).every(l => progress.lessons[progressKey(l.id, l.version)]?.completed) && <Icon name="check" size={13}/>}</button>)}</div>}</div>)}</nav>
      <div className="sidebar-grow"/>
      <div className="growth-card"><span><Icon name="sprout" size={22}/></span><div><strong>每天一个小发现</strong><p>你的思考，正在长大。</p></div></div>
      <div className="local-profile"><span className="avatar">小</span><div><strong>小小探索家</strong><small>学习进度 · 本机保存</small></div><Icon name="star" size={17}/></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" onClick={() => setMenu(true)} aria-label="打开年级导航"><Icon name="menu"/></button><Icon name="home" size={17}/><span>数学课堂</span><Icon name="chevron" size={13}/><strong>{overview === 'review' ? '待复习题目' : gradeNames[grade - 1]}</strong>{overview === 'learn' && lesson && <><Icon name="chevron" size={13}/><span>{selectedTopic.name}</span></>}</div><div className="topbar-actions"><span className="learner-badge"><Icon name="sprout" size={17}/> 每天进步一点点</span><button className="help-button" onClick={() => setHelp(true)}><Icon name="help" size={18}/><span>学习指南</span></button></div></header>
      <main className="main-content">
        <div className="page-heading"><div><div className="page-eyebrow">HELLO, LITTLE EXPLORER <span>✦</span></div><h1>{overview === 'review' ? '让小问号，变成小发现' : lesson ? selectedTopic.name : `${gradeNames[grade - 1]}的小花园`}{lesson && overview === 'learn' && <span className="heading-doodle"><Icon name={selectedTopic.icon} size={34}/></span>}</h1><p>{overview === 'review' ? '把还没想明白的题，再慢慢想一遍。' : lesson ? `${selectedTopic.subtitle}。跟着动画，让数学变得看得见。` : '新的数学小故事正在准备，一起期待吧。'}</p></div><div className="learning-stats"><span className="stat-icon"><Icon name="star" size={22}/></span><div><strong>{solved}<small> 道题</small></strong><span>已经独立掌握</span></div></div></div>
        {storageWarning && <p className="storage-warning" role="status">浏览器暂时无法保存记录。本次仍可正常学习，关闭页面后进度可能丢失。</p>}
        {overview === 'review' ? <section className="review-panel"><div className="review-header"><Icon name="repeat" size={24}/><h2>我的待复习课程</h2><span>{reviewLessons.length} 节课</span></div>{reviewLessons.length === 0 ? <div className="empty-state"><span className="large-icon"><Icon name="sprout" size={32}/></span><h2>还没有需要复习的题</h2><p>答错或看过答案的题，会出现在这里。现在去发现一个新方法吧。</p><button className="primary-button" onClick={() => select(defaultLesson.grade, defaultLesson.topic)}>去数学课堂 <Icon name="arrow" size={17}/></button></div> : reviewLessons.map(l => <button className="review-lesson" key={l.id} onClick={() => select(l.grade, l.topic, l.id)}><span className="topic-tile"><Icon name={topics.find(t => t.id === l.topic)!.icon}/></span><span><strong>{l.title}</strong><small>{gradeNames[l.grade - 1]} · {topics.find(t => t.id === l.topic)!.name}</small></span><span>再学一次 <Icon name="arrow" size={17}/></span></button>)}</section>  : lesson ? <><section className="lesson-path" aria-label="本类学习路径"><div className="path-heading"><div><h2>从基础到变化</h2><p>先想明白基础，再换条件试一试。较难的原题可以和家人一起学。</p></div><span>{topicLessons.length} 节课</span></div><ol>{topicLessons.map((item, index) => <li key={item.id}><button className={item.id === lesson.id ? 'selected' : ''} aria-current={item.id === lesson.id ? 'step' : undefined} onClick={() => select(grade, topic, item.id)}><span className="path-order">{progress.lessons[progressKey(item.id, item.version)]?.completed ? <Icon name="check" size={14}/> : index + 1}</span><span><small>{item.level ?? '基础入门'}</small><strong>{item.title}</strong></span></button></li>)}</ol></section><div className="lesson-select"><span className="topic-tile"><Icon name={selectedTopic.icon} size={21}/></span><div><strong>{lesson.description}</strong><span>{lesson.tags.join(' · ')}</span></div><span className="lesson-status">{progress.lessons[progressKey(lesson.id, lesson.version)]?.completed ? <><Icon name="check" size={14}/> 已完成讲解</> : <><span className="status-dot"/> 正在探索</>}</span></div><LessonView key={lesson.id} lesson={lesson} saved={progress.lessons[progressKey(lesson.id, lesson.version)] ?? { results: {} }} onUpdate={updateLesson} onNextLesson={nextLesson ? () => { select(grade, topic, nextLesson.id); window.scrollTo({ top: 0, behavior: 'smooth' }); } : undefined}/></> : <section className="empty-state coming-state"><span className="large-icon"><Icon name="sprout" size={36}/></span><span className="coming-label">内容筹备中</span><h2>这一片小花园，还在发芽</h2><p>目前已开放{availableGrades.map(g => gradeNames[g - 1]).join('、')}的{topics.length}类题型，共{lessons.length}节动画课。<br/>你可以先去看看，一起发现数学里的小秘密。</p><div className="coming-actions">{availableGrades.map(g => <button key={g} className="primary-button" onClick={() => select(g, defaultLesson.topic)}>探索{gradeNames[g - 1]} <Icon name="arrow" size={17}/></button>)}</div></section>}
        <footer className="site-footer"><span>数学小花园 <span>·</span> 把数学想明白</span><span>已学完 {completed} / {lessons.length} 节课 <span>·</span> 为每一次思考加油</span></footer>
      </main>
    </div>
    {help && <Help onClose={() => setHelp(false)}/>}
  </div>;
}

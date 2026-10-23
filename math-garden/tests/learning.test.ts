import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { availableGrades, coursesByGrade, lessons, topics } from '../src/content.ts';
import { archivedGradeFourLessons } from '../src/courses/archive/grade-4.ts';
import { gridShapes } from '../src/grid.ts';
import { resolveNarration } from '../src/narration.ts';
import { teachingText } from '../scripts/speech-plan.ts';
import { checkAnswer, emptyProgress, parseProgress, countSolved, progressKey } from '../src/progress.ts';

test('grade one offers a progression in every topic and other grades remain empty', () => {
  assert.equal(topics.length, 9);
  assert.equal(lessons.length, 82);
  assert.deepEqual(availableGrades, [1]);
  for (const grade of [1]) {
    const group = lessons.filter(x => x.grade === grade);
    assert.equal(group.length, 82);
    assert.deepEqual(new Set(group.map(x => x.topic)), new Set(topics.map(x => x.id)));
  }
  for (const grade of [2, 3, 4, 5, 6]) assert.deepEqual(coursesByGrade[grade], []);
  assert.equal(archivedGradeFourLessons.length, 9);
  assert.equal(new Set(lessons.flatMap(l => l.exercises.map(x => x.id))).size, 100);
  for (const lesson of lessons) {
    assert.equal(lesson.grade, 1);
    if (lesson.audioSourceId) {
      assert.equal(lesson.id, `${lesson.topic}-1`);
      assert.equal(lesson.audioSourceId, `${lesson.topic}-3`);
    }
    assert.match(lesson.id, /^[a-z]+-1$/);
    for (const exercise of lesson.exercises) assert.ok(exercise.id.startsWith(`${lesson.id}-`));
    assert.equal(lesson.steps.length, 5);
    assert.equal(lesson.exercises.length, lesson.audioSourceId ? 3 : 1);
    assert.ok(lesson.steps[2].question);
    const quiz = lesson.steps[2].question!;
    assert.ok(quiz.answer >= 0 && quiz.answer < quiz.choices.length);
  }
});

test('active narration points to complete audio media', () => {
  for (const lesson of lessons) for (const i of lesson.steps.keys()) {
    const path = `public${resolveNarration(lesson, i).src}`;
    assert.ok(statSync(path).size > 15000, `${path} should contain speech`);
    const data = readFileSync(path);
    const narration = resolveNarration(lesson, i);
    assert.equal(narration.text, teachingText(lesson, i));
    if ('sha256' in narration) assert.equal(createHash('sha256').update(data).digest('hex'), narration.sha256);
    if (path.endsWith('.wav')) {
      assert.equal(data.toString('ascii', 0, 4), 'RIFF');
      assert.equal(data.toString('ascii', 8, 12), 'WAVE');
      assert.equal(data.readUInt32LE(40), data.length - 44);
    } else {
      assert.equal(data.toString('ascii', 4, 8), 'ftyp');
      assert.ok(data.includes(Buffer.from('mdat')), `${path} should contain encoded audio`);
      assert.ok(data.includes(Buffer.from('mp4a')), `${path} should use AAC`);
    }
  }
});

test('exercise answers agree with the independent arithmetic of the written problems', () => {
  for (const lesson of lessons.filter(l => l.audioSourceId)) for (const ex of lesson.exercises) {
    const nums = ex.prompt.match(/\d+/g)!.map(Number);
    let expected: string;
    if (lesson.topic === 'trees') {
      const adjust = ex.prompt.includes('两端都不') ? -1 : ex.prompt.includes('两端都') || ex.prompt.includes('两端都有') ? 1 : 0;
      expected = String(nums[0] / nums[1] + adjust);
    } else if (lesson.topic === 'unit') {
      const unit = nums[1] / nums[0];
      expected = String(ex.prompt.includes('可以买') ? nums[2] / unit : nums[2] * unit);
    } else if (lesson.topic === 'sum') {
      const asksSmaller = /小禾有|弟弟有/.test(ex.prompt);
      expected = String((nums[0] + (asksSmaller ? -nums[1] : nums[1])) / 2);
    } else if (lesson.topic === 'cycle') {
      const colors = ex.prompt.includes('红、黄、蓝、绿') ? ['红', '黄', '蓝', '绿'] : ['红', '黄', '蓝'];
      const ordinal = Number(ex.prompt.match(/第(\d+)[颗面]/)![1]);
      expected = colors[(ordinal - 1) % colors.length];
    } else if (lesson.topic === 'average') {
      const known = ex.prompt.match(/分别(?:有|是|读了)?([^，。]+)/)![1].match(/\d+/g)!.map(Number);
      expected = String(lesson.scene.kind === 'average' && lesson.scene.mode === 'mean' ? known.reduce((a, b) => a + b, 0) / nums[0] : nums[0] * nums[1] - known.reduce((a, b) => a + b, 0));
    } else if (lesson.topic === 'ratio') {
      const multiple = Number(ex.prompt.match(/的(\d+)倍/)![1]);
      const combined = ex.prompt.match(/共(?:有|长)(\d+)/), difference = ex.prompt.match(/多(\d+)/);
      const small = combined ? Number(combined[1]) / (multiple + 1) : Number(difference![1]) / (multiple - 1);
      expected = String(/弟弟有/.test(ex.prompt) ? small : small * multiple);
    } else if (lesson.topic === 'transfer') {
      if (ex.prompt.includes('后，两人各有')) expected = String(nums[1] + (ex.prompt.includes('小禾原来') ? -nums[0] : nums[0]));
      else expected = String((nums[0] - nums[1]) / 2);
    } else if (lesson.topic === 'geometry') {
      let count = 0;
      // Count by choosing all pairs of horizontal and vertical grid lines.
      for (let top = 0; top < nums[0]; top++) for (let bottom = top + 1; bottom <= nums[0]; bottom++)
        for (let left = 0; left < nums[1]; left++) for (let right = left + 1; right <= nums[1]; right++)
          if (lesson.scene.kind === 'geometry' && lesson.scene.shape === 'rectangle' || bottom - top === right - left) count++;
      expected = String(count);
      assert.deepEqual(ex.diagram, { rows: nums[0], columns: nums[1] });
    } else if (lesson.topic === 'age') {
      let answer: number | undefined;
      for (let year = 0; year <= 100; year++) {
        const shift = ex.prompt.includes('几年前') ? -year : year;
        if (nums[1] + shift > 0 && nums[0] + shift === nums[2] * (nums[1] + shift)) { answer = year; break; }
      }
      assert.notEqual(answer, undefined);
      expected = String(answer);
    } else {
      throw new Error(`Missing independent arithmetic for ${lesson.topic}`);
    }
    assert.equal(ex.answer, expected, `${ex.id}: ${ex.prompt}`);
  }
});

test('grid enumeration counts combinations once and never includes non-square rectangles in square lessons', () => {
  for (const [rows, columns, square, count] of [[1, 3, false, 6], [2, 2, false, 9], [3, 3, true, 14], [4, 4, true, 30], [2, 3, true, 8]] as const) {
    const shapes = gridShapes(rows, columns, square);
    assert.equal(shapes.length, count);
    assert.equal(new Set(shapes.map(s => JSON.stringify(s))).size, count);
    for (const s of shapes) {
      assert.ok(s.column + s.width <= columns && s.row + s.height <= rows);
      if (square) assert.equal(s.width, s.height);
    }
  }
});

test('numeric answers accept full-width digits and leading zeros without accepting decimals or expressions', () => {
  const ex = lessons[0].exercises[0];
  assert.equal(checkAnswer(ex, ' ９ '), true);
  assert.equal(checkAnswer(ex, '09'), true);
  for (const wrong of ['', '9.0', '9棵', '8+1', '9e0', '8']) assert.equal(checkAnswer(ex, wrong), false);
});

test('corrupt or stale browser storage recovers safely', () => {
  for (const raw of ['invalid', 'null', '{}', '{"schema":2}', JSON.stringify({ ...emptyProgress(), grade: 99 }), JSON.stringify({ ...emptyProgress(), lessons: { 'trees-3:v1': { step: 100, results: {} } } }), JSON.stringify({ ...emptyProgress(), lessons: { x: { results: { x: null } } } })]) assert.deepEqual(parseProgress(raw), emptyProgress());
  const valid = { ...emptyProgress(), lessons: { 'trees-1:v1': { step: 2, completed: true, results: {} } } };
  assert.deepEqual(parseProgress(JSON.stringify(valid)), valid);
  assert.notEqual(progressKey('trees-3', 1), progressKey('trees-3', 2));
});

test('revealing a solution and incorrect attempts do not count as independently solved', () => {
  const p = emptyProgress();
  p.lessons['trees-1:v1'] = { results: {
    a: { correct: true, revealed: false, attempts: 1, value: '9' },
    b: { correct: true, revealed: true, attempts: 2, value: '6' },
    c: { correct: false, revealed: false, attempts: 1, value: '8' },
  } };
  assert.equal(countSolved(p), 1);
});

test('legacy grade-three progress moves to grade one while grade-four progress is preserved outside active totals', () => {
  const correct = { correct: true, revealed: false, attempts: 1, value: '9' };
  const review = { correct: false, revealed: true, attempts: 2, value: '5' };
  const legacy = { schema: 1, grade: 3, lessonId: 'trees-3', lessons: {
    'trees-3:v1': { completed: true, step: 2, results: { 'trees-3-a': correct, 'trees-3-b': review } },
    'trees-4:v1': { completed: true, step: 4, results: { 'trees-4-a': correct } },
  } };
  const migrated = parseProgress(JSON.stringify(legacy));
  assert.equal(migrated.schema, 2);
  assert.equal(migrated.grade, 1);
  assert.equal(migrated.lessonId, 'trees-1');
  assert.deepEqual(migrated.lessons['trees-1:v1'], { completed: true, step: 2, results: { 'trees-1-a': correct, 'trees-1-b': review } });
  assert.deepEqual(migrated.archivedLessons?.['trees-4:v1'], legacy.lessons['trees-4:v1']);
  assert.equal(countSolved(migrated), 1);
  assert.deepEqual(parseProgress(JSON.stringify(migrated)), migrated);
  const oldGradeFour = parseProgress(JSON.stringify({ ...legacy, grade: 4, lessonId: 'trees-4' }));
  assert.equal(oldGradeFour.grade, 1);
  assert.equal(oldGradeFour.lessonId, 'trees-1');
});

test('coming-soon grades remain selected on reload after migration', () => {
  for (const grade of [2, 3, 4, 5, 6]) {
    const saved = { ...emptyProgress(), grade };
    assert.deepEqual(parseProgress(JSON.stringify(saved)), saved);
  }
});

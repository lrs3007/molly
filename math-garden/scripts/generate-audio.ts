// macOS offline Mandarin narration. The deployed website plays pre-generated AAC files.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { audioPath, lessons } from '../src/content.ts';
const temp = mkdtempSync(join(tmpdir(), 'math-garden-audio-'));
const output = resolve('public/audio');
mkdirSync(output, { recursive: true });
try {
  for (const lesson of lessons) for (const [index, step] of lesson.steps.entries()) {
    const filename = `${lesson.id}-${index + 1}`;
    const aiff = join(temp, `${filename}.aiff`);
    execFileSync('/usr/bin/say', ['-v', 'Tingting', '-r', '155', '-o', aiff, step.narration]);
    execFileSync('/usr/bin/afconvert', ['-f', 'm4af', '-d', 'aac@44100', '-b', '64000', aiff, resolve(`public${audioPath(lesson, index)}`)]);
    console.log(`Generated ${filename}.m4a`);
  }
} finally { rmSync(temp, { recursive: true, force: true }); }

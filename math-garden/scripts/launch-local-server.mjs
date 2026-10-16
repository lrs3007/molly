import { spawn } from 'node:child_process';
import { closeSync, openSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const [vite, pidFile, logFile] = process.argv.slice(2);
const log = openSync(logFile, 'w');
const server = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '5173', '--strictPort'], {
  cwd: dirname(dirname(pidFile)),
  detached: true,
  stdio: ['ignore', log, log],
});
closeSync(log);
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.once('spawn', () => { writeFileSync(pidFile, `${server.pid}\n`); server.unref(); });

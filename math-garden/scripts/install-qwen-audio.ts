import { installQwenPack } from './qwen-pack.ts';
try {
  if (process.argv.length !== 3) throw new Error('用法：npm run audio:install -- .audio-output/qwen3-serena-目录');
  console.log(JSON.stringify(installQwenPack(process.argv[2]), null, 2));
} catch (error) { console.error(error instanceof Error ? error.message : 'Qwen3-TTS音频安装失败。'); process.exitCode = 1; }

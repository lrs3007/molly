# 数学小花园

小学奥数教学 MVP，React + TypeScript + Vite 静态网站。开放三、四年级的植树、归一、和差、周期、平均数、和差倍、移多补少、平面图形计数和年龄问题，共18节动画课程、90段预制普通话讲解、54道带提示和解析的练习。其他年级展示筹备状态。

## 开发与验证

```sh
npm ci
npm run dev
npm test
npm run build
```

默认本地地址 http://127.0.0.1:5173 。生产文件输出到 `dist/`，可直接部署为静态网站。Node 22.18+ 可运行使用原生 TypeScript 类型剥离的测试脚本，推荐Node24+。

## 内容与动画

- `src/content.ts`和`src/extra-lessons.ts`：题目、步骤、讲稿、互动问题、练习、方法和常见错误。新增课程通过同一数据结构扩展。
- `src/Scene.tsx`和`src/ExtraScenes.tsx`：九种SVG教学场景，按步骤和音频播放进度渲染画面。
- `src/App.tsx`：年级/题型导航、播放器、课程/练习/小结、待复习列表。
- `src/progress.ts`：本机学习记录与答案校验。记录使用课程编号及版本，更新内容版本后不会沿用旧课程的结果。
- `public/audio/qwen3/`：90段Qwen3-TTS普通话音频及试听页，与部署一起发布，播放不需要实时语音API；原AAC文件保留作旧课程的回退资源。

每个讲解步骤独立音频；画面以音频`currentTime / duration`为时间基准，字幕按句长比例定位。暂停、拖动、倍速和重听使用同一播放时钟。自动连播在思考题处停下，答对后点击继续；任何步骤都可以手动跳转。字幕是句长估算的句级同步，后续可改成经人工标注的时间点。

## Qwen3-TTS 本地配音（默认）

采用 Qwen3-TTS 1.7B CustomVoice，Serena 中文女声，通过 MLX 在 Apple Silicon 上本地运行。模型只负责提前生成课程音频；网站发布后直接播放静态文件，不需要语音 API Key，也不需要为每次播放运行模型。

固定模型：`mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit`，版本 `41d3337e8b7f2843a75841595fc14e4b9a7a4b96`。模型遵循 Apache 2.0；来源：[Qwen 官方项目](https://github.com/QwenLM/Qwen3-TTS)、[MLX 模型卡](https://huggingface.co/mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit)。模型和解码器约3GB，缓存在本项目 `.cache/models/`，不会加入Git或发布到网站。

### 安装生成环境

需要Apple Silicon Mac和Python 3.12。前端开发不需要Python环境。

```sh
python3.12 -m venv .venv-tts
.venv-tts/bin/python -m pip install --cache-dir .cache/pip -r scripts/requirements-tts.txt
npm run audio:plan
.venv-tts/bin/python -u scripts/download-qwen-model.py
```

模型下载使用固定版本，支持分块续传并校验大文件SHA256。下载完成后，生成阶段使用本地模型，不调用云端语音服务。

### 试听、批量生成与安装

```sh
# 生成植树课程的读题和关系解释两段样片
npm run audio:sample

# 生成全部90段；中断后再次执行可以复用已完成音频；新增课程会复用未变更的已安装音频
npm run audio

# 用上一步输出的实际目录安装完整音频包
npm run audio:install -- .audio-output/qwen3-serena-实际目录

npm test
npm run build
```

生成过程中会持续保存 `.audio-output/qwen3-serena-.../checkpoint.json` 和 `index.html` 试听页。每段音频经过非静音、有限采样值和时长检查后才保存。全部90段完成后才产生可安装的 `catalog.json`。安装会核对模型版本、讲稿签名、文件SHA256、WAV格式和实际时长，全部通过后再一起切换音频及讲稿。失败或中断时，网站仍使用原有配音。

音频格式为24kHz、单声道、16位PCM WAV，文件名包含内容哈希，避免浏览器继续使用旧音频缓存。安装时也会复制试听页到 `/audio/qwen3/音频包编号/index.html`。`src/audio-catalog.json`记录当前实际使用的配音来源。

### 教学表达

- `scripts/speech-plan.ts`提供90段口语化讲稿，数字转换为中文读法。
- `scripts/qwen-plan.ts`提供Serena、标准普通话、亲切耐心的成年女老师讲述指令；不同步骤分别控制提问、看图解释和总结语气。
- 问题步骤在段尾保留1200ms停顿，其他步骤450ms；页面继续等待孩子作答。
- 画面和字幕以实际音频播放时钟为基准，保留暂停、倍速、重听与跳转。句内字幕仍按句长估算，尚未接入字级时间戳。
- `scripts/generate-qwen-audio.py`负责本地推理与可续跑音频包；`scripts/qwen-pack.ts`负责完整包校验和安装。

### 保留的其他生成器

原豆包接入作为可选工具保留：`npm run audio:doubao -- --dry-run`；真实调用需要单独配置 `.env.local`。原macOS系统配音工具为 `npm run audio:system`。默认生成流程使用Qwen3-TTS，两者不会自动作为失败回退服务。

## MVP 边界

- 学习记录保存在当前浏览器localStorage，不包含账号和跨设备同步。
- 看过答案的题计入待复习；重新练习可重置该题状态。
- 实际使用的语音由`src/audio-catalog.json`决定。生成新声音后需试听、核对数字读法及教学表达。
- 首批题目已通过独立算术校验，仍建议老师结合目标学生水平审核难度。
- 无实时AI对话、付费功能或管理后台。

## 本地运行（默认）

本项目当前仅需在本机运行，后续修改无需发布到托管平台。

```sh
../start.sh
../stop.sh
```

浏览器打开 http://127.0.0.1:5173/ 。服务只监听本机地址，无需登录。`start.sh`会先构建最新代码，再在后台启动，关闭终端后仍可使用；`stop.sh`会核对进程身份后停止本项目服务。重复执行安全，其他服务占用端口时会提示错误。PID和日志保存在 `.local-service/`，不加入Git。

课程音频已随静态文件保存在本地，播放不需要下载模型或调用语音服务。仍可用 `npm start` 在前台运行构建产物，或使用 `npm run dev` 开发并自动刷新。

`.openai/hosting.json`仅保留历史Sites身份；本地启动不使用这个配置。

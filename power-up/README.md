# Power Up 英语探索课堂

第一版 Power Up 1–3 配套动画课堂，React + TypeScript + Vite。线上地址：**https://molly-power-up.netlify.app/**。独立于数学小花园，本地端口为 **5174**。

## 开始使用

在仓库根目录运行：

```sh
./start-english.sh
./stop-english.sh
```

浏览器访问 http://127.0.0.1:5174/ 。启动时构建最新页面，服务在后台运行。数学课堂继续使用 `./start.sh`、`./stop.sh` 和 5173 端口。

首次安装和开发：

```sh
cd power-up
npm ci
npm run dev
npm test
npm run audio:check
npm run build
```

## 内容与使用

- 三册各含导入课和9个主单元，共30个单元、198节微课、238个代表性词条、198道练习、27篇原创短故事。
- 主单元包含词汇、两组语法、拼读、跨学科主题、故事和单元任务。
- 中英文分别预制配音，按照明确的语言标签顺序播放；英语以完整句子为音频边界，画面随实际音频时钟更新。不是浏览器实时朗读。
- 默认采用“整句连读”：每个完整句子使用一段完整合成的音频，以0.75倍速播放，保留句内语调和自然衔接，词组之间不额外插入停顿。Level 1也可切换“词组跟读”（有标注的词汇课）或“慢速跟读”（其他非拼读课），默认0.6倍速；有词组标注时保留完整句子并高亮当前词组及对应物品。拼读课继续逐词示范。慢放保持音调，普通话保持原速。停顿可选0.5、1、1.5、2秒，默认1秒；整句模式只在句间停顿，词组模式在词组间停顿，长句不额外延长。也可点击“我读好了，继续”。暂停可冻结倒计时，换课、换模式或重听会取消旧计时。
- 支持中英双语/英文练习、单词点读、单句循环、暂停/拖动/倍速、译文显示、跟读录音、练习反馈、复习和单元作品。
- 动画包括教室位置与单复数、家具方位、频率格子、作息钟面、进行中的动作、过去与将来时间线、比较关系、地图路线、方向、拼读波形及故事分镜等。
- 看过答案的题保留在复习列表，重新独立答对才计入掌握。课程完成以答对练习为准。
- 进度、已掌握单词和作品只保存在当前浏览器；录音只在当前页面内存中回听，关闭页面后清除，不上传。

### 教材版本与内容边界

| 册别 | 第一版学生书 ISBN |
| --- | --- |
| Power Up 1 | 9781108413749（用户已确认） |
| Power Up 2 | 9781108413763（依同系列官方书目选定） |
| Power Up 3 | 9781108413794（依同系列官方书目选定） |

依据剑桥公开第一版 **Scope and Sequence / Map of the book** 编排，各单元保留来源链接与页码。讲稿、例句、练习、故事和插画均为原创；词汇为代表性选编。未获得完整教材，尚不能保证全部词表、原课文、原书插图及页内练习的逐页覆盖。教材全文到位后可继续逐页核对补充。

本站的 AI 用于制作并固定课程讲稿与配音，不包含自由聊天、自动口语评分或实时生成答案。

## 配音制作

中文与数学课堂使用同一个本地 **Qwen3-TTS 1.7B CustomVoice / Serena** 模型，标准普通话成年女老师。复用 `../math-garden/.venv-tts` 和 `../math-garden/.cache/models/`，固定模型版本 `41d3337e8b7f2843a75841595fc14e4b9a7a4b96`。

英文使用本机 **macOS Daniel / en-GB** 英式英语音色，145词/分钟，提前生成WAV。它是本机系统音色，不是云端神经语音；如后续试听需要更自然的英文老师，可替换英语生成器并复用现有分段播放器。模型或音色本身不替代实际试听。

```sh
npm run audio:plan
npm run audio:english
npm run audio:chinese
npm run audio:check
npm run build
```

本机中文生成需要 Apple Silicon Metal GPU；在受限环境中需要授予本地GPU访问。英文生成需要本机语音服务访问，受限环境可能只产生空音频，脚本会拒绝安装空音频。

音频按语言与讲稿内容寻址；中英文使用独立目录和目录文件，避免并行生成时相互覆盖。生成可断点续跑。修改讲稿后重新导出计划，未改动的音频会复用。

`audio:check` 检查全部当前课程所需音频的语言、路径、SHA256、WAV格式、24kHz/单声道/16bit、时长和非静音，并生成供页面使用的精简 `audio-playback.json`。发布的文件直接播放，不需要API Key或运行模型。自动检查不能取代发音、语调和内容的人工试听。

## 代码位置

- `src/curriculum/level1.json` 至 `level3.json`：教材目录、原创双语讲稿、练习、拼读及来源。
- `src/App.tsx`：教材目录、课堂、练习、复习、足迹及单元作品。
- `src/Scene.tsx`、`src/ConceptScenes.tsx`：教学动画。
- `src/useNarrator.ts`：单一音频播放器、中英队列、倍速、循环和取消机制。
- `src/Recorder.tsx`：仅本页面使用的跟读录音。
- `src/progress.ts`：记录校验、掌握状态、复习及存储。
- `src/audio-en-catalog.json`、`src/audio-zh-catalog.json`：完整音频来源与校验信息。
- `scripts/check-render.mjs`：应用壳及全部微课的动画状态渲染检查。

## Netlify 部署

站点控制台：https://app.netlify.com/projects/molly-power-up/deploys 。站点标识与发布目录见 `netlify-site.json`，构建配置为 `power-up/netlify.toml`，不使用仓库根目录的数学站点配置。

GitHub `lrs3007/molly` 的 `main` 分支更新后自动部署。云端使用 Node 24，在 `power-up` 安装依赖并运行 `npm test && npm run build`，发布 `power-up/dist`。配套 WAV 已随源代码保存，云端仅验证音频并构建网页，不需要本机语音服务、模型或 API Key。

手动发布时务必显式指定英语站点 ID，避免误用仓库根目录关联的数学站点：

```sh
cd power-up
npm test && npm run build
netlify deploy --site accf38ab-ca89-48ed-b4cc-1236723b4d15 --dir dist --no-build --prod
```

首页每次访问重新验证，带哈希的应用资源长期缓存，音频缓存一小时。线上、本地及不同浏览器的学习记录各自独立保存。

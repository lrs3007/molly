# molly

Power Up 1–3 英语动画课堂位于 [power-up](./power-up/README.md)，线上地址：[Power Up 英语课堂](https://molly-power-up.netlify.app/)，本地地址 http://127.0.0.1:5174/ 。使用 `./start-english.sh` 启动、`./stop-english.sh` 关闭。

小学奥数教学网站位于 [math-garden](./math-garden/README.md)。

本地访问 http://127.0.0.1:5173/ ，线上地址：[数学小花园](https://molly-math-garden.netlify.app/)。

```sh
./start.sh  # 构建并在后台启动
./stop.sh   # 关闭服务
```

脚本可从任意目录执行，启动后可关闭终端。重复启动不会创建多个服务，关闭时只停止本项目的进程。日志位于 `math-garden/.local-service/server.log`。首次安装依赖时，在 `math-garden` 目录执行 `npm ci`。

## 线上部署与同步

英语课堂使用独立的 [Netlify 站点](https://app.netlify.com/projects/molly-power-up/deploys)和 `power-up/netlify.toml`，在 `power-up` 目录执行 `npm test && npm run build`，发布该目录下的 `dist`。两个站点分别构建，同步同一仓库的 `main` 分支。

部署状态：[Netlify 控制台](https://app.netlify.com/projects/molly-math-garden/deploys)。

Netlify 使用仓库根目录的 `netlify.toml`：在 `math-garden` 目录安装依赖，使用 Node 24 执行 `npm test && npm run build`，发布 `dist`，包含配套图片和音频。

本机修改完成后，在仓库根目录提交并推送到 GitHub 的 `main` 分支，即会触发 Netlify 自动构建和发布：

```sh
git add -A
git commit -m "更新课程内容"
git push origin main
```

本机尚未提交、推送的修改仅影响本地预览。线上发布需要等待 Netlify 构建成功；测试或构建失败时继续保留上一版网站。本机学习记录保存在浏览器中，线上与本机地址的学习记录分别保存。

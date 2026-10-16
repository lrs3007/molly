# molly

小学奥数教学网站位于 [math-garden](./math-garden/README.md)。

默认仅在本地运行，访问 http://127.0.0.1:5173/ 。后续修改无需发布到托管平台。

```sh
./start.sh  # 构建并在后台启动
./stop.sh   # 关闭服务
```

脚本可从任意目录执行，启动后可关闭终端。重复启动不会创建多个服务，关闭时只停止本项目的进程。日志位于 `math-garden/.local-service/server.log`。首次安装依赖时，在 `math-garden` 目录执行 `npm ci`。

#!/bin/bash
set -euo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
STATE_DIR="$PROJECT_DIR/.local-service"
PID_FILE="$STATE_DIR/server.pid"
LOG_FILE="$STATE_DIR/server.log"
URL="http://127.0.0.1:5173/"
VITE_BIN="$PROJECT_DIR/node_modules/vite/bin/vite.js"
export PATH="$PATH:/usr/sbin"

for tool in lsof ps; do
  command -v "$tool" >/dev/null || { echo "缺少命令：$tool" >&2; exit 1; }
done

listeners() { lsof -nP -t -iTCP:5173 -sTCP:LISTEN 2>/dev/null | sort -u || true; }
is_ours() {
  local pid="$1" command_line workdir
  [[ "$pid" =~ ^[0-9]+$ ]] && [[ "$pid" -gt 1 ]] || return 1
  command_line="$(ps -p "$pid" -o args= 2>/dev/null)" || return 1
  case "$command_line" in
    *vite*preview*--host\ 127.0.0.1*--port\ 5173*) ;;
    *) return 1 ;;
  esac
  workdir="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')"
  [[ "$workdir" == "$PROJECT_DIR" ]]
}

case "${1:-}" in
  start)
    for tool in node npm curl; do
      command -v "$tool" >/dev/null || { echo "缺少 $tool，请先安装 Node.js 和系统工具。" >&2; exit 1; }
    done
    mkdir -p "$STATE_DIR"
    existing="$(listeners)"
    if [[ -n "$existing" ]]; then
      if is_ours "$existing"; then
        printf '%s\n' "$existing" > "$PID_FILE"
        echo "数学小花园已经运行：$URL"
        exit 0
      fi
      echo "5173 端口已被其他服务占用，未改动该服务。" >&2
      exit 1
    fi
    if [[ -f "$PID_FILE" ]] && is_ours "$(cat "$PID_FILE")"; then
      echo "服务进程仍在启动，请稍后再试；日志：$LOG_FILE" >&2
      exit 1
    fi
    [[ -f "$VITE_BIN" ]] || { echo "请先在 $PROJECT_DIR 执行 npm ci。" >&2; exit 1; }
    cd "$PROJECT_DIR"
    echo "构建最新课程页面……"
    npm run build
    node "$PROJECT_DIR/scripts/launch-local-server.mjs" "$VITE_BIN" "$PID_FILE" "$LOG_FILE"
    pid="$(cat "$PID_FILE")"
    for ((attempt=0; attempt<40; attempt++)); do
      if ! kill -0 "$pid" 2>/dev/null; then break; fi
      if [[ "$(listeners)" == "$pid" ]] && curl --noproxy '*' --max-time 1 --fail --silent --output /dev/null "$URL"; then
        echo "数学小花园已在后台启动：$URL"
        echo "日志：$LOG_FILE"
        echo "关闭：$PROJECT_DIR/../stop.sh"
        exit 0
      fi
      sleep 0.25
    done
    if is_ours "$pid"; then kill "$pid" 2>/dev/null || true; fi
    rm -f "$PID_FILE"
    echo "服务启动失败，日志如下：" >&2
    tail -n 20 "$LOG_FILE" >&2
    exit 1
    ;;
  stop)
    candidates="$(listeners)"
    if [[ -f "$PID_FILE" ]]; then
      candidates="$(printf '%s\n%s\n' "$candidates" "$(cat "$PID_FILE")" | sed '/^$/d' | sort -u)"
    fi
    stopped=0
    for pid in $candidates; do
      if ! is_ours "$pid"; then continue; fi
      kill "$pid" 2>/dev/null || true
      for ((attempt=0; attempt<20; attempt++)); do
        if ! is_ours "$pid"; then break; fi
        sleep 0.25
      done
      if is_ours "$pid"; then
        echo "进程 $pid 尚未退出，请检查日志：$LOG_FILE" >&2
        exit 1
      fi
      stopped=1
    done
    rm -f "$PID_FILE"
    if [[ "$stopped" == 1 ]]; then echo "数学小花园已关闭。"; else echo "数学小花园当前未运行。"; fi
    ;;
  *) echo "用法：$0 start|stop" >&2; exit 1 ;;
esac

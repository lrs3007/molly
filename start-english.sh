#!/bin/bash
set -euo pipefail
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
exec /bin/bash "$ROOT_DIR/power-up/scripts/local-service.sh" start

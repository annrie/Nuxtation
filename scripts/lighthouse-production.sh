#!/bin/bash

# 本番環境Lighthouse測定スクリプト
# Usage:
#   ./scripts/lighthouse-production.sh                  # 標準測定（主要9ページ、各1回）
#   ./scripts/lighthouse-production.sh --quick          # 簡易測定（トップページのみ、1回）
#   ./scripts/lighthouse-production.sh --accurate       # 正確な測定（主要9ページ、各3回）
#   ./scripts/lighthouse-production.sh --full           # 全ページ測定（実在blogページ、各1回）
#   ./scripts/lighthouse-production.sh --quick --runs 3 # カスタム測定回数

set -e

# カラー定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 測定モード判定
MODE="standard"
NUM_RUNS=1  # デフォルトは1回

if [ "$1" = "--quick" ]; then
  MODE="quick"
  NUM_RUNS=1
elif [ "$1" = "--full" ]; then
  MODE="full"
  NUM_RUNS=1
elif [ "$1" = "--accurate" ]; then
  MODE="standard"
  NUM_RUNS=3  # 正確な測定は3回実行
fi

# 測定回数の引数対応
if [ "$2" = "--runs" ] && [ -n "$3" ]; then
  NUM_RUNS=$3
fi

# ベースURL
BASE_URL="https://nuxtation.phantomoon.com"

# Chrome パス設定（Puppeteer用）
export PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Lighthouse バイナリパス（.pnpm から動的解決。バージョン/peer接尾辞に依存しない）
LIGHTHOUSE_BIN="$(find node_modules/.pnpm -maxdepth 1 -type d -name 'lighthouse@*' 2>/dev/null | head -1)/node_modules/lighthouse/cli/index.js"
if [ ! -f "$LIGHTHOUSE_BIN" ]; then
  echo "エラー: lighthouse が見つかりません。'pnpm add -D @lhci/cli' を実行してください。" >&2
  exit 1
fi

# 測定対象URLの定義
case $MODE in
  quick)
    URLS=("$BASE_URL/")
    MODE_NAME="簡易測定（トップページのみ）"
    ;;
  full)
    # nuxtation は blog 専用サイト（biblio/jenre のコンテンツ・ルートは存在しない）。
    # 実在する blog タグ(docus/nuxt)と記事のみを対象にする。
    URLS=(
      "$BASE_URL/"
      "$BASE_URL/blog"
      "$BASE_URL/blog/tags/docus"
      "$BASE_URL/blog/tags/nuxt"
      "$BASE_URL/blog/nuxt-link-card-implementation"
    )
    MODE_NAME="全ページ測定（${#URLS[@]}ページ）"
    ;;
  *)
    URLS=(
      "$BASE_URL/"
      "$BASE_URL/blog"
      "$BASE_URL/blog/tags/docus"
      "$BASE_URL/blog/nuxt-link-card-implementation"
    )
    MODE_NAME="標準測定（主要${#URLS[@]}ページ）"
    ;;
esac

# 出力ディレクトリ（自動インクリメント）
REPORT_BASE="lighthouse-reports"
NEXT_NUM=1

# 最新のレポート番号を取得
if [ -d "$REPORT_BASE" ]; then
  LAST_NUM=$(ls -d "$REPORT_BASE"/*/ 2>/dev/null | sed 's|.*/\([0-9]*\)/|\1|' | sort -n | tail -1)
  if [ -n "$LAST_NUM" ]; then
    NEXT_NUM=$((LAST_NUM + 1))
  fi
fi

OUTPUT_DIR="$REPORT_BASE/$NEXT_NUM"
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Lighthouse測定開始 (本番環境)${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "測定モード: ${GREEN}$MODE_NAME${NC}"
echo -e "出力先: ${GREEN}$OUTPUT_DIR${NC}"
echo ""

# 各URLを測定
TOTAL_URLS=${#URLS[@]}
CURRENT=0

for URL in "${URLS[@]}"; do
  CURRENT=$((CURRENT + 1))

  # URLからファイル名を生成（/を-に変換、先頭の/は削除）
  URL_PATH="${URL#$BASE_URL}"
  if [ -z "$URL_PATH" ]; then
    FILENAME="index"
  else
    FILENAME=$(echo "$URL_PATH" | sed 's|^/||' | sed 's|/|-|g')
  fi

  echo -e "${BLUE}[$CURRENT/$TOTAL_URLS]${NC} ${YELLOW}$URL${NC}"

  # モバイル測定（複数回実行）
  echo -e "  📱 モバイル測定中（${NUM_RUNS}回）..."
  for RUN in $(seq 1 $NUM_RUNS); do
    if [ $NUM_RUNS -gt 1 ]; then
      echo -e "     実行 $RUN/$NUM_RUNS..."
    fi

    if [ $RUN -eq 1 ]; then
      OUTPUT_SUFFIX=""
    else
      OUTPUT_SUFFIX="-run$RUN"
    fi

    node "$LIGHTHOUSE_BIN" "$URL" \
      --output=html \
      --output=json \
      --output-path="$OUTPUT_DIR/mobile-$FILENAME$OUTPUT_SUFFIX" \
      --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
      --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --quiet
  done

  # デスクトップ測定（複数回実行）
  echo -e "  💻 デスクトップ測定中（${NUM_RUNS}回）..."
  for RUN in $(seq 1 $NUM_RUNS); do
    if [ $NUM_RUNS -gt 1 ]; then
      echo -e "     実行 $RUN/$NUM_RUNS..."
    fi

    if [ $RUN -eq 1 ]; then
      OUTPUT_SUFFIX=""
    else
      OUTPUT_SUFFIX="-run$RUN"
    fi

    node "$LIGHTHOUSE_BIN" "$URL" \
      --preset=desktop \
      --output=html \
      --output=json \
      --output-path="$OUTPUT_DIR/desktop-$FILENAME$OUTPUT_SUFFIX" \
      --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
      --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --quiet
  done

  echo -e "  ${GREEN}✓ 完了${NC}"
  echo ""
done

# スコア抽出（JSONファイルから）
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}測定結果サマリー${NC}"
echo -e "${BLUE}================================================${NC}"

if command -v jq &> /dev/null; then
  # 各URLのスコアを表示
  for URL in "${URLS[@]}"; do
    URL_PATH="${URL#$BASE_URL}"
    if [ -z "$URL_PATH" ]; then
      FILENAME="index"
      DISPLAY_NAME="トップページ"
    else
      FILENAME=$(echo "$URL_PATH" | sed 's|^/||' | sed 's|/|-|g')
      DISPLAY_NAME="$URL_PATH"
    fi

    echo -e "${YELLOW}$DISPLAY_NAME${NC}"

    # モバイル
    if [ -f "$OUTPUT_DIR/mobile-$FILENAME.report.json" ]; then
      MOBILE_PERF=$(jq -r '.categories.performance.score * 100 | floor' "$OUTPUT_DIR/mobile-$FILENAME.report.json" 2>/dev/null || echo "N/A")
      MOBILE_A11Y=$(jq -r '.categories.accessibility.score * 100 | floor' "$OUTPUT_DIR/mobile-$FILENAME.report.json" 2>/dev/null || echo "N/A")
      echo "  📱 Mobile - Perf: $MOBILE_PERF% | A11y: $MOBILE_A11Y%"
    fi

    # デスクトップ
    if [ -f "$OUTPUT_DIR/desktop-$FILENAME.report.json" ]; then
      DESKTOP_PERF=$(jq -r '.categories.performance.score * 100 | floor' "$OUTPUT_DIR/desktop-$FILENAME.report.json" 2>/dev/null || echo "N/A")
      DESKTOP_A11Y=$(jq -r '.categories.accessibility.score * 100 | floor' "$OUTPUT_DIR/desktop-$FILENAME.report.json" 2>/dev/null || echo "N/A")
      echo "  💻 Desktop - Perf: $DESKTOP_PERF% | A11y: $DESKTOP_A11Y%"
    fi

    echo ""
  done
else
  echo -e "${YELLOW}※ jqがインストールされていないため、スコア表示をスキップ${NC}"
  echo -e "  HTMLレポートをブラウザで確認してください"
fi

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✓ すべての測定が完了しました${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "レポート保存先: ${GREEN}$OUTPUT_DIR/${NC}"
echo -e "生成ファイル数: ${GREEN}$((TOTAL_URLS * 2 * 2))ファイル${NC} (各URL × 2デバイス × 2形式)"
echo ""
echo -e "ブラウザで確認:"
echo -e "  ${BLUE}open $OUTPUT_DIR/${NC}"

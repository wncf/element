#!/usr/bin/env sh
#
# 发布 hzq-ui 到公司私有 registry。
#
# 用法：
#   sh build/release.sh <version> [--tag <dist-tag>]
#
# 例：
#   sh build/release.sh 1.0.1
#   sh build/release.sh 1.1.0-beta.1 --tag beta
#
# 与官方 Element 的发版脚本不同，这里不做 master/dev 分支合并，
# 也不推送到 eleme 远端 —— 只做「校验 → 构建 → 发布」。
set -e

REGISTRY="http://npm.27yn.cn/"

VERSION="$1"
# 可选：--tag beta 之类的 dist-tag
DIST_TAG=""
if [ "$2" = "--tag" ] && [ -n "$3" ]; then
  DIST_TAG="$3"
fi

if [ -z "$VERSION" ]; then
  echo "用法: sh build/release.sh <version> [--tag <dist-tag>]" >&2
  echo "例:   sh build/release.sh 1.0.1" >&2
  exit 1
fi

# 版本号格式校验，避免把分支名之类的东西传进来
if ! echo "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'; then
  echo "版本号格式不正确: $VERSION（应形如 1.0.1 或 1.1.0-beta.1）" >&2
  exit 1
fi

echo "准备发布 hzq-ui@$VERSION 到 $REGISTRY"

# 工作区必须干净，避免把未提交的改动打进包里
if [ -n "$(git status --porcelain)" ]; then
  echo "工作区有未提交的改动，请先提交或 stash。" >&2
  exit 1
fi

# 版本号必须和 package.json 一致：先改好版本再跑本脚本，
# 这样「发布的版本」和「代码里的版本」不会错位
CURRENT=$(node -p "require('./package.json').version")
if [ "$CURRENT" != "$VERSION" ]; then
  echo "package.json 里的版本是 $CURRENT，与传入的 $VERSION 不一致。" >&2
  echo "请先执行: npm version $VERSION --no-git-tag-version" >&2
  exit 1
fi

# 构建完整产物（clean → build:file → lint → 各 webpack 配置 → utils → umd → theme）
echo "构建中..."
npm run dist

# 构建后确认关键产物存在，避免发出一个残缺的包
for f in lib/hzq-ui.common.js lib/index.js lib/theme-chalk/index.css types/index.d.ts; do
  if [ ! -e "$f" ]; then
    echo "构建产物缺失: $f" >&2
    exit 1
  fi
done

# SSR 冒烟测试：确认构建产物能被 require
echo "SSR 冒烟测试..."
node test/ssr/require.test.js

# 打印将要发布的内容，便于人工核对
echo ""
echo "即将发布的内容："
npm pack --dry-run 2>&1 | tail -20
echo ""

read -r -p "确认发布 hzq-ui@$VERSION ？(y/n) " REPLY
if [ "$REPLY" != "y" ] && [ "$REPLY" != "Y" ]; then
  echo "已取消。"
  exit 0
fi

if [ -n "$DIST_TAG" ]; then
  echo "发布 hzq-ui@$VERSION (dist-tag: $DIST_TAG)..."
  npm publish --registry "$REGISTRY" --tag "$DIST_TAG"
else
  echo "发布 hzq-ui@$VERSION..."
  npm publish --registry "$REGISTRY"
fi

echo ""
echo "发布完成: hzq-ui@$VERSION"

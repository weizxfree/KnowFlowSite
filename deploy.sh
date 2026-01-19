#!/bin/bash

# KnowFlow 文档站点部署脚本
# 使用方法: ./deploy.sh
# 执行时只需输入一次服务器密码（使用 SSH ControlMaster 复用连接）

set -e

echo "🚀 开始部署 KnowFlow 文档站点..."

# ============ 配置区域 ============
SERVER_HOST="139.224.59.152"
SERVER_PORT="22"
SERVER_USER="root"
REMOTE_PATH="/www/wwwroot/www.knowflowchat.cn"
BUILD_DIR="build"
# ============ 配置区域结束 ============

# SSH ControlMaster 配置（用于连接复用，只需输入一次密码）
CONTROL_PATH="/tmp/ssh-deploy-$$"
SSH_OPTS="-o ControlMaster=auto -o ControlPath=$CONTROL_PATH -o ControlPersist=60 -o StrictHostKeyChecking=no -p $SERVER_PORT"

# 清理函数：脚本退出时关闭 SSH 连接
cleanup() {
    if [ -S "$CONTROL_PATH" ]; then
        ssh $SSH_OPTS -O exit "$SERVER_USER@$SERVER_HOST" 2>/dev/null || true
    fi
}
trap cleanup EXIT

# 检查是否安装了 sshpass
if command -v sshpass &> /dev/null; then
    USE_SSHPASS=true
    echo "请输入服务器密码:"
    read -s SERVER_PASSWORD
    echo ""
else
    USE_SSHPASS=false
fi

# 1. 构建项目
echo "📦 正在构建项目..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ 构建失败: $BUILD_DIR 目录不存在"
    exit 1
fi

echo "✅ 构建完成"

# 定义 SSH 和 SCP 命令的封装函数
run_ssh() {
    if [ "$USE_SSHPASS" = true ]; then
        sshpass -p "$SERVER_PASSWORD" ssh $SSH_OPTS "$SERVER_USER@$SERVER_HOST" "$@"
    else
        ssh $SSH_OPTS "$SERVER_USER@$SERVER_HOST" "$@"
    fi
}

run_scp() {
    if [ "$USE_SSHPASS" = true ]; then
        sshpass -p "$SERVER_PASSWORD" scp -o ControlPath="$CONTROL_PATH" -o StrictHostKeyChecking=no -r -P "$SERVER_PORT" "$@"
    else
        scp -o ControlPath="$CONTROL_PATH" -r -P "$SERVER_PORT" "$@"
    fi
}

# 2. 测试服务器连接（首次连接，输入密码后会复用）
echo "🔗 测试服务器连接..."
echo "💡 提示: 只需输入一次密码，后续操作将自动复用连接"
if ! run_ssh "echo '连接成功'" > /dev/null 2>&1; then
    echo "❌ 无法连接到服务器，请检查密码和网络连接"
    exit 1
fi

echo "✅ 服务器连接正常（后续操作无需再输入密码）"

# 3. 创建远程目录
echo "📁 准备远程目录..."
run_ssh "mkdir -p $REMOTE_PATH"

# 4. 清空远程目录
echo "🗑️  清空远程目录..."
run_ssh "rm -rf $REMOTE_PATH/*"

echo "✅ 远程目录已清空"

# 5. 上传文件到服务器
echo "📤 正在上传文件到服务器..."
run_scp "$BUILD_DIR"/* "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH/"

if [ $? -eq 0 ]; then
    echo "✅ 文件上传完成"
else
    echo "❌ 文件上传失败"
    exit 1
fi

# 6. 设置文件权限
echo "🔐 设置文件权限..."
run_ssh "chmod -R 755 $REMOTE_PATH"

echo ""
echo "🎉 部署完成！"
echo "📍 服务器: $SERVER_HOST"
echo "📁 部署路径: $REMOTE_PATH"
echo "🌐 访问地址: http://www.knowflowchat.cn"
echo ""
echo "💡 提示: 如果网站未更新，请检查 Nginx 配置或清除浏览器缓存"

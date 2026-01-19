# 部署到阿里云服务器

本文档说明如何将 KnowFlow 文档站点一键部署到阿里云服务器。

## 服务器配置信息

- **服务器 IP**: 139.224.59.152
- **SSH 端口**: 22
- **SSH 用户**: root
- **部署路径**: /www/wwwroot/www.knowflowchat.cn
- **访问地址**: http://www.knowflowchat.cn

## 部署方式

### 方式一：使用 npm 命令（推荐）

```bash
npm run deploy:aliyun
```

### 方式二：直接执行脚本

```bash
./deploy.sh
```

## 部署流程

脚本会自动执行以下步骤：

1. 📦 构建项目 (`npm run build`)
2. 🔗 测试服务器连接
3. 📁 创建/准备远程目录
4. 📤 使用 rsync 同步文件到服务器
5. 🔐 设置文件权限 (755)

## 密码输入

脚本支持两种密码输入方式：

### 1. 交互式输入（默认）

执行脚本时会提示输入密码，需要输入 3-4 次：
- 测试连接时 1 次
- 创建目录时 1 次
- 上传文件时 1 次
- 设置权限时 1 次

### 2. 使用 sshpass（推荐，只需输入 1 次）

安装 sshpass 后，只需在开始时输入一次密码：

**macOS 安装**:
```bash
brew install hudochenkov/sshpass/sshpass
```

**Linux 安装**:
```bash
# Ubuntu/Debian
sudo apt-get install sshpass

# CentOS/RHEL
sudo yum install sshpass
```

## 首次部署

首次部署时，可能需要：

1. 确认 SSH 主机指纹（输入 `yes`）
2. 检查服务器防火墙是否开放 SSH 端口（22）
3. 确认 Nginx 配置指向正确的目录

## Nginx 配置示例

确保 Nginx 配置文件指向部署目录：

```nginx
server {
    listen 80;
    server_name www.knowflowchat.cn;

    root /www/wwwroot/www.knowflowchat.cn;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

重启 Nginx：
```bash
nginx -t && nginx -s reload
```

## 常见问题

### Q1: 提示 "Permission denied"

**原因**: SSH 密码错误或用户权限不足

**解决**:
- 检查密码是否正确
- 确认用户是否有目标目录的写权限

### Q2: 提示 "rsync: command not found"

**原因**: 本地或服务器未安装 rsync

**解决**:
```bash
# macOS
brew install rsync

# Linux
sudo apt-get install rsync  # Ubuntu/Debian
sudo yum install rsync      # CentOS/RHEL
```

### Q3: 网站未更新

**原因**: 浏览器缓存或 CDN 缓存

**解决**:
- 清除浏览器缓存（Ctrl+Shift+R 强制刷新）
- 如果使用 CDN，清除 CDN 缓存

### Q4: 部署后显示 403 或 404

**原因**: Nginx 配置错误或文件权限问题

**解决**:
- 检查 Nginx root 路径是否正确
- 确认文件权限：`ls -la /www/wwwroot/www.knowflowchat.cn`
- 查看 Nginx 错误日志：`tail -f /var/log/nginx/error.log`

## 安全建议

### 1. 使用 SSH 密钥认证（推荐）

密钥认证比密码更安全，且无需每次输入密码：

```bash
# 1. 生成 SSH 密钥（如果还没有）
ssh-keygen -t rsa -b 4096

# 2. 复制公钥到服务器
ssh-copy-id -p 22 root@139.224.59.152

# 3. 测试连接（无需密码）
ssh root@139.224.59.152
```

配置密钥后，修改 `deploy.sh` 脚本，删除密码相关代码即可。

### 2. 修改 SSH 默认端口

建议将 SSH 端口从 22 改为其他端口（如 2222），减少暴力破解风险。

### 3. 配置防火墙

只开放必要的端口（SSH、HTTP、HTTPS）。

## 自动化部署（可选）

如果需要更高级的自动化部署，可以考虑：

1. **GitHub Actions**: 代码推送后自动部署
2. **Jenkins**: 持续集成/持续部署
3. **Docker**: 容器化部署

## 修改配置

如需修改服务器配置，编辑 `deploy.sh` 文件的配置区域：

```bash
# ============ 配置区域 ============
SERVER_HOST="139.224.59.152"
SERVER_PORT="22"
SERVER_USER="root"
REMOTE_PATH="/www/wwwroot/www.knowflowchat.cn"
BUILD_DIR="build"
# ============ 配置区域结束 ============
```

## 联系支持

如遇到部署问题，请联系技术支持团队。

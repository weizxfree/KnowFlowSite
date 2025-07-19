---
sidebar_position: 2
---

# 📦 安装指南

本指南将帮助您完成 KnowFlow 的完整部署过程，包括环境准备、服务配置和系统启动。

:::info 部署概览
支持 **Docker Compose** 和**源码部署**两种方式，推荐使用 Docker Compose 进行生产环境部署。
:::

## 💻 环境要求

### 硬件配置

| 组件 | 最低要求 | 推荐配置 | 说明 |
|------|---------|---------|------|
| **CPU** | ≥ 4 cores (x86) | ≥ 8 cores | 影响并发处理能力 |
| **内存** | ≥ 16 GB RAM | ≥ 32 GB | 大文档处理需要更多内存 |
| **存储** | ≥ 50 GB | ≥ 100 GB | 包含系统、数据和日志 |
| **GPU** | 可选 | NVIDIA GPU | 显著提升 OCR 性能 |

### 软件依赖

| 软件 | 版本要求 | 用途 | 必需性 |
|------|---------|------|--------|
| **Docker** | ≥ 24.0.0 | 容器运行时 | ✅ 必需 |
| **Docker Compose** | ≥ v2.26.1 | 多容器编排 | ✅ 必需 |
| **Git** | 最新版本 | 源码下载 | ✅ 必需 |
| **nvidia-container-toolkit** | 最新版本 | GPU 加速 | 🔶 可选 |
| **Python** | 3.8+ | 源码运行 | 🔶 源码部署时需要 |
| **Node.js** | 16+ | 前端开发 | 🔶 前端开发时需要 |

:::tip GPU 加速配置
如需使用 GPU 加速，请确保已正确安装 `nvidia-container-toolkit`。
:::

## 🚀 部署步骤

### 📥 1. 下载源代码

```bash
git clone https://github.com/weizxfree/KnowFlow.git
cd KnowFlow
```

### ⚙️ 2. 运行 MinerU 服务

MinerU 是 KnowFlow 的核心 OCR 引擎，提供两个版本供选择：

#### 🌟 完整版（推荐）

包含所有功能，支持完整的 VLM 功能和所有后端类型：

```bash
docker run --rm -d --gpus=all \
  --shm-size=32g \
  -p 8888:8888 -p 30000:30000 \
  --name mineru-api \
  zxwei/mineru-api-full:2.1.0
```

#### 📦 基础版

仅包含基础功能，主要支持 pipeline 后端：

```bash
docker run --rm -d --gpus=all \
  --shm-size=32g \
  -p 8888:8888 \
  --name mineru-api \
  zxwei/mineru-api:2.1.0
```

#### 📋 镜像说明

| 镜像版本 | 功能特点 | 适用场景 |
|---------|---------|----------|
| `zxwei/mineru-api-full:2.1.0` | 包含完整的 VLM 功能，支持所有后端类型 | 生产环境，需要完整功能 |
| `zxwei/mineru-api:2.1.0` | 基础版本，主要支持 pipeline 后端 | 测试环境，基础功能验证 |

:::warning 注意事项
- 如果没有 GPU，请移除 `--gpus=all` 参数
- 确保端口 8888 和 30000（完整版）未被占用
- `--shm-size=32g` 参数用于提供足够的共享内存
:::

### 🔧 3. 执行安装脚本

运行自动配置脚本：

```bash
./scripts/install.sh
```

#### ✨ 自动配置功能

脚本将自动完成以下配置：

✅ **自动检测本机 IP 地址**  
✅ **自动创建 `.env` 配置文件**（如果不存在）  
✅ **智能配置选项**：如果 `.env` 文件已存在，提供保留或重新生成选项  
✅ **预填充配置项**：自动填写 HOST_IP、ES_HOST 等配置项  

### 📝 4. 配置环境变量

安装脚本会创建 `.env` 文件模板，您需要手动配置以下关键参数：

```bash
# RAGFlow 服务地址（必须手动填写）
# IP 一般填写宿主机的 IP，端口可写 RAGFlow 的 9380 端口
RAGFLOW_BASE_URL=http://检测到的IP:9380

# 示例：
# RAGFLOW_BASE_URL=http://192.168.1.100:9380
```

:::tip 配置提示
- 将 `检测到的IP` 替换为您的实际服务器 IP 地址
- 端口号根据实际 RAGFlow 服务端口调整
- 其他配置项已由脚本自动填写，通常无需修改
:::

### 🔗 5. 配置 MinerU 服务地址

编辑 MinerU 配置文件：

```bash
vim /opt/KnowFlow-1.1.5/server/services/config/settings.yaml
```

找到 `mineru` 配置段落，更新服务地址：

```yaml
mineru:
  fastapi:
    # 将 IP 地址替换为本机实际 IP
    url: "http://10.0.0.82:8888"
  vlm:
    sglang:
      # 如果使用完整版镜像，配置 SGLang 服务地址
      server_url: "http://10.0.0.82:30000"
```

:::warning 重要配置
- 将 `10.0.0.82` 替换为您的实际服务器 IP 地址
- 确保 IP 地址与 MinerU 容器运行的主机 IP 一致
- 端口 8888 对应 MinerU API 服务
- 端口 30000 仅在使用完整版镜像时需要配置
:::

### 🎯 6. 启动 KnowFlow 服务

使用 Docker Compose 启动所有服务：

```bash
docker compose up -d
```

#### 🔍 服务启动验证

检查服务状态：

```bash
# 查看所有容器状态
docker compose ps

# 查看服务日志
docker compose logs -f
```

### 🌐 7. 访问系统

服务启动完成后，通过以下地址访问：

| 界面类型 | 访问地址 | 用途说明 |
|---------|---------|----------|
| **管理界面** | `http://服务器IP:8081` | 系统管理和用户配置 |
| **用户界面** | `http://服务器IP:80` | 知识库操作和问答 |

:::tip 首次访问
- 管理界面用于系统管理和用户配置
- 用户界面用于日常的知识库操作和问答
- 首次登录请使用默认管理员账号
:::

## 💻 源码运行

:::warning 开发环境
源码运行方式主要用于开发和调试，生产环境建议使用 Docker Compose 部署。
:::

### 🔧 前置条件

参照 Docker Compose 使用方式的前面步骤，确保 MinerU 服务已启动。

| 组件 | 版本要求 | 检查命令 |
|------|---------|----------|
| **Python** | 3.8+ | `python3 --version` |
| **Node.js** | 16+ | `node --version` |
| **pnpm** | 最新版本 | `pnpm --version` |

### 🚀 启动后端

#### 1️⃣ **安装依赖**
```bash
cd management/server
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

#### 2️⃣ **开启文件格式转化服务**（可选）

:::info 格式支持
支持 PDF 以外文件格式需要开启此服务，如 Word、Excel、PPT 等。
:::

```bash
docker run -d -p 3000:3000 gotenberg/gotenberg:8
```

#### 3️⃣ **启动后端服务**
```bash
python3 app.py
```

:::tip 后端服务说明
后端服务启动后，请记录控制台显示的端口号，前端配置时需要用到。
:::

### 🎨 启动前端

#### 1️⃣ **安装依赖**
```bash
cd management/web
pnpm i
```

#### 2️⃣ **启动前端程序**
```bash
pnpm dev
```

#### 3️⃣ **访问系统**

| 服务类型 | 访问地址 | 说明 |
|---------|---------|------|
| **开发服务器** | 控制台显示的地址 | 通常为 `http://localhost:5173` |
| **热重载** | ✅ 支持 | 修改代码自动刷新 |

:::tip 开发提示
- 前端支持热重载，修改代码后自动刷新
- 确保后端服务已启动，否则前端无法正常工作
- 开发环境下可以实时查看日志和调试信息
:::

## MinerU 本地调试（开发环境）

如果您需要在本地环境进行开发调试，可以直接运行 MinerU 服务：

### 1. 安装 Python 依赖

```bash
# 注意：zsh 需要用引号包围方括号
pip install "mineru[core]" fastapi uvicorn python-multipart
```

### 2. 设置环境变量

```bash
export MINERU_DEVICE_MODE=cpu
export MINERU_MODEL_SOURCE=modelscope
```

### 3. 启动本地服务

```bash
cd web_api
python app.py
```

### 4. 配置 settings.yaml

使用本地 MinerU 服务时，需要修改 `server/services/config/settings.yaml` 中的服务地址：

```yaml
mineru:
  fastapi:
    # 本地开发服务地址
    url: "http://localhost:8888"
  
  vlm:
    sglang:
      # 本地SGLang服务地址（如果使用vlm-sglang-client后端）
      server_url: "http://localhost:30000"
```

:::tip 提示
本地调试模式适合开发环境，生产环境建议使用Docker方式部署。
:::

## 配置说明

### 图文混排功能配置

图文混排功能的聊天助手提示词很重要，配置不正确会无法显示图片。模板如下：

```
请参考{knowledge}内容回答用户问题。
如果知识库内容包含图片，请在回答中包含图片URL。
注意这个 html 格式的 URL 是来自知识库本身，URL 不能做任何改动。
请确保回答简洁、专业，将图片自然地融入回答
```

## 故障排除

### 常见问题

#### MinerU 服务无法启动

**可能原因**：
- 端口被占用
- GPU 驱动问题
- 内存不足

**解决方案**：
```bash
# 检查端口占用
netstat -tlnp | grep 8888

# 检查 GPU 状态（如果使用 GPU）
nvidia-smi

# 检查容器日志
docker logs mineru-api
```

#### 配置文件路径错误

**问题**：找不到 `settings.yaml` 文件

**解决方案**：
```bash
# 查找配置文件位置
find . -name "settings.yaml" -type f

# 或者使用相对路径
vim server/services/config/settings.yaml
```

#### 服务无法访问

**可能原因**：
- 防火墙阻止
- IP 地址配置错误
- 服务未正常启动

**解决方案**：
```bash
# 检查防火墙状态
sudo ufw status

# 开放必要端口
sudo ufw allow 8081
sudo ufw allow 80

# 检查服务状态
docker compose ps
```

### 性能优化建议

1. **使用 GPU 加速**：显著提升文档处理速度
2. **增加内存**：处理大文件时避免内存不足
3. **使用 SSD 存储**：提升 I/O 性能
4. **网络优化**：确保稳定的网络连接

### 日志查看

```bash
# 查看所有服务日志
docker compose logs

# 查看特定服务日志
docker compose logs [服务名]

# 实时查看日志
docker compose logs -f
```

## 下一步

部署完成后，建议按以下顺序进行配置：

1. [用户管理](./产品使用/user-management) - 创建和管理用户账号
2. [文件上传](./产品使用/file-upload) - 上传文档到系统
3. [知识库构建](./产品使用/knowledge-base) - 创建和配置知识库
4. [解析内容查看](./产品使用/content-review) - 验证文档解析效果

如遇到问题，请参考 [常见问题](./常见问题/installation-faq) 获取帮助。

## 高级配置

### Docker 容器启动失败
   - 检查 Docker 和 Docker Compose 版本
   - 确保端口未被占用
   - 检查系统资源是否充足

### MinerU 服务连接失败
   - 检查 MinerU 容器是否正常运行
   - 验证网络连接和端口配置
   - 查看 settings.yaml 配置是否正确

3. **前端页面无法访问**
   - 检查防火墙设置
   - 确认服务端口是否正确开放
   - 查看浏览器控制台错误信息

### 获取帮助

如果您遇到问题，可以通过以下方式获取帮助：

- [GitHub Issues](https://github.com/weizxfree/KnowFlow/issues)
- [GitHub Discussions](https://github.com/weizxfree/KnowFlow/discussions)
- 查看项目 README 文档

## 下一步

安装完成后，您可以：

1. 查看[用户指南](./user-guide)了解如何使用系统
2. 阅读[配置文档](./configuration)进行高级配置
3. 参考[开发指南](./development)进行二次开发
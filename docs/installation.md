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

### ⚙️ 2. 部署 MinerU 服务

MinerU 是 KnowFlow 的核心文档解析引擎，基于 MinerU v2.1.11，支持多种部署模式：

#### 🌟 完整版部署（同时支持 Pipline 和 VLM）

包含所有功能，支持 VLM 推理和多种后端模式：

**GPU 环境：**
```bash
docker run -d --gpus all \
  --name mineru-api \
  -p 8888:8888 \
  -p 30000:30000 \
  --restart unless-stopped \
  --shm-size=32g \
  -e MINERU_DEVICE_MODE=gpu \
  -e MINERU_MODEL_SOURCE=local \
  -e SGLANG_MEM_FRACTION_STATIC=0.8 \
  zxwei/mineru-api-full:v2.1.11
```

**CPU 环境：**
```bash
docker run -d \
  --name mineru-api \
  -p 8888:8888 \
  --restart unless-stopped \
  --shm-size=32g \
  -e MINERU_DEVICE_MODE=cpu \
  -e MINERU_MODEL_SOURCE=local \
  zxwei/mineru-api-full:v2.1.11
```

#### 📦 基础版部署（仅支持 Pipline）

仅包含核心功能，适合资源受限环境：

```bash
docker run -d \
  --name mineru-api \
  -p 8888:8888 \
  --restart unless-stopped \
  --shm-size=4g \
  -e MINERU_DEVICE_MODE=cpu \
  -e INSTALL_TYPE=core \
  zxwei/mineru-api-full:v2.1.11
```

#### 📋 部署配置说明

| 环境变量 | 说明 | 可选值 |
|---------|------|--------|
| `MINERU_DEVICE_MODE` | 运行模式 | `gpu`（推荐）、`cpu` |
| `MINERU_MODEL_SOURCE` | 模型源 | `local`（预置）、`modelscope`、`huggingface` |
| `SGLANG_MEM_FRACTION_STATIC` | GPU内存占用比例 | `0.6`-`0.9`（默认0.8） |
| `INSTALL_TYPE` | 安装类型 | `full`（默认）、`core` |

#### ✅ 服务验证

部署完成后，验证 MinerU 服务状态：

```bash
# 检查容器状态
docker ps | grep mineru-api

# 检查服务健康状态
curl http://localhost:8888/health

# 查看服务日志
docker logs mineru-api
```

**健康检查响应示例：**
```json
{
    "status": "healthy",
    "service": "MinerU API",
    "version": "2.1.11",
    "backend_status": {
        "pipeline": "available",
        "vlm-sglang-client": "connected"
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
```

:::warning 部署注意事项
- **内存要求**: 完整版至少需要 8GB 内存，基础版至少 4GB
- **存储空间**: 首次运行会下载模型，需要 5-10GB 存储空间
- **网络要求**: 首次启动需要联网下载模型（如使用 `local` 模式则无需联网）
- **GPU 支持**: 使用 GPU 可显著提升处理速度，但非必需
:::

### ⚙️ 3. 配置 MinerU 服务地址

配置 KnowFlow 连接 MinerU 服务，根据项目最新结构，配置文件位于：

```bash
vim knowflow/server/services/config/settings.yaml
```

#### 更新 MinerU 配置

在配置文件中找到 `mineru` 部分，更新服务地址：

```yaml
mineru:
  fastapi:
    # MinerU FastAPI 服务地址
    # Docker部署: http://host.docker.internal:8888 (Docker Desktop)
    #           或 http://宿主机IP:8888 (Linux Docker)
    # 本地开发: http://localhost:8888
    url: "http://宿主机IP:8888"
    
    # HTTP 请求超时时间（毫秒）
    timeout: 30000

  # VLM 后端配置（完整版镜像需要）
  vlm:
    sglang:
      # SGLang 服务器地址（vlm-sglang-client 后端需要）
      # Docker部署时同样需要使用宿主机IP或容器网络地址
      server_url: "http://宿主机IP:30000"
```

#### 配置示例

```yaml
# 示例配置（替换为实际IP地址）
mineru:
  fastapi:
    url: "http://192.168.1.100:8888"     # MinerU API服务地址
    timeout: 30000
  vlm:
    sglang:
      server_url: "http://192.168.1.100:30000"  # SGLang服务地址
```

#### 不同环境的配置

**Docker Desktop (Mac/Windows)**:
```yaml
mineru:
  fastapi:
    url: "http://host.docker.internal:8888"
  vlm:
    sglang:
      server_url: "http://host.docker.internal:30000"
```

**Linux Docker**:
```yaml
mineru:
  fastapi:
    url: "http://172.17.0.1:8888"  # 或使用实际宿主机IP
  vlm:
    sglang:
      server_url: "http://172.17.0.1:30000"
```

#### 配置验证

配置完成后，验证 MinerU 服务连接：

```bash
# 测试 MinerU API 连接
curl -X GET "http://宿主机IP:8888/health"

# 预期响应
{
  "status": "healthy",
  "service": "MinerU API",
  "version": "2.1.11"
}
```

:::tip 配置说明
- **服务地址**: 根据实际部署环境选择合适的地址配置
- **端口说明**: 8888 是 MinerU API 端口，30000 是 SGLang 服务端口
- **网络连通**: 确保 KnowFlow 服务能够访问 MinerU 服务
- **超时设置**: timeout 设置为 30000 毫秒（30秒），适应大文档解析需求
:::

### 🎯 4. 启动 KnowFlow 服务

进入 Docker 目录并启动服务（与 RAGFlow 官方保持一致）：

```bash
cd docker

# 如有 GPU 支持
docker compose -f docker-compose-gpu.yml up -d

# 无 GPU 环境
docker compose -f docker-compose.yml up -d
```

#### 🔍 服务启动验证

检查服务状态：

```bash
# 查看所有容器状态
docker compose ps

# 查看服务日志
docker compose logs -f

# 检查关键服务健康状态
curl http://localhost:8888/health  # MinerU API 健康检查
curl http://localhost:80/health     # KnowFlow 前端健康检查
```

### 🌐 5. 访问系统

服务启动完成后，通过以下地址访问：

| 服务 | 访问地址 | 说明 |
|------|---------|------|
| **KnowFlow 主界面** | `http://服务器IP:80` | 知识库管理和智能问答 |
| **MinerU API** | `http://服务器IP:8888` | 文档解析服务 |

#### 默认管理员账户

系统启动后，使用以下默认超级管理员账户登录：

```
邮箱：admin@gmail.com
密码：admin
```

#### 首次使用设置

1. **修改默认密码**: 登录后立即修改管理员密码
2. **创建普通用户**: 在系统设置中创建其他用户账号
3. **配置团队权限**: 设置用户角色和团队协作权限
4. **测试文档解析**: 上传测试文档验证 MinerU 服务正常

:::tip 系统访问提示
- 首次登录后，请及时修改默认密码确保系统安全
- 新创建的用户会自动加入创建时间最早用户的团队
- 管理员具有 RBAC 权限管理功能，可精细控制用户权限
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

#### 1️⃣ **KnowFlow 后端部署**
```bash
cd knowflow/server
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\\Scripts\\activate  # Windows
pip install -r requirements.txt
```

#### 2️⃣ **启动文件转换服务**（可选）
```bash
# 支持 PDF 以外文件格式需要启动此服务
docker run -d -p 3000:3000 gotenberg/gotenberg:8
```

#### 3️⃣ **执行初始化脚本**
```bash
cd knowflow/
./scripts/install.sh --local
```

#### 4️⃣ **启动 KnowFlow 后端**
```bash
python3 app.py
```

#### 5️⃣ **RAGFlow 后端部署**

```bash
# 修改 docker/entrypoint.sh 文件，注释掉 nginx 行
# /usr/sbin/nginx

# 激活 Python 虚拟环境
source .venv/bin/activate
export PYTHONPATH=$(pwd)

# 配置 HuggingFace 镜像（可选）
export HF_ENDPOINT=https://hf-mirror.com

# 启动后端服务
./local_entrypoint.sh
```

### 🎨 启动前端

#### 1️⃣ **安装依赖**
```bash
cd web
pnpm install
```

#### 2️⃣ **启动开发服务器**
```bash
pnpm dev
```

#### 3️⃣ **访问系统**

浏览器访问启动后显示的地址，通常为 `http://localhost:5173`

:::tip 开发提示
- 前端支持热重载，修改代码后自动刷新
- 确保 MinerU、KnowFlow 后端、RAGFlow 后端都已启动
- 开发环境下可以实时查看日志和调试信息
:::

## 🔧 高级部署选项

### MinerU 本地开发模式

如果您需要在本地进行开发调试，可以直接运行 MinerU 源码：

#### 1. 环境准备

```bash
# 克隆 MinerU 源码（如果需要）
git clone https://github.com/opendatalab/MinerU.git
cd MinerU

# 安装依赖
pip install "mineru[core]>=2.1.11" fastapi uvicorn python-multipart requests loguru
```

#### 2. 环境变量配置

```bash
# 设备模式
export MINERU_DEVICE_MODE=cpu  # 或 gpu

# 模型源（国内推荐使用 modelscope）
export MINERU_MODEL_SOURCE=modelscope

# 日志级别
export LOG_LEVEL=INFO
```

#### 3. 启动开发服务

进入 KnowFlow 项目中的 MinerU API 目录：

```bash
cd knowflow/web_api
python app.py
```

服务启动后会显示：
```
INFO:     Uvicorn running on http://0.0.0.0:8888 (Press CTRL+C to quit)
```

#### 4. 配置连接地址

开发模式下，修改 `knowflow/server/services/config/settings.yaml` 配置：

```yaml
mineru:
  fastapi:
    url: "http://localhost:8888"  # 本地开发地址
    timeout: 30000
  vlm:
    sglang:
      server_url: "http://localhost:30000"  # 如需SGLang功能
```



### 性能调优配置

#### GPU 内存优化

```bash
# 调整 GPU 内存占用比例
docker run -d --gpus all \
  -e SGLANG_MEM_FRACTION_STATIC=0.7 \  # 降低内存占用
  zxwei/mineru-api-full:v2.1.11
```

#### 并发处理优化

```bash
# 增加工作进程数
docker run -d \
  -e WORKERS=4 \  # 4个工作进程
  -e MAX_REQUESTS=1000 \  # 最大请求数
  zxwei/mineru-api-full:v2.1.11
```

:::tip 开发建议
- **开发环境**: 推荐使用本地开发模式，便于调试
- **测试环境**: 使用 Docker 单容器部署
- **生产环境**: 使用 Docker Compose 集成部署，便于管理和扩展
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

## 🔧 故障排除

### MinerU 部署问题

#### 🚨 容器启动失败

**现象**: MinerU 容器无法启动或立即退出

**排查步骤**:
```bash
# 1. 查看容器状态
docker ps -a | grep mineru

# 2. 检查容器日志
docker logs mineru-api

# 3. 检查端口占用
lsof -i :8888
lsof -i :30000

# 4. 检查系统资源
free -h
df -h
```

**常见解决方案**:
```bash
# 端口被占用 - 更换端口
docker run -p 8889:8888 zxwei/mineru-api-full:v2.1.11

# 内存不足 - 降低共享内存
docker run --shm-size=4g zxwei/mineru-api-full:v2.1.11

# GPU问题 - 使用CPU模式
docker run -e MINERU_DEVICE_MODE=cpu zxwei/mineru-api-full:v2.1.11
```

#### 🔌 服务连接问题

**现象**: KnowFlow 无法连接 MinerU 服务

**排查步骤**:
```bash
# 1. 测试 MinerU API 连通性
curl -X GET "http://YOUR_IP:8888/health"

# 2. 检查网络连接
docker network ls
docker inspect mineru-api | grep NetworkMode

# 3. 验证配置文件
grep -r "mineru" knowflow/server/services/config/settings.yaml
```

**解决方案**:
```bash
# 网络问题 - 使用host网络
docker run --network host zxwei/mineru-api-full:v2.1.11

# 配置错误 - 更新settings.yaml
mineru:
  fastapi:
    url: "http://docker.for.mac.host.internal:8888"  # Mac Docker Desktop
    # url: "http://host.docker.internal:8888"        # Windows Docker Desktop  
    # url: "http://172.17.0.1:8888"                  # Linux Docker
```

#### 🐍 模型下载问题

**现象**: 首次启动时模型下载失败或缓慢

**解决方案**:
```bash
# 1. 使用国内模型源
docker run -e MINERU_MODEL_SOURCE=modelscope zxwei/mineru-api-full:v2.1.11

# 2. 预下载模型（可选）
docker run --rm -v mineru_models:/app/models \
  zxwei/mineru-api-full:v2.1.11 \
  python -c "import mineru; mineru.download_models()"

# 3. 使用预置模型镜像（推荐）
docker run zxwei/mineru-api-full:v2.1.11  # 已包含所有模型
```

#### 💾 性能问题

**现象**: 文档解析速度较慢或内存占用过高

**优化方案**:
```bash
# 1. 启用GPU加速
docker run --gpus all -e MINERU_DEVICE_MODE=gpu

# 2. 调整内存参数
docker run --shm-size=16g -m 32g  # 增加共享内存和最大内存

# 3. 优化SGLang配置
docker run -e SGLANG_MEM_FRACTION_STATIC=0.6  # 降低GPU内存占用

# 4. 使用基础版镜像（如果不需要VLM功能）
docker run -e INSTALL_TYPE=core zxwei/mineru-api-full:v2.1.11
```

### KnowFlow 连接问题

#### 📁 配置文件问题

**现象**: 找不到 settings.yaml 或配置不生效

**解决方案**:
```bash
# 1. 查找所有配置文件
find . -name "settings.yaml" -type f 2>/dev/null

# 2. 常见路径检查
ls -la knowflow/server/services/config/settings.yaml

# 3. 创建配置文件（如果不存在）
mkdir -p knowflow/server/services/config
cp settings.yaml.example knowflow/server/services/config/settings.yaml
```

#### 🌐 网络访问问题

**现象**: 前端无法访问或API调用失败

**排查命令**:
```bash
# 1. 检查服务状态
docker compose ps

# 2. 检查端口开放
sudo ufw status
sudo iptables -L

# 3. 测试服务连通性
curl -I http://localhost:80
curl -X GET http://localhost:8888/health
```

**解决方案**:
```bash
# 开放防火墙端口
sudo ufw allow 80
sudo ufw allow 8888
sudo ufw allow 30000

# 检查Docker网络
docker network inspect knowflow_default
```

### 日志诊断

#### 📊 日志收集

```bash
# MinerU 服务日志
docker logs mineru-api > mineru.log 2>&1

# KnowFlow 服务日志  
docker compose logs > knowflow.log 2>&1

# 系统资源监控
top -p $(docker inspect -f '{{.State.Pid}}' mineru-api)
```

#### 🔍 关键日志信息

**正常启动日志**:
```
INFO:     Uvicorn running on http://0.0.0.0:8888
INFO:     MinerU API服务启动成功
INFO:     Backend pipeline initialized
INFO:     SGLang server connected (if using full version)
```

**错误日志关键词**:
- `CUDA out of memory`: GPU内存不足
- `Address already in use`: 端口被占用  
- `Connection refused`: 服务连接失败
- `Model download failed`: 模型下载失败

### 获取技术支持

如果以上方法无法解决问题，可以通过以下方式获取帮助：

1. **收集诊断信息**:
```bash
# 生成诊断报告
./scripts/diagnose.sh > diagnosis.log 2>&1
```

2. **提交问题**:
- [GitHub Issues](https://github.com/weizxfree/KnowFlow/issues) - 提交技术问题
- [GitHub Discussions](https://github.com/weizxfree/KnowFlow/discussions) - 讨论和提问
- 项目 README - 查看最新文档

## 📋 部署总结

### 快速部署流程

1. **获取代码**: 克隆 KnowFlow 项目到本地
2. **部署 MinerU**: 运行 MinerU 文档解析服务
3. **配置连接**: 在 settings.yaml 中配置 MinerU 服务地址
4. **启动服务**: 运行 docker-compose 启动所有服务
5. **访问系统**: 用默认账号登录并完成初始化设置

### 服务端口说明

| 服务 | 端口 | 说明 | 必需性 |
|------|------|------|--------|
| **KnowFlow 前端** | 80 | 用户访问界面 | ✅ 必需 |
| **RAGFlow API** | 9380 | RAGFlow 后端 API | ✅ 必需 |
| **MinerU API** | 8888 | 文档解析服务 | ✅ 必需 |
| **SGLang 服务** | 30000 | VLM 推理服务 | 🔶 完整版需要 |
| **Gotenberg** | 3000 | 文档格式转换 | 🔶 可选 |
| **KnowFlow 后端** | 5000 | 扩展功能服务 | 🔶 源码模式需要 |

### 配置文件说明

**关键配置文件位置**:
```
knowflow/server/services/config/settings.yaml  # MinerU 服务配置
docker/.env                                    # Docker 环境变量
docker/docker-compose.yml                     # 服务编排配置
```

### 图文混排功能配置

图文混排功能需要正确配置聊天助手提示词模板：

```
请参考{knowledge}内容回答用户问题。
如果知识库内容包含图片，请在回答中包含图片URL。
注意这个 html 格式的 URL 是来自知识库本身，URL 不能做任何改动。
请确保回答简洁、专业，将图片自然地融入回答内容中。
```

## 📚 下一步

### 快速开始使用

部署完成后，建议按以下顺序进行配置：

1. **[用户管理](./产品使用/rbac-permission)** - 了解RBAC权限管理和用户创建
2. **[知识库管理](./产品使用/)** - 创建和配置知识库  
3. **[文档解析](./产品使用/parent-child-chunking)** - 使用父子分块策略解析文档
4. **[API集成](./API接口/api-overview)** - 通过API接口集成第三方系统

### 相关文档

- **[产品使用指南](./产品使用/rbac-permission)** - 详细的功能使用说明
- **[API接口文档](./API接口/api-overview)** - 完整的API参考和示例
- **[常见问题](./常见问题/)** - 解决部署和使用中的问题
- **[GitHub项目](https://github.com/weizxfree/KnowFlow)** - 源码、问题反馈和讨论

### 技术支持

- **GitHub Issues**: [提交技术问题](https://github.com/weizxfree/KnowFlow/issues)
- **GitHub Discussions**: [参与社区讨论](https://github.com/weizxfree/KnowFlow/discussions)
- **项目文档**: 查看最新的README和更新日志

---

🎉 **恭喜！** 您已成功完成 KnowFlow 的部署。现在可以开始使用强大的企业级知识库功能了！
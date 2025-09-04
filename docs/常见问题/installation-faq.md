---
sidebar_position: 1
---

# ❓ 安装部署常见问题

本文档收集了 KnowFlow 安装部署过程中的常见问题和解决方案。

:::info 问题分类
问题按照 MinerU 服务、Docker Compose 部署、源码运行三个方面进行分类。
:::

## ⚙️ MinerU 服务相关


### 🔧 Q: 如何 MinerU 解析的文件增加标题

**A:**   
```
"llm-aided-config": {
         "title_aided": {
            "api_key": "sk-xxxxx",
            "base_url": "https://api.siliconflow.cn/v1",
            "model": "Qwen/Qwen3-32B",
            "enable": true
         }
     },
     "models-dir": {
        "pipeline": "",
        "pipeline": "/app/models/huggingface/models--opendatalab--PDF-Extract-Kit-1.0/snapshots/a447acb48da13ba6bf54b53170d614626a147e9b",
         vlm": ""
     },
```

### 🔧 Q: 如何在本地环境调试 MinerU 服务？

**A:** 如果您需要在本地环境进行开发调试，可以直接运行 MinerU 服务：

#### 步骤 1: 安装依赖
```bash
# 注意：zsh 需要用引号包围方括号
pip install "mineru[core]" fastapi uvicorn python-multipart
```

#### 步骤 2: 设置环境变量
```bash
export MINERU_DEVICE_MODE=cpu
export MINERU_MODEL_SOURCE=modelscope
```

#### 步骤 3: 启动服务
```bash
cd web_api
python app.py
```

#### 步骤 4: 配置文件
配置 `settings.yaml`：

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

:::tip 开发提示
本地调试模式适合开发环境，生产环境建议使用 Docker 方式部署。
:::

### 🐳 Q: MinerU 镜像有哪些版本？如何选择？

**A:** 提供两种镜像版本，可根据需求选择：

#### 🌟 完整版（推荐）
包含所有功能，支持完整的 VLM 功能：
```bash
docker run --rm -d --gpus=all \
  --shm-size=32g \
  -p 8888:8888 -p 30000:30000 \
  --name mineru-api \
  zxwei/mineru-api-full:2.1.0
```

#### 📦 基础版
仅包含基础功能，体积更小：
```bash
docker run --rm -d --gpus=all \
  --shm-size=32g \
  -p 8888:8888 \
  --name mineru-api \
  zxwei/mineru-api:2.1.0
```

#### 📋 镜像对比

| 镜像版本 | 功能特点 | 适用场景 | 镜像大小 |
|---------|---------|---------|----------|
| **zxwei/mineru-api-full** | 完整 VLM 功能，支持所有后端 | 生产环境，功能完整 | 较大 |
| **zxwei/mineru-api** | 基础功能，主要支持 pipeline | 测试环境，资源受限 | 较小 |

### 🚀 Q: 如何启用 GPU 加速？

**A:** 如需 GPU 加速，请确保已安装 `nvidia-container-toolkit`。

:::warning GPU 要求
- 需要 NVIDIA GPU 显卡
- 安装 NVIDIA 驱动程序
- 安装 nvidia-container-toolkit
:::

## 🐳 Docker Compose 部署相关

### 🔧 Q: 安装脚本会自动配置哪些内容？

**A:** 执行 `./scripts/install.sh` 后，脚本会自动完成以下配置：

| 配置项 | 说明 |
|--------|------|
| **IP 地址检测** | 自动检测本机 IP 地址 |
| **配置文件创建** | 自动创建 `.env` 配置文件（如果不存在）|
| **配置选项** | 如果 `.env` 文件已存在，提供保留或重新生成选项 |

### ⚙️ Q: .env 文件需要手动配置哪些内容？

**A:** 安装脚本会自动创建 `.env` 文件模板，您只需要填写必要信息：

```bash
# RAGFlow 服务地址 (必须手动填写)
RAGFLOW_BASE_URL=http://检测到的IP:实际端口号
```

:::tip 自动配置
其他配置项（如 HOST_IP、ES_HOST 等）已由脚本自动填写，无需手动修改。
:::

### 🌐 Q: 如何访问管理界面？

**A:** 启动容器后，通过以下地址访问：

| 界面类型 | 访问地址 | 说明 |
|---------|---------|------|
| **管理界面** | `http://服务器IP:8081` | 后台管理系统 |
| **用户界面** | `http://服务器IP:80` | 前台用户系统 |

## 💻 源码运行相关

### 📋 Q: 源码运行需要哪些前置条件？

**A:** 源码运行需要满足以下条件：

| 组件 | 版本要求 | 说明 |
|------|---------|------|
| **Python** | 3.8+ | 后端运行环境 |
| **Node.js** | 16+ | 前端构建环境 |
| **pnpm** | 最新版 | 包管理工具 |
| **MinerU 服务** | 已配置 | 文档解析服务 |
| **RAGFlow 服务** | 已配置 | 知识库管理服务 |

:::warning 环境要求
请确保所有依赖服务已正确配置并可正常访问。
:::

### 🔧 Q: 如何启动后端服务？

**A:** 在 `management/server` 目录下按以下步骤操作：

#### 步骤 1: 创建虚拟环境
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 步骤 2: 安装依赖
```bash
pip install -r requirements.txt
```

#### 步骤 3: 启动文件转换服务（可选）
```bash
# 支持 PDF 以外文件格式需要开启
docker run -d -p 3000:3000 gotenberg/gotenberg:8
```

#### 步骤 4: 启动后端服务
```bash
python3 app.py
```

:::tip 服务说明
文件格式转换服务为可选组件，仅在需要处理 PDF 以外格式时启用。
:::

### 🌐 Q: 如何启动前端服务？

**A:** 在 `management/web` 目录下按以下步骤操作：

#### 步骤 1: 安装依赖
```bash
pnpm i
```

#### 步骤 2: 启动开发服务器
```bash
pnpm dev
```

#### 步骤 3: 访问系统
浏览器访问启动后显示的地址，即可进入系统管理界面。

:::info 开发模式
开发服务器支持热重载功能，代码修改后会自动刷新页面。
:::




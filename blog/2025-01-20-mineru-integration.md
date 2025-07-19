---
slug: mineru-integration
title: 🔥 KnowFlow v1.0.0 全面接入 MinerU 2.0
authors: [knowflow-team]
tags: [KnowFlow, MinerU, OCR, 文档解析]
description: KnowFlow v1.0.0 重磅发布，全面接入 MinerU 2.0，支持多种部署模式，大幅提升文档识别和解析效果，架构设计更加灵活可扩展。
---

## 🚀 重磅升级

KnowFlow v1.0.0 重磅发布，**全面接入 MinerU 2.0**！

<!-- truncate -->

### 🎯 升级动机

| 升级原因 | 问题描述 | 解决方案 |
|---------|---------|----------|
| **架构优化** | Python 直接调用 MinerU 1.x，高度耦合 | 解耦架构，提升扩展性 |
| **效果提升** | 传统 OCR 效果有限 | vlm-sglang 逼近付费 OCR 效果 |
| **部署简化** | 部署成本较高，配置复杂 | 容器化部署，降低门槛 |
| **准确率追求** | KnowFlow 始终坚持高准确率 | 大幅提升文档识别和解析效果 |

:::info 官方认可
近期与 **RAGFlow 官方产品经理**深度沟通，产品经理高度肯定了 KnowFlow 的产品价值和发展方向。
:::

## MinerU 2.0 功能简介

MinerU 2.0 共支持三种部署模式：

### pipeline 模式
pipeline 模式简单理解就是 MinerU 1.x 的功能，MinerU 2.0 相当于做了向下兼容。这种模式配置要求最低，本地 MAC 开发开启了 mps 模式后，pipeline 跑起来速度还是令人惊喜。

### vlm-transformers 模式
该模式使用 HuggingFace transformers 库直接加载和运行视觉语言模型，实现端到端的文档理解。实测真的很慢，配置要求挺高，存在 vlm-sglang 模式前提下，不建议采用此模式。

### vlm-sglang 模式
vlm-sglang 包含两种子模式：

• **vlm-sglang-engine**
  - 架构：本地 SGLang 引擎集成
  - 性能：通过 SGLang 加速，在单卡 NVIDIA 4090 上可达 10,000+ tokens/s 吞吐量
  - 硬件要求：需要 24GB+ VRAM

• **vlm-sglang-client**
  - 架构：远程 SGLang 服务器客户端连接
  - 部署方式：支持分布式处理，客户端仅需 CPU 和网络连接
  - 服务器配置：使用自定义的 SGLang 服务器

对于 KnowFlow 来说，本次 vlm-sglang 支持 vlm-sglang-client。

## KnowFlow v1.0.0 功能简介

考虑后续可能会对接更多的 OCR 引擎，KnowFlow v1.0.0 本次架构设计采用 FastAPI 和 MinerU2.0 进行对接。

### MinerU 2.0 Web API

截止到发稿日为止，MinerU 2.0 仍未推出官方的 Web API 服务。KnowFlow 在原先 MinerU 1.x 的基础上适配了 Web API，并将源码开放，方便后续持续升级和维护 MinerU 最新版本以及自定义改造。

该 Web API 服务和独立于 KnowFlow 单独使用，符合组件化设计思想。同时项目中提供了 demo 文件、测试脚本、解析后的结构化数据样例等，方便后续的测试联调。

考虑到部分用户用不到 vlm-sglang 模式，KnowFlow 提供了两个镜像：
• `zxwei/mineru-api-full`：包含完整的 VLM 功能，支持所有后端类型
• `zxwei/mineru-api`：基础版本，主要支持 pipeline 后端

其中 mineru-api 镜像体积较小，适合不需要本地开发，而只是简单本地体验用户；mineru-api-full 适合生产环境，保证足够强的解析效果。

### 本地开发部署

考虑到部分开发者觉得镜像体积太大，只需要本地开发联调，我们贴心的提供了本地 MinerU2.0 web api 部署方式。这样的话，就无需拉取体积巨大的镜像了。

```bash
# 1. 安装 Python 依赖（注意：zsh 需要用引号包围方括号）
pip install "mineru[core]" fastapi uvicorn python-multipart

# 2. 设置环境变量
export MINERU_DEVICE_MODE=cpu
export MINERU_MODEL_SOURCE=modelscope

# 3. 进入项目目录
cd web_api

# 4. 启动本地服务
python app.py
```

### KnowFlow Client 配置

有了 MinerU2.0 Web API 的服务端，对于 KnowFlow client 端，我们提供了非常简单的配置参数，可以很方便的指定解析模式以及配置相关参数。

```yaml
# =======================================================
# MinerU 文档解析配置 (客户端配置)
# =======================================================
mineru:
  # FastAPI 客户端配置
  fastapi:
    # FastAPI 服务地址
    # 本地开发: http://localhost:8888
    # Docker部署: http://host.docker.internal:8888 (Docker Desktop)
    #           或 http://宿主机IP:8888 (Linux Docker)
    #           或 http://mineru-api:8888 (Docker Compose网络)
    url: "http://host.docker.internal:8888"
    
    # HTTP 请求超时时间（秒）
    timeout: 30000

  # 默认使用的后端类型
  # 选项: pipeline, vlm-transformers, vlm-sglang-client
  default_backend: "pipeline"

  # Pipeline 后端请求参数
  pipeline:
    # 解析方法: auto, txt, ocr
    parse_method: "auto"
    
    # 文档语言（提升OCR准确率）
    lang: "ch"
    
    # 是否启用公式解析
    formula_enable: true
    
    # 是否启用表格解析
    table_enable: true

  # VLM 后端配置
  vlm:
    sglang:
      # SGLang 服务器地址（vlm-sglang-client 后端需要）
      # Docker部署时同样需要使用宿主机IP或容器网络地址
      server_url: "http://host.docker.internal:30000"
```

## 性能测试

实测过程中，强烈推荐大家采用 vlm-sglang-client 模式，该模式速度上比 vlm-transformers 提高了很多倍，当然显存占用大点，我实测单卡 48 G 显存 500KB PDF 文件，解析速度大概在 5s 左右。

## 总结

KnowFlow v1.0.0 通过接入 MinerU 2.0，在文档解析能力上有了质的提升。无论是性能还是准确率，都达到了新的高度。我们将继续优化和完善这一功能，为用户提供更好的文档处理体验。
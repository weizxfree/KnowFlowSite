---
slug: knowflow-release
title: 🚀 KnowFlow 正式发布：RAGFlow 企业级落地的最后一公里
authors: [knowflow-team]
tags: [knowflow, ragflow, 企业级, 开源]
description: KnowFlow 是基于 RAGFlow 的开源项目，专为企业级场景设计，提供插件化架构、企业级特性和丰富的分块策略，助力 RAG 系统在企业环境中的高效落地。
---

## 🎉 重磅发布

我们很高兴地宣布 **KnowFlow** 正式发布！这是一个基于 RAGFlow 的开源项目，专为企业级场景设计，致力于成为 RAGFlow 官方开源产品真正落地企业场景的最后一公里服务。

<!-- truncate -->

## 🚀 为什么选择 KnowFlow？

RAGFlow 作为优秀的开源 RAG 框架，在学术和研究领域表现出色。但在企业实际落地过程中，我们发现还需要更多的企业级特性和最佳实践。KnowFlow 应运而生，它不是要替代 RAGFlow，而是要增强它，让它更好地服务于企业场景。

## 🌟 核心优势

### 🔌 插件化架构，升级无忧

KnowFlow 采用插件化架构设计，通过 Plugin & Patch 机制增强 RAGFlow 而不破坏原生代码。这意味着：

- **无缝兼容**：支持 RAGFlow 任意版本
- **热插拔**：所有增强功能均可独立启用/禁用
- **零入侵**：不修改 RAGFlow 核心代码
- **升级友好**：RAGFlow 官方更新时，KnowFlow 可以平滑升级

### 🏢 企业级特性，开箱即用

我们深入了解企业需求，集成了以下关键特性：

- **MinerU2.x OCR 引擎**：支持高质量文档解析
- **团队/用户/权限管理**：完整的多租户支持
- **企业微信集成**：无缝对接企业办公环境
- **LDAP/SSO**：企业级身份认证（开发中）

### 🧩 丰富的分块策略

文档分块是 RAG 系统的核心环节，KnowFlow 提供了多种分块策略：

- **文档结构分块**：基于文档自然结构
- **按标题分块**：智能识别标题层级
- **RAGFlow 原分块**：保持与官方完全一致
- **图文混排**：支持图片和文本的混合处理

## 🎯 主要功能

### 全新 UI 界面

基于 RAGFlow v0.18.0 二次开发的全新 UI 界面，目前已适配 v0.19.0：

- 更现代的设计语言
- 更直观的用户体验
- 更完善的功能布局

### 用户后台管理系统

参考 ragflow-plus 项目，我们构建了完整的用户后台管理系统：

- **用户管理**：创建、编辑、删除用户
- **团队管理**：多租户支持，团队隔离
- **模型配置管理**：灵活的模型配置策略
- **自动团队分配**：新用户自动加入默认团队

### 图文混排输出

支持市面上常见的文件格式：

- **文档格式**：PPT, Word, Excel, PDF 等
- **图片格式**：PNG, JPG, GIF 等
- **智能解析**：自动识别文档结构
- **混排输出**：图片和文本的完美结合

### 企业微信应用

将 KnowFlow 打造成企业微信应用：

- **聊天机器人**：直接在企业微信中使用
- **权限控制**：基于企业微信的身份验证
- **消息推送**：重要信息及时通知

## 🛠️ 技术架构

KnowFlow 采用现代化的技术栈：

- **后端**：Python + FastAPI
- **前端**：React + TypeScript
- **数据库**：支持多种数据库
- **容器化**：Docker + Docker Compose
- **OCR 引擎**：MinerU2.x

## 📦 快速开始

### 🐳 Docker Compose 部署（推荐）

#### 步骤 1：启动 MinerU 服务

```bash
docker run --rm -d --gpus=all \
  --shm-size=32g \
  -p 8888:8888 -p 30000:30000 \
  --name mineru-api \
  zxwei/mineru-api-full:2.1.0
```

#### 步骤 2：执行安装脚本

```bash
./scripts/install.sh
```

#### 步骤 3：启动服务

```bash
docker compose up -d
```

#### 步骤 4：访问系统

🌐 **管理界面**：`http://your-server-ip:8081`

:::tip 提示
请将 `your-server-ip` 替换为您的实际服务器 IP 地址。
:::

### 💻 源码部署

#### 后端服务

```bash
cd management/server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

#### 前端服务

```bash
cd management/web
pnpm i
pnpm dev
```

:::info 开发环境
源码部署适合开发和调试环境，生产环境建议使用 Docker Compose 部署。
:::

## 🤝 社区与贡献

KnowFlow 是一个开源项目，我们欢迎社区的参与和贡献：

- **GitHub 仓库**：[https://github.com/weizxfree/KnowFlow](https://github.com/weizxfree/KnowFlow)
- **问题反馈**：[GitHub Issues](https://github.com/weizxfree/KnowFlow/issues)
- **功能讨论**：[GitHub Discussions](https://github.com/weizxfree/KnowFlow/discussions)

### 如何贡献

1. **代码贡献**：提交 Pull Request
2. **问题反馈**：报告 Bug 或提出改进建议
3. **文档完善**：帮助改进文档
4. **社区推广**：分享使用经验

## 🔮 未来规划

我们有着清晰的发展路线图：

### 短期目标（Q1 2025）
- 完善 LDAP/SSO 集成
- 增加更多文档格式支持
- 优化性能和稳定性
- 完善文档和示例

### 中期目标（Q2-Q3 2025）
- 多语言支持
- 高级分析和报表功能
- 更多企业级集成
- 云原生部署支持

### 长期目标（Q4 2025 及以后）
- AI 助手功能增强
- 自动化运维工具
- 企业级 SLA 支持
- 生态系统建设

## 💡 最佳实践

基于我们的实践经验，我们总结了一些最佳实践：

### 📸 图文混排配置

为了确保图文混排功能正常工作，聊天助手的提示词配置很重要：

```text
请参考{knowledge}内容回答用户问题。
如果知识库内容包含图片，请在回答中包含图片URL。
注意这个 html 格式的 URL 是来自知识库本身，URL 不能做任何改动。
请确保回答简洁、专业，将图片自然地融入回答
```

:::warning 注意事项
- 图片 URL 不能做任何修改
- 确保提示词中包含图片处理逻辑
- 建议在测试环境中验证图文混排效果
:::

### ⚡ 性能优化

| 优化项目 | 推荐配置 | 说明 |
|---------|---------|------|
| **硬件配置** | 16GB+ 内存，4核心+ CPU | 基础运行要求 |
| **GPU 加速** | NVIDIA GPU 推荐 | 显著提升 OCR 性能 |
| **分块策略** | 根据文档类型选择 | 提升检索准确率 |
| **缓存配置** | 合理配置缓存 | 提升响应速度 |

:::tip 性能建议
- 生产环境建议使用 GPU 加速
- 根据实际文档类型调整分块策略
- 定期监控系统资源使用情况
:::

## 🙏 致谢

感谢以下项目和社区的支持：

- **RAGFlow 团队**：提供了优秀的基础框架
- **MinerU 团队**：提供了强大的 OCR 引擎
- **开源社区**：提供了丰富的工具和库
- **早期用户**：提供了宝贵的反馈和建议

## 📞 联系我们

如果您有任何问题或建议，欢迎通过以下方式联系我们：

- **GitHub Issues**：技术问题和 Bug 报告
- **GitHub Discussions**：功能讨论和经验分享
- **项目文档**：详细的使用指南和 API 文档

让我们一起构建更好的企业级 RAG 解决方案！🚀
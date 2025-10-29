---
sidebar_position: 1
---

# KnowFlow 介绍

**KnowFlow** 是基于 RAGFlow v0.20.5 深度定制的企业级智能知识库解决方案，专注于为企业提供从开源到生产的最后一公里服务。

---

## 产品定位

KnowFlow 持续兼容 RAGFlow 官方版本（当前适配 v0.20.5），在保持核心能力的基础上，整合社区最佳实践，提供企业级增强功能。通过插件化架构设计，确保与 RAGFlow 版本升级的无缝兼容。

### 核心价值

- **生产就绪**: 提供 RBAC 权限管理、团队协作等企业必需功能
- **开箱即用**: 一键部署，预置最佳实践配置
- **灵活扩展**: 插件化架构，支持定制化需求
- **稳定可靠**: 企业级质量保障，适合生产环境

---

## 核心能力

### 智能文档处理

<div className="margin-bottom--md">

**多引擎支持**
- DOTS 解析引擎 - MarkDown 标题识别精准，复杂版式处理优秀
- MinerU v2.1.11 - 最新 OCR 引擎，支持 GPU 加速
- 支持 PPT、Word、Excel、PDF、图片等 20+ 种文档格式

**定制分块策略**
- 智能分块 - 基于 AST 语义分析
- 标题分块 - 严格按标题层级切分
- 父子分块 - 检索精度与上下文完整性兼顾
- 正则分块 - 自定义模式灵活切分

为 MinerU 解析结果量身定制，确保最佳分块效果。

</div>

### 企业级权限管理

<div className="margin-bottom--md">

**RBAC 权限体系**
- 基于角色的访问控制（Role-Based Access Control）
- 支持全局角色与资源级角色
- 多层级权限继承机制
- 完善的操作审计日志

**团队协作**
- 用户与团队管理
- 知识库权限分配
- 批量权限操作
- 细粒度权限控制

</div>

### 快捷集成能力

<div className="margin-bottom--md">

**Dify 快捷接入**

提供开箱即用的 Dify 集成方案：
- Dify 插件包（knowflow-dify-api.difypkg）
- DSL 工作流模板（knowflow.yml）
- 一键接入，快速构建智能应用

[查看 Dify 接入指南 →](./产品使用/dfy)

**企业微信集成**

支持企业微信应用接入：
- 企业内部聊天机器人
- 知识问答服务
- 员工自助查询

**开放 API 接口**
- RESTful API - 完整的知识库管理接口
- OpenAI 兼容 API - 标准 Chat Completions 接口
- 文档解析 API - MinerU/DOTS 解析服务
- 权限管理 API - RBAC 权限控制接口

</div>

### 部署灵活性

<div className="margin-bottom--md">

**多种部署模式**
- 云端部署 - 支持公有云、私有云
- 本地部署 - 企业内网环境
- 纯离线部署 - 满足高安全要求，所有数据本地存储

**插件化架构**
- 无缝兼容 RAGFlow 任意版本
- 所有增强功能均可热插拔
- 升级无忧，零入侵设计
- 微服务分布式架构

</div>

---

## 技术架构

### 系统架构

```
┌─────────────────────────────────────────────────┐
│               前端层 (React)                      │
│  用户界面 │ 管理控制台 │ API 文档                 │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│              应用层 (Flask)                       │
│  知识库管理 │ 对话服务 │ 权限控制 │ 团队协作      │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│              服务层                               │
│  ├─ RAGFlow Core   (检索引擎)                    │
│  ├─ KnowFlow Server (企业级服务)                 │
│  ├─ DOTS/MinerU    (文档解析)                    │
│  └─ VLM Service    (图片理解)                    │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│              数据层                               │
│  MySQL │ Elasticsearch │ MinIO │ Redis          │
└─────────────────────────────────────────────────┘
```

### 关键特性

| 特性 | 说明 |
|------|------|
| **插件化设计** | 基于微服务架构，核心功能模块化，支持独立部署和扩展 |
| **高可用性** | 支持服务集群部署，故障自动转移 |
| **高性能** | 向量检索优化，支持亿级文档规模 |
| **安全性** | 数据加密存储，完善的权限控制体系 |

---

## 适用场景

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>企业知识管理</h4>
      </div>
      <div className="card__body">
        <p>构建企业内部知识库，提供文档管理、智能检索、知识问答等服务，提升员工工作效率。</p>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>客户服务支持</h4>
      </div>
      <div className="card__body">
        <p>基于产品文档和历史工单，构建智能客服系统，提供 7×24 小时自动问答服务。</p>
      </div>
    </div>
  </div>
</div>

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>研发文档助手</h4>
      </div>
      <div className="card__body">
        <p>整合技术文档、API 文档、代码注释，为开发团队提供技术问题解答和代码示例检索。</p>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>行业解决方案</h4>
      </div>
      <div className="card__body">
        <p>适用于金融、医疗、法律、教育等行业的专业知识库建设和智能问答系统。</p>
      </div>
    </div>
  </div>
</div>

---

## 快速开始

<div className="hero shadow--lw margin-bottom--lg" style={{padding: '2rem', borderRadius: '8px', background: 'var(--ifm-color-emphasis-100)'}}>
  <div className="container">
    <h3>准备好开始了吗？</h3>
    <p>按照以下步骤，快速部署您的 KnowFlow 实例：</p>
    <div className="margin-top--md">
      <a className="button button--primary button--lg margin-right--md" href="./installation">
        安装部署指南
      </a>
      <a className="button button--secondary button--lg" href="./产品使用/quick-start">
        快速入门教程
      </a>
    </div>
  </div>
</div>

---

## 获取支持

- **文档中心**: 完整的产品文档和 API 参考
- **GitHub Issues**: [https://github.com/weizxfree/KnowFlow/issues](https://github.com/weizxfree/KnowFlow/issues)
- **社区讨论**: GitHub Discussions
- **技术支持**: 企业级技术支持服务


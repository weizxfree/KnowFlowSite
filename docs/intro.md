---
sidebar_position: 1
---

# KnowFlow 介绍

:::info 版本说明
- **当前适配版本**: RAGFlow v0.22.1
- **适用范围**: 本文档适用于 KnowFlow 企业版，部分内容适用于社区版
:::

**KnowFlow** 是一款准确、可靠、可落地的私有化企业级知识库产品。

我们以「文档结构理解」为核心，从数据进入系统的第一步开始，构建高准确、可验证、可控的企业级知识库。

---

## 产品定位

**做私有化场景下，准确、可靠、可落地的知识库产品。**

KnowFlow 持续兼容 RAGFlow 官方版本，在保持核心能力的基础上，通过深度文档结构解析、量身定制的分块策略、原生多模态能力，为企业提供真正可用于生产环境的知识库解决方案。

---

## 核心能力

### 一、文档结构理解 + 量身定制的分块能力

**从"切文本"升级为"理解文档结构"**

KnowFlow 不将文档视为纯文本，而是完整还原文档的结构、层级与语义关系，为高准确检索和问答打下基础。

<div className="margin-bottom--md">

**核心能力**
- **深度文档结构解析** - 识别标题层级、段落、表格、图片、caption 等结构元素
- **多种分块策略可选** - Smart / Regex / Title / Parent-Child
- **父子分块能力** - 保留上下文语义连续性，避免碎片化召回
- **支持预览与调试** - 分块结果可追溯到原文位置，支持精准引用

**带来的价值**: 准确不是"多召回"，而是"召回刚好正确的内容"。

</div>

### 二、原生多模态知识库能力

**不只是支持多模态，而是让多模态"可用、可控、可落地"**

KnowFlow 将图片、表格、视频等非文本信息，纳入统一的知识理解与检索体系，而不是作为孤立附件存在。

<div className="margin-bottom--md">

**核心能力**
- **图文混排文档结构还原** - 完整保留文档中图文的位置关系与上下文
- **图片语义理解** - 支持以文搜图，图片不再是检索盲区
- **图片上下文联合理解** - 图片与周围标题、段落联合理解，避免语义孤立
- **多模态视频解析** - 支持视频内容的结构化理解与检索
- **离线环境适配** - 在算力受限或离线环境下仍可稳定运行

**带来的价值**: 企业知识，不再只存在于文字中。

</div>

### 三、工程化能力：可迁移、可评估、可长期维护

**面向真实生产环境，而非 Demo 系统**

KnowFlow 从工程实践出发，补齐大多数知识库系统缺失的运维与评估能力。

<div className="margin-bottom--md">

**核心能力**
- **知识库离线导入/导出** - 支持跨环境迁移，无需重新构建
- **备份与恢复** - 完整的数据备份机制，保障业务连续性
- **知识库评估体系** - 支持检索与问答效果评估，量化知识库质量
- **持续优化支持** - 帮助持续优化分块与检索策略
- **完整 API 能力** - 支持自动化与系统集成，适配长期运行的生产环境

**带来的价值**: 知识库不是一次性构建，而是可以持续演进的资产。

</div>

### 四、企业级能力：权限、安全与生态接入

**为私有化与组织级使用而生**

KnowFlow 天然面向企业与组织级部署，提供完善的权限体系与外部系统接入能力。

<div className="margin-bottom--md">

**核心能力**
- **RBAC 权限管理体系** - 基于角色的细粒度权限控制
- **多级权限控制** - 用户 / 团队 / 知识库 / 配置多维度权限管理
- **三方系统接入** - 支持企业内部系统、Dify、外部 Agent 平台对接
- **私有化部署友好** - 支持完全离线部署，满足政企、内网、合规场景需求

**带来的价值**: 知识库不仅要"好用"，更要"可控、可管、可审计"。

</div>

---

## 技术规格

| 类别 | 支持内容 |
|------|----------|
| **文档格式** | PDF、Word、Excel、PPT、Markdown、图片、视频等 |
| **解析引擎** | MinerU 2.x、DOTS、自定义引擎扩展 |
| **分块策略** | Smart、Regex、Title、Parent-Child、自定义规则 |
| **部署方式** | Docker Compose、Kubernetes、离线部署包 |
| **集成能力** | RESTful API、SDK、企业微信、Dify、Agent 平台 |

---

## 适用场景

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>🏛️ 政企内网知识库</h4>
      </div>
      <div className="card__body">
        <p>满足政府、央企对数据安全与合规的严格要求，支持完全离线部署，数据不出内网。</p>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>📚 企业知识中台</h4>
      </div>
      <div className="card__body">
        <p>构建组织级知识资产，统一管理各类文档、FAQ、产品手册，沉淀企业知识。</p>
      </div>
    </div>
  </div>
</div>

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>💬 智能客服系统</h4>
      </div>
      <div className="card__body">
        <p>基于精准检索的智能问答，提供可追溯、可验证的答案，提升服务质量。</p>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h4>🤖 Agent 知识底座</h4>
      </div>
      <div className="card__body">
        <p>为 AI Agent 提供可靠的知识检索能力，支持多系统集成与自动化流程。</p>
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

---
sidebar_position: 1
---

# 🚀 KnowFlow 介绍

欢迎使用 **KnowFlow** - 基于 RAGFlow 的企业级智能知识库解决方案！

:::tip 快速了解
KnowFlow 是基于 RAGFlow v0.20.1 深度定制的企业级开源项目，提供插件化架构、RBAC权限管理、父子分块、API开放接口等丰富的企业级特性。
:::

## 项目简介

KnowFlow 是一个基于 RAGFlow 的企业级开源知识库解决方案，持续兼容 RAGFlow 官方版本（当前适配 RAGFlow v0.20.1），同时将社区最佳实践整合进来。KnowFlow 专注于为企业提供真正落地的最后一公里服务，解决从开源到生产的关键差距。

## 🌟 核心优势

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🔌 插件化架构</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>无缝兼容 RAGFlow 任意版本</li>
          <li>所有增强均可热插拔</li>
          <li>升级无忧，零入侵设计</li>
          <li>微服务分布式架构</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🧠 智能文档解析</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>DOTS 解析引擎，MarkDown 标题识别更精准</li>
          <li>MinerU v2.1.11 OCR 引擎</li>
          <li>支持 20+ 种文档格式</li>
          <li>图文混排输出</li>
          <li>父子分块策略</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🏢 企业级管理</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>RBAC 权限管理系统</li>
          <li>团队协作与用户管理</li>
          <li>企业微信集成</li>
          <li>纯离线部署支持</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🔌 开放集成</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>完整的 HTTP API 接口</li>
          <li>OpenAI 兼容 API</li>
          <li>第三方系统集成</li>
          <li>自定义扩展支持</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## 💡 核心功能

### 🎨 全新 UI 界面
基于 RAGFlow v0.20.1 二次开发的现代化用户界面，提供更加优美的用户体验。

### 📄 智能文档解析
- **DOTS 解析引擎**: 先进的文档智能解析引擎，支持复杂版式和多模态内容
- **MinerU v2.1.11**: 集成最新 OCR 引擎，支持 GPU 加速
- **多格式支持**: PPT、Word、Excel、PDF、图片等 20+ 种格式
- **图文混排**: 保持原文档的图片、表格、公式等内容
- **分块策略**: 文档结构分块、按标题分块、父子分块等多种策略

### 👥 RBAC 权限管理
- **基于角色的访问控制**: 细粒度权限管理
- **全局角色与资源角色**: 支持多层级权限继承
- **团队协作**: 支持团队权限批量管理
- **权限审计**: 完善的操作日志和权限追踪

### 🔗 开放 API 接口
- **RESTful API**: 完整的知识库管理 API
- **OpenAI 兼容**: 支持标准的 Chat Completions 接口
- **文档解析 API**: MinerU 解析服务 API
- **权限管理 API**: RBAC 权限控制接口

### 💼 企业微信集成
支持企业微信应用，可将企业微信作为聊天机器人入口，实现企业内部知识问答。

### 🔒 纯离线部署
支持完全离线环境部署，满足高安全性要求，所有数据本地存储，无需联网。

## 快速开始

准备好开始使用 KnowFlow 了吗？查看我们的[安装指南](./installation)来快速部署您的第一个 KnowFlow 实例。

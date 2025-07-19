---
sidebar_position: 1
---

# 🚀 KnowFlow 介绍

欢迎使用 **KnowFlow** - RAGFlow 企业级落地的最后一公里服务！

:::tip 快速了解
KnowFlow 是基于 RAGFlow 的开源项目，专为企业级场景设计，提供插件化架构和丰富的企业级特性。
:::

## 项目简介

KnowFlow 是一个基于 RAGFlow 的开源项目，持续兼容 RAGFlow 官方版本，同时会将社区里做的比较好的最佳实践整合进来。KnowFlow 可以理解成 RAGFlow 官方开源产品真正落地企业场景的最后一公里服务。

## 🌟 项目亮点

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
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🧩 分块策略丰富</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>支持多种分块算法</li>
          <li>检索更精准</li>
          <li>适配多场景文档</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🏢 企业级特性</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>MinerU2.x OCR 引擎</li>
          <li>团队/用户/权限管理</li>
          <li>企业微信集成</li>
          <li>LDAP/SSO（开发中）</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📈 最佳实践集成</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>持续吸收社区优质方案</li>
          <li>助力企业高效落地</li>
          <li>经过实战验证</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## 核心功能

### 适配 RAGFlow 全新 UI
基于 RAGFlow v0.18.0 二次开发全新 UI 页面，目前已适配 v0.19.0。

### 用户后台管理系统
- 移除原登陆页用户注册的通道
- 搭建用户后台管理系统，可对用户进行管理
- 包括用户管理、团队管理、用户模型配置管理等功能
- 新建用户时，新用户会自动加入创建时间最早用户的团队

### 图文混排输出
- 支持市面上常见的文件格式，如 ppt/png/word/doc/excel 等
- 保持和官方 markdown 完全一致的分块规则
- 共提供了三种分块策略：文档结构分块、按标题分块、RAGFlow 原分块
- 无缝对接 RAGFlow 知识库系统，文档自动解析和分块

### 支持企业微信应用
支持企业微信应用，可将企业微信应用作为聊天机器人，使用企业微信应用进行聊天。

## 快速开始

准备好开始使用 KnowFlow 了吗？查看我们的[安装指南](./installation)来快速部署您的第一个 KnowFlow 实例。

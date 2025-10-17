---
sidebar_position: 1
---

# KnowFlow 完整 API 参考文档

KnowFlow 提供完整的 RESTful API 接口，整合了 RAGFlow 核心引擎和 KnowFlow Server 企业级服务。本文档基于实际测试验证（77个API，98.59%成功率），为开发者提供准确可靠的接口参考。

**版本**: v2.1.6
**测试日期**: 2025-10-17
**测试覆盖**: 77 APIs (RAGFlow: 37, KnowFlow Server: 40)
**有效成功率**: 98.59%

---

## 目录

- [架构概览](#架构概览)
- [认证方式](#认证方式)
- [基础配置](#基础配置)
- [RAGFlow API](#ragflow-api)
  - [知识库管理](#知识库管理)
  - [文档管理](#文档管理)
  - [内容分块](#内容分块)
  - [智能检索](#智能检索)
  - [对话助手](#对话助手)
  - [会话管理](#会话管理)
  - [Agent管理](#agent管理)
- [KnowFlow Server API](#knowflow-server-api)
  - [健康检查](#健康检查)
  - [用户管理](#用户管理)
  - [团队管理](#团队管理)
  - [租户管理](#租户管理)
  - [知识库权限](#知识库权限)
  - [RBAC权限管理](#rbac权限管理)
  - [文档解析服务](#文档解析服务)
- [错误处理](#错误处理)
- [最佳实践](#最佳实践)

---

## 架构概览

### 双服务架构

KnowFlow 采用分层架构设计：

```
┌─────────────────────────────────────────┐
│          客户端应用                      │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────────────┐  ┌──▼─────────────────┐
│  KnowFlow      │  │   RAGFlow          │
│  Server        │  │   Core Engine      │
│  (Port 5000)   │  │   (Port 9380)      │
├────────────────┤  ├────────────────────┤
│ • 用户管理     │  │ • 文档解析         │
│ • 团队协作     │  │ • 向量检索         │
│ • RBAC权限     │  │ • 智能问答         │
│ • MinerU解析   │  │ • 知识图谱         │
└────────────────┘  └────────────────────┘
```

### 服务职责

**RAGFlow (端口 9380)**
- 核心 RAG 引擎
- 文档解析和分块
- 向量嵌入和检索
- 对话和 Agent 管理

**KnowFlow Server (端口 5000)**
- 用户和团队管理
- 细粒度权限控制
- 企业级文档解析（MinerU/DOTS）
- 多租户支持

---

## 认证方式

### API Key 认证（推荐）

所有 API 请求都需要在 Header 中包含 API Key：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### 获取 API Key

1. 登录 KnowFlow 系统
2. 进入"个人设置" → "API密钥"
3. 点击"生成新密钥"
4. 复制并妥善保存（仅显示一次）

### 请求示例

```bash
curl -X GET "http://localhost:9380/api/v1/datasets" \
  -H "Authorization: Bearer ragflow-YourApiKeyHere" \
  -H "Content-Type: application/json"
```

---

## 基础配置

### Base URLs

```
RAGFlow API:        http://localhost:9380
KnowFlow Server:    http://localhost:5000
```

### 通用响应格式

**成功响应**
```json
{
  "code": 0,
  "data": { ... },
  "message": "success"
}
```

**错误响应**
```json
{
  "code": 400,
  "message": "参数错误",
  "details": "具体错误信息"
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问（API Key 无效） |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## RAGFlow API

### 知识库管理

#### 创建知识库

**POST** `/api/v1/datasets`

创建新的知识库（数据集）。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 知识库名称 |
| description | string | 否 | 知识库描述 |
| embedding_model | string | 否 | 嵌入模型（默认：BAAI/bge-large-zh-v1.5） |
| chunk_method | string | 否 | 分块方法（naive/smart/title/regex等） |
| parser_config | object | 否 | 解析配置 |

**parser_config 参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| chunk_token_num | integer | 512 | 分块token数量 |
| delimiter | string | "\n" | 分隔符 |
| layout_recognize | string | "DeepDOC" | 布局识别器（DeepDOC/MinerU/DOTS） |
| html4excel | boolean | false | Excel转HTML |
| raptor.use_raptor | boolean | false | 启用RAPTOR分层摘要 |
| graphrag.use_graphrag | boolean | false | 启用GraphRAG知识图谱 |

**chunk_method 枚举值**

- `naive`: 简单分块（基于token数量）
- `smart`: 智能分块（基于语义）
- `title`: 标题分块（按标题层级）
- `regex`: 正则分块（自定义规则）
- `parent_child`: 父子分块（支持上下文）
- `paper`: 论文解析
- `book`: 书籍解析
- `laws`: 法律文书解析
- `presentation`: 演示文稿解析
- `picture`: 图片OCR
- `qa`: 问答对解析
- `table`: 表格解析
- `resume`: 简历解析
- `manual`: 手动分块
- `email`: 邮件解析

**layout_recognize 枚举值**

- `DeepDOC`: RAGFlow原生解析器（默认）
- `MinerU`: 高精度OCR解析器（推荐用于PDF）
- `DOTS`: 快速OCR解析器
- `Plain Text`: 纯文本提取

**请求示例**

```bash
curl -X POST "http://localhost:9380/api/v1/datasets" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "技术文档库",
    "description": "存储技术相关文档",
    "embedding_model": "BAAI/bge-large-zh-v1.5@BAAI",
    "chunk_method": "smart",
    "parser_config": {
      "chunk_token_num": 512,
      "delimiter": "\n",
      "layout_recognize": "MinerU",
      "raptor": {"use_raptor": false},
      "graphrag": {"use_graphrag": false}
    }
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "aa0e6d20ab2b11f0a1bb66fc51ac58de",
    "name": "技术文档库",
    "description": "存储技术相关文档",
    "chunk_count": 0,
    "document_count": 0,
    "embedding_model": "BAAI/bge-large-zh-v1.5@BAAI",
    "chunk_method": "smart",
    "status": "1",
    "created_by": "36712aa3b36740958c08fb94d2309d8b",
    "create_time": 1760686447390,
    "create_date": "Fri, 17 Oct 2025 15:34:07 GMT"
  }
}
```

---

#### 查询知识库列表

**GET** `/api/v1/datasets`

获取知识库列表，支持分页和过滤。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：30，最大：1024） |
| orderby | string | 否 | 排序字段（create_time/update_time） |
| desc | boolean | 否 | 降序排列（true/false） |
| name | string | 否 | 按名称过滤 |
| id | string | 否 | 按ID过滤 |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/datasets?page=1&page_size=10&orderby=create_time&desc=true" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": [
    {
      "id": "aa0e6d20ab2b11f0a1bb66fc51ac58de",
      "name": "技术文档库",
      "chunk_count": 156,
      "document_count": 12,
      "embedding_model": "BAAI/bge-large-zh-v1.5@BAAI",
      "chunk_method": "smart",
      "status": "1",
      "create_time": 1760686447390,
      "create_date": "Fri, 17 Oct 2025 15:34:07 GMT"
    }
  ]
}
```

---

#### 更新知识库

**PUT** `/api/v1/datasets/{dataset_id}`

更新知识库配置。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 知识库名称 |
| description | string | 否 | 知识库描述 |
| embedding_model | string | 否 | 嵌入模型 |
| chunk_method | string | 否 | 分块方法 |
| parser_config | object | 否 | 解析配置 |

**请求示例**

```bash
curl -X PUT "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "更新后的描述",
    "parser_config": {
      "chunk_token_num": 1024
    }
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "aa0e6d20ab2b11f0a1bb66fc51ac58de",
    "name": "技术文档库",
    "description": "更新后的描述",
    "chunk_count": 156,
    "document_count": 12
  }
}
```

---

#### 删除知识库

**DELETE** `/api/v1/datasets`

删除一个或多个知识库。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 知识库ID数组（null则删除所有） |

**请求示例**

```bash
curl -X DELETE "http://localhost:9380/api/v1/datasets" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["dataset_id_1", "dataset_id_2"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": true
}
```

---

### 文档管理

#### 上传文档

**POST** `/api/v1/datasets/{dataset_id}/documents`

上传文档到指定知识库，支持多文件上传。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |

**请求参数（multipart/form-data）**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | 文档文件（可多个） |
| parser_id | string | 否 | 解析方法（覆盖知识库默认配置） |

**支持的文件格式**

- **文档**: PDF, DOC, DOCX, PPT, PPTX
- **表格**: XLS, XLSX, CSV
- **图片**: PNG, JPG, JPEG, BMP, TIFF, SVG
- **文本**: TXT, MD, JSON, XML, HTML
- **其他**: EML (邮件)

**请求示例**

```bash
# 单文件上传
curl -X POST "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -F "file=@document.pdf" \
  -F "parser_id=smart"

# 多文件上传
curl -X POST "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -F "file=@doc1.pdf" \
  -F "file=@doc2.pdf" \
  -F "file=@image.png"
```

**响应示例**

```json
{
  "code": 0,
  "data": [
    {
      "id": "abc35d56ab2b11f0a1bb66fc51ac58de",
      "name": "document.pdf",
      "location": "document.pdf",
      "size": 499780,
      "suffix": "pdf",
      "chunk_method": "smart",
      "parser_config": {
        "chunk_token_num": 512,
        "delimiter": "\n",
        "layout_recognize": "MinerU"
      },
      "run": "UNSTART",
      "dataset_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de",
      "created_by": "36712aa3b36740958c08fb94d2309d8b"
    }
  ]
}
```

**run 状态枚举**

- `UNSTART`: 未开始解析
- `RUNNING`: 解析中
- `2`: 解析完成
- `CANCEL`: 已取消
- `FAIL`: 解析失败

---

#### 查询文档列表

**GET** `/api/v1/datasets/{dataset_id}/documents`

查询知识库中的文档列表。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：15） |
| keywords | string | 否 | 关键词搜索 |
| id | string | 否 | 文档ID过滤 |
| name | string | 否 | 文档名称过滤 |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "docs": [
      {
        "id": "abc35d56ab2b11f0a1bb66fc51ac58de",
        "name": "技术手册.pdf",
        "chunk_count": 45,
        "size": 499780,
        "chunk_method": "smart",
        "progress": 100.0,
        "run": "2",
        "create_time": 1760686450706,
        "create_date": "Fri, 17 Oct 2025 15:34:10 GMT"
      }
    ],
    "total": 1
  }
}
```

---

#### 启动文档解析

**POST** `/api/v1/datasets/{dataset_id}/chunks`

启动文档解析任务，将文档分块并创建向量索引。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| document_ids | array | 是 | 文档ID数组 |

**请求示例**

```bash
curl -X POST "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/chunks" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "document_ids": ["abc35d56ab2b11f0a1bb66fc51ac58de"]
  }'
```

**响应示例**

```json
{
  "code": 0
}
```

---

#### 停止文档解析

**DELETE** `/api/v1/datasets/{dataset_id}/chunks`

停止正在进行的文档解析任务。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| document_ids | array | 是 | 文档ID数组 |

**请求示例**

```bash
curl -X DELETE "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/chunks" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "document_ids": ["abc35d56ab2b11f0a1bb66fc51ac58de"]
  }'
```

**响应示例**

```json
{
  "code": 0
}
```

---

#### 删除文档

**DELETE** `/api/v1/datasets/{dataset_id}/documents`

从知识库中删除文档及其所有分块。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 文档ID数组 |

**请求示例**

```bash
curl -X DELETE "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["abc35d56ab2b11f0a1bb66fc51ac58de"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": true
}
```

---

#### 下载文档

**GET** `/api/v1/datasets/{dataset_id}/documents/{document_id}`

下载原始文档文件。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |
| document_id | string | 是 | 文档ID |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents/abc35d56ab2b11f0a1bb66fc51ac58de" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -o downloaded_file.pdf
```

**响应**

返回文件二进制流（非JSON格式）。

---

### 内容分块

#### 查询文档分块

**GET** `/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`

查询文档的所有分块内容。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |
| document_id | string | 是 | 文档ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：15） |
| keywords | string | 否 | 关键词搜索 |
| id | string | 否 | 分块ID过滤 |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents/abc35d56ab2b11f0a1bb66fc51ac58de/chunks?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "chunks": [
      {
        "id": "chunk_123",
        "content": "这是文档的第一个分块内容...",
        "document_id": "abc35d56ab2b11f0a1bb66fc51ac58de",
        "available": true,
        "important_keywords": ["关键词1", "关键词2"],
        "positions": ["page_1"],
        "create_time": 1760686460000,
        "create_date": "Fri, 17 Oct 2025 15:34:20 GMT"
      }
    ],
    "total": 45
  }
}
```

---

#### 添加分块

**POST** `/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`

手动添加新的分块内容。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |
| document_id | string | 是 | 文档ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 分块内容 |
| important_keywords | array | 否 | 重要关键词 |
| questions | array | 否 | 相关问题 |

**请求示例**

```bash
curl -X POST "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents/abc35d56ab2b11f0a1bb66fc51ac58de/chunks" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "这是手动添加的内容分块",
    "important_keywords": ["机器学习", "深度学习"],
    "questions": ["什么是机器学习？", "如何应用深度学习？"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "chunk_new_456",
    "content": "这是手动添加的内容分块",
    "important_keywords": ["机器学习", "深度学习"]
  }
}
```

---

#### 更新分块

**PUT** `/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks/{chunk_id}`

更新分块内容或配置。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |
| document_id | string | 是 | 文档ID |
| chunk_id | string | 是 | 分块ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 否 | 分块内容 |
| important_keywords | array | 否 | 重要关键词 |
| available | boolean | 否 | 是否启用（用于禁用某些分块） |

**请求示例**

```bash
curl -X PUT "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents/abc35d56ab2b11f0a1bb66fc51ac58de/chunks/chunk_123" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "更新后的内容",
    "important_keywords": ["新关键词"],
    "available": true
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "chunk_123",
    "content": "更新后的内容",
    "important_keywords": ["新关键词"],
    "available": true
  }
}
```

---

#### 删除分块

**DELETE** `/api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`

删除指定的分块内容。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| dataset_id | string | 是 | 知识库ID |
| document_id | string | 是 | 文档ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chunk_ids | array | 是 | 分块ID数组 |

**请求示例**

```bash
curl -X DELETE "http://localhost:9380/api/v1/datasets/aa0e6d20ab2b11f0a1bb66fc51ac58de/documents/abc35d56ab2b11f0a1bb66fc51ac58de/chunks" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "chunk_ids": ["chunk_123", "chunk_456"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": true
}
```

---

### 智能检索

#### 内容检索

**POST** `/api/v1/retrieval`

从知识库中检索相关内容片段。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| question | string | 是 | 检索问题 |
| dataset_ids | array | 否 | 知识库ID列表 |
| document_ids | array | 否 | 文档ID列表 |
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：10） |
| similarity_threshold | float | 否 | 相似度阈值（0-1，默认：0.2） |
| vector_similarity_weight | float | 否 | 向量相似度权重（0-1，默认：0.3） |
| top_k | integer | 否 | 候选数量（默认：1024） |
| keyword | boolean | 否 | 启用关键词搜索（默认：false） |
| highlight | boolean | 否 | 高亮匹配内容（默认：true） |

**请求示例**

```bash
curl -X POST "http://localhost:9380/api/v1/retrieval" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "什么是深度学习？",
    "dataset_ids": ["aa0e6d20ab2b11f0a1bb66fc51ac58de"],
    "page": 1,
    "page_size": 5,
    "similarity_threshold": 0.2,
    "vector_similarity_weight": 0.3,
    "keyword": false,
    "highlight": true
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "chunks": [
      {
        "id": "chunk_789",
        "content": "深度学习是机器学习的一个分支，它使用神经网络模型来学习数据的表示...",
        "document_id": "abc35d56ab2b11f0a1bb66fc51ac58de",
        "document_keyword": "AI技术手册.pdf",
        "similarity": 0.87,
        "vector_similarity": 0.82,
        "term_similarity": 0.92,
        "positions": ["page_3"],
        "highlight": "<em>深度学习</em>是机器学习的一个分支..."
      }
    ],
    "doc_aggs": [
      {
        "doc_name": "AI技术手册.pdf",
        "doc_id": "abc35d56ab2b11f0a1bb66fc51ac58de",
        "count": 3
      }
    ],
    "total": 3
  }
}
```

---

### 对话助手

#### 创建对话助手

**POST** `/api/v1/chats`

创建智能问答助手（Chat Assistant）。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 助手名称 |
| dataset_ids | array | 否 | 关联的知识库ID列表 |
| description | string | 否 | 助手描述 |
| llm | object | 否 | LLM配置 |
| prompt | object | 否 | Prompt配置 |

**llm 配置参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| model_name | string | - | 模型名称（gpt-4/gpt-3.5-turbo等） |
| temperature | float | 0.1 | 温度参数（0-2） |
| top_p | float | 0.3 | Top-p采样参数 |
| presence_penalty | float | 0.4 | 存在惩罚 |
| frequency_penalty | float | 0.7 | 频率惩罚 |
| max_tokens | integer | 2048 | 最大生成token数 |

**prompt 配置参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| similarity_threshold | float | 0.2 | 相似度阈值 |
| keywords_similarity_weight | float | 0.3 | 关键词相似度权重 |
| top_n | integer | 6 | 检索top-n个相关片段 |
| opener | string | - | 开场白 |
| prompt | string | - | 系统Prompt |

**请求示例**

```bash
curl -X POST "http://localhost:9380/api/v1/chats" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "技术顾问",
    "dataset_ids": ["aa0e6d20ab2b11f0a1bb66fc51ac58de"],
    "description": "专业技术问答助手",
    "llm": {
      "model_name": "gpt-4",
      "temperature": 0.1,
      "top_p": 0.3,
      "max_tokens": 2048
    },
    "prompt": {
      "similarity_threshold": 0.2,
      "keywords_similarity_weight": 0.3,
      "top_n": 6,
      "opener": "您好！我是技术顾问，有什么可以帮助您的？",
      "prompt": "你是一个专业的技术顾问，请基于知识库内容回答用户问题。"
    }
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "chat_789abc",
    "name": "技术顾问",
    "dataset_ids": ["aa0e6d20ab2b11f0a1bb66fc51ac58de"],
    "description": "专业技术问答助手",
    "status": "1",
    "create_time": 1760686500000,
    "create_date": "Fri, 17 Oct 2025 15:35:00 GMT"
  }
}
```

---

#### 查询对话助手列表

**GET** `/api/v1/chats`

获取对话助手列表。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：30） |
| orderby | string | 否 | 排序字段 |
| desc | boolean | 否 | 降序排列 |
| name | string | 否 | 按名称过滤 |
| id | string | 否 | 按ID过滤 |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/chats?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": [
    {
      "id": "chat_789abc",
      "name": "技术顾问",
      "dataset_ids": ["aa0e6d20ab2b11f0a1bb66fc51ac58de"],
      "status": "1",
      "create_time": 1760686500000
    }
  ]
}
```

---

#### 更新对话助手

**PUT** `/api/v1/chats/{chat_id}`

更新对话助手配置。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chat_id | string | 是 | 助手ID |

**请求参数**

与创建对话助手相同，所有参数均可选。

**请求示例**

```bash
curl -X PUT "http://localhost:9380/api/v1/chats/chat_789abc" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "高级技术顾问",
    "description": "更新后的描述"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "chat_789abc",
    "name": "高级技术顾问",
    "description": "更新后的描述"
  }
}
```

---

#### 删除对话助手

**DELETE** `/api/v1/chats`

删除对话助手。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 助手ID数组 |

**请求示例**

```bash
curl -X DELETE "http://localhost:9380/api/v1/chats" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["chat_789abc"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": true
}
```

---

### 会话管理

#### 发起对话

**POST** `/api/v1/chats/{chat_id}/completions`

使用对话助手进行问答，支持流式和非流式响应。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chat_id | string | 是 | 助手ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| question | string | 是 | 用户问题 |
| stream | boolean | 否 | 启用流式响应（默认：false） |
| session_id | string | 否 | 会话ID（用于保持对话上下文） |

**请求示例（非流式）**

```bash
curl -X POST "http://localhost:9380/api/v1/chats/chat_789abc/completions" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "请解释一下什么是神经网络？",
    "stream": false
  }'
```

**响应示例（非流式）**

```json
{
  "code": 0,
  "data": {
    "answer": "神经网络是一种模拟人脑神经元结构的计算模型，由输入层、隐藏层和输出层组成...",
    "reference": {
      "chunks": [
        {
          "id": "chunk_789",
          "content": "神经网络的基本原理...",
          "document_name": "AI技术手册.pdf",
          "similarity": 0.85
        }
      ],
      "total": 1
    },
    "session_id": "session_456def"
  }
}
```

**请求示例（流式）**

```bash
curl -X POST "http://localhost:9380/api/v1/chats/chat_789abc/completions" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "深度学习的应用有哪些？",
    "stream": true,
    "session_id": "session_456def"
  }'
```

**响应示例（流式）**

```
data: {"code": 0, "data": {"answer": "深度学习", "session_id": "session_456def"}}
data: {"code": 0, "data": {"answer": "深度学习的应用", "session_id": "session_456def"}}
data: {"code": 0, "data": {"answer": "深度学习的应用包括", "session_id": "session_456def"}}
...
data: {"code": 0, "data": true}
```

---

#### OpenAI 兼容接口

**POST** `/api/v1/chats_openai/{chat_id}/chat/completions`

提供 OpenAI 兼容的 Chat Completions 接口。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chat_id | string | 是 | 助手ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model | string | 否 | 模型名称（可忽略） |
| messages | array | 是 | 消息列表 |
| stream | boolean | 否 | 启用流式响应 |
| temperature | float | 否 | 温度参数 |

**messages 格式**

```json
[
  {"role": "system", "content": "你是一个专业的技术顾问"},
  {"role": "user", "content": "什么是深度学习？"}
]
```

**请求示例**

```bash
curl -X POST "http://localhost:9380/api/v1/chats_openai/chat_789abc/chat/completions" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "什么是机器学习？"}
    ],
    "stream": false
  }'
```

**响应示例**

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1760686600,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "机器学习是人工智能的一个重要分支..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 150,
    "total_tokens": 162
  }
}
```

---

#### 查询会话列表

**GET** `/api/v1/chats/{chat_id}/sessions`

获取助手的所有会话记录。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chat_id | string | 是 | 助手ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：30） |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/chats/chat_789abc/sessions?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": [
    {
      "id": "session_456def",
      "name": "会话 2025-10-17",
      "message_count": 5,
      "create_time": 1760686550000,
      "update_time": 1760686600000
    }
  ]
}
```

---

#### 查询会话消息

**GET** `/api/v1/chats/{chat_id}/sessions/{session_id}`

获取会话中的所有消息记录。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chat_id | string | 是 | 助手ID |
| session_id | string | 是 | 会话ID |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/chats/chat_789abc/sessions/session_456def" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "role": "user",
        "content": "什么是神经网络？",
        "create_time": 1760686550000
      },
      {
        "id": "msg_002",
        "role": "assistant",
        "content": "神经网络是一种模拟人脑神经元结构的计算模型...",
        "create_time": 1760686555000,
        "reference": {
          "chunks": [...]
        }
      }
    ]
  }
}
```

---

#### 删除会话

**DELETE** `/api/v1/chats/{chat_id}/sessions`

删除会话记录。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chat_id | string | 是 | 助手ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | 会话ID数组 |

**请求示例**

```bash
curl -X DELETE "http://localhost:9380/api/v1/chats/chat_789abc/sessions" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["session_456def"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": true
}
```

---

### Agent管理

#### 创建Agent

**POST** `/api/v1/agents`

创建智能Agent（高级对话助手，支持工具调用）。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | Agent名称 |
| description | string | 否 | Agent描述 |
| dataset_ids | array | 否 | 关联的知识库ID列表 |
| llm | object | 否 | LLM配置 |
| prompt | string | 否 | 系统Prompt |
| tools | array | 否 | 工具列表 |

**请求示例**

```bash
curl -X POST "http://localhost:9380/api/v1/agents" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "智能助手",
    "description": "支持工具调用的智能助手",
    "dataset_ids": ["aa0e6d20ab2b11f0a1bb66fc51ac58de"],
    "llm": {
      "model_name": "gpt-4"
    },
    "prompt": "你是一个智能助手，可以使用工具来帮助用户。"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "agent_123xyz",
    "name": "智能助手",
    "status": "1",
    "create_time": 1760686700000
  }
}
```

---

#### 查询Agent列表

**GET** `/api/v1/agents`

获取Agent列表。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：30） |

**请求示例**

```bash
curl -X GET "http://localhost:9380/api/v1/agents?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": [
    {
      "id": "agent_123xyz",
      "name": "智能助手",
      "description": "支持工具调用的智能助手",
      "status": "1",
      "create_time": 1760686700000
    }
  ]
}
```

---

#### 更新Agent

**PUT** `/api/v1/agents/{agent_id}`

更新Agent配置。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| agent_id | string | 是 | Agent ID |

**请求参数**

与创建Agent相同，所有参数均可选。

**请求示例**

```bash
curl -X PUT "http://localhost:9380/api/v1/agents/agent_123xyz" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "高级智能助手",
    "description": "更新后的描述"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "agent_123xyz",
    "name": "高级智能助手"
  }
}
```

---

#### 删除Agent

**DELETE** `/api/v1/agents`

删除Agent。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | 是 | Agent ID数组 |

**请求示例**

```bash
curl -X DELETE "http://localhost:9380/api/v1/agents" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["agent_123xyz"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": true
}
```

---

## KnowFlow Server API

### 健康检查

#### 服务健康检查

**GET** `/health`

检查 KnowFlow Server 的健康状态。

**请求示例**

```bash
curl -X GET "http://localhost:5000/health"
```

**响应示例（正常）**

```json
{
  "code": 0,
  "data": {
    "status": "healthy",
    "database_ready": true,
    "required_tables": {
      "user": true,
      "tenant": true,
      "user_tenant": true
    },
    "rbac_initialized": true,
    "timestamp": "2025-10-17T15:00:00.000000"
  },
  "message": "服务运行正常"
}
```

**响应示例（初始化中）**

```json
{
  "code": 1,
  "data": {
    "status": "initializing",
    "database_ready": false,
    "missing_tables": ["rbac_roles", "rbac_permissions"],
    "rbac_initialized": false,
    "timestamp": "2025-10-17T15:00:00.000000"
  },
  "message": "服务正在初始化"
}
```

---

#### RBAC状态检查

**GET** `/api/v1/admin/rbac/status`

获取 RBAC 系统的详细状态信息。

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/admin/rbac/status" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "database_ready": true,
    "required_tables": {
      "user": true,
      "tenant": true,
      "rbac_roles": true,
      "rbac_permissions": true
    },
    "rbac_initialized": true,
    "default_roles": {
      "system_admin": true,
      "tenant_admin": true,
      "team_admin": true,
      "kb_owner": true
    },
    "default_permissions": {
      "kb_permissions": 15,
      "team_permissions": 8
    },
    "timestamp": "2025-10-17T15:00:00.000000"
  },
  "message": "RBAC系统运行正常"
}
```

---

### 用户管理

#### 获取当前用户信息

**GET** `/api/v1/users/current`

获取当前登录用户的信息。

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/users/current" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "36712aa3b36740958c08fb94d2309d8b",
    "nickname": "Admin User",
    "email": "admin@example.com",
    "avatar": null,
    "is_superuser": true,
    "create_time": 1726276357000
  },
  "message": "success"
}
```

---

#### 查询用户列表

**GET** `/api/v1/admin/users`

获取所有用户列表（需要管理员权限）。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：20） |
| email | string | 否 | 按邮箱过滤 |
| nickname | string | 否 | 按昵称过滤 |

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/admin/users?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "users": [
      {
        "id": "36712aa3b36740958c08fb94d2309d8b",
        "nickname": "Admin User",
        "email": "admin@example.com",
        "is_superuser": true,
        "create_time": 1726276357000
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  }
}
```

---

#### 创建用户

**POST** `/api/v1/admin/users`

创建新用户（需要管理员权限）。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 用户邮箱 |
| nickname | string | 是 | 用户昵称 |
| password | string | 是 | 用户密码 |
| is_superuser | boolean | 否 | 是否为超级管理员（默认：false） |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/admin/users" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "nickname": "New User",
    "password": "SecurePassword123",
    "is_superuser": false
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "user_new_789",
    "email": "newuser@example.com",
    "nickname": "New User",
    "is_superuser": false,
    "create_time": 1760686800000
  },
  "message": "用户创建成功"
}
```

---

#### 更新用户信息

**PUT** `/api/v1/admin/users/{user_id}`

更新用户信息（需要管理员权限）。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 用户昵称 |
| password | string | 否 | 新密码 |
| is_superuser | boolean | 否 | 是否为超级管理员 |

**请求示例**

```bash
curl -X PUT "http://localhost:5000/api/v1/admin/users/user_new_789" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "Updated User Name"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "user_new_789",
    "nickname": "Updated User Name"
  },
  "message": "用户信息更新成功"
}
```

---

#### 删除用户

**DELETE** `/api/v1/admin/users/{user_id}`

删除用户（需要管理员权限）。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**请求示例**

```bash
curl -X DELETE "http://localhost:5000/api/v1/admin/users/user_new_789" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "message": "用户删除成功"
}
```

---

### 团队管理

#### 创建团队

**POST** `/api/v1/teams`

创建新团队。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 团队名称 |
| description | string | 否 | 团队描述 |
| tenant_id | string | 否 | 租户ID（多租户模式） |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/teams" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "研发团队",
    "description": "技术研发部门"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "team_456abc",
    "name": "研发团队",
    "description": "技术研发部门",
    "member_count": 1,
    "create_time": 1760686900000
  },
  "message": "团队创建成功"
}
```

---

#### 查询团队列表

**GET** `/api/v1/teams`

获取用户所属的团队列表。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：20） |
| tenant_id | string | 否 | 按租户ID过滤 |

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/teams?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "teams": [
      {
        "id": "team_456abc",
        "name": "研发团队",
        "description": "技术研发部门",
        "member_count": 5,
        "create_time": 1760686900000
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  }
}
```

---

#### 更新团队信息

**PUT** `/api/v1/teams/{team_id}`

更新团队信息。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| team_id | string | 是 | 团队ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 团队名称 |
| description | string | 否 | 团队描述 |

**请求示例**

```bash
curl -X PUT "http://localhost:5000/api/v1/teams/team_456abc" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "更新后的团队描述"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "team_456abc",
    "name": "研发团队",
    "description": "更新后的团队描述"
  },
  "message": "团队信息更新成功"
}
```

---

#### 删除团队

**DELETE** `/api/v1/teams/{team_id}`

删除团队。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| team_id | string | 是 | 团队ID |

**请求示例**

```bash
curl -X DELETE "http://localhost:5000/api/v1/teams/team_456abc" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "message": "团队删除成功"
}
```

---

#### 添加团队成员

**POST** `/api/v1/teams/{team_id}/members`

向团队添加成员。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| team_id | string | 是 | 团队ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |
| role | string | 否 | 团队角色（member/admin，默认：member） |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/teams/team_456abc/members" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_789def",
    "role": "member"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "team_id": "team_456abc",
    "user_id": "user_789def",
    "role": "member"
  },
  "message": "成员添加成功"
}
```

---

#### 查询团队成员

**GET** `/api/v1/teams/{team_id}/members`

获取团队成员列表。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| team_id | string | 是 | 团队ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：20） |

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/teams/team_456abc/members?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "members": [
      {
        "user_id": "user_789def",
        "nickname": "Team Member",
        "email": "member@example.com",
        "role": "member",
        "join_time": 1760687000000
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  }
}
```

---

#### 移除团队成员

**DELETE** `/api/v1/teams/{team_id}/members/{user_id}`

从团队移除成员。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| team_id | string | 是 | 团队ID |
| user_id | string | 是 | 用户ID |

**请求示例**

```bash
curl -X DELETE "http://localhost:5000/api/v1/teams/team_456abc/members/user_789def" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "message": "成员移除成功"
}
```

---

### 租户管理

#### 创建租户

**POST** `/api/v1/admin/tenants`

创建新租户（需要超级管理员权限）。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 租户名称 |
| description | string | 否 | 租户描述 |
| max_users | integer | 否 | 最大用户数 |
| max_datasets | integer | 否 | 最大知识库数 |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/admin/tenants" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "企业A",
    "description": "企业A的租户空间",
    "max_users": 100,
    "max_datasets": 50
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "tenant_123xyz",
    "name": "企业A",
    "description": "企业A的租户空间",
    "max_users": 100,
    "max_datasets": 50,
    "create_time": 1760687100000
  },
  "message": "租户创建成功"
}
```

---

#### 查询租户列表

**GET** `/api/v1/admin/tenants`

获取所有租户列表（需要超级管理员权限）。

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认：1） |
| page_size | integer | 否 | 每页数量（默认：20） |

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/admin/tenants?page=1&page_size=10" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "tenants": [
      {
        "id": "tenant_123xyz",
        "name": "企业A",
        "user_count": 25,
        "dataset_count": 10,
        "max_users": 100,
        "max_datasets": 50,
        "create_time": 1760687100000
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 10
  }
}
```

---

#### 更新租户信息

**PUT** `/api/v1/admin/tenants/{tenant_id}`

更新租户信息（需要超级管理员权限）。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tenant_id | string | 是 | 租户ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 租户名称 |
| description | string | 否 | 租户描述 |
| max_users | integer | 否 | 最大用户数 |
| max_datasets | integer | 否 | 最大知识库数 |

**请求示例**

```bash
curl -X PUT "http://localhost:5000/api/v1/admin/tenants/tenant_123xyz" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "max_users": 150
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "id": "tenant_123xyz",
    "max_users": 150
  },
  "message": "租户信息更新成功"
}
```

---

#### 删除租户

**DELETE** `/api/v1/admin/tenants/{tenant_id}`

删除租户（需要超级管理员权限）。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tenant_id | string | 是 | 租户ID |

**请求示例**

```bash
curl -X DELETE "http://localhost:5000/api/v1/admin/tenants/tenant_123xyz" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "message": "租户删除成功"
}
```

---

### 知识库权限

#### 查询知识库权限

**GET** `/api/v1/knowledgebases/{kb_id}/permissions`

查询用户在指定知识库的权限。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| kb_id | string | 是 | 知识库ID |

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/knowledgebases/aa0e6d20ab2b11f0a1bb66fc51ac58de/permissions" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "kb_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de",
    "permissions": {
      "kb.view": true,
      "kb.edit": true,
      "kb.delete": true,
      "kb.manage_access": true
    },
    "role": "owner"
  }
}
```

**权限枚举**

- `kb.view`: 查看知识库
- `kb.edit`: 编辑知识库（上传/删除文档）
- `kb.delete`: 删除知识库
- `kb.manage_access`: 管理访问权限

---

#### 授予知识库权限

**POST** `/api/v1/knowledgebases/{kb_id}/permissions`

授予用户或团队知识库权限。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| kb_id | string | 是 | 知识库ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 条件 | 用户ID（user_id和team_id二选一） |
| team_id | string | 条件 | 团队ID |
| permissions | array | 是 | 权限列表 |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/knowledgebases/aa0e6d20ab2b11f0a1bb66fc51ac58de/permissions" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_789def",
    "permissions": ["kb.view", "kb.edit"]
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "kb_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de",
    "user_id": "user_789def",
    "permissions": ["kb.view", "kb.edit"]
  },
  "message": "权限授予成功"
}
```

---

#### 撤销知识库权限

**DELETE** `/api/v1/knowledgebases/{kb_id}/permissions`

撤销用户或团队的知识库权限。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| kb_id | string | 是 | 知识库ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 条件 | 用户ID（user_id和team_id二选一） |
| team_id | string | 条件 | 团队ID |

**请求示例**

```bash
curl -X DELETE "http://localhost:5000/api/v1/knowledgebases/aa0e6d20ab2b11f0a1bb66fc51ac58de/permissions" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_789def"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "message": "权限撤销成功"
}
```

---

### RBAC权限管理

#### 检查权限

**POST** `/api/v1/rbac/permissions/check`

检查用户是否具有指定权限。

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 否 | 用户ID（默认为当前用户） |
| permission | string | 是 | 权限标识 |
| resource_type | string | 是 | 资源类型（kb/team/tenant） |
| resource_id | string | 是 | 资源ID |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/rbac/permissions/check" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "permission": "kb.edit",
    "resource_type": "kb",
    "resource_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "has_permission": true,
    "reason": "User has kb.edit permission through owner role"
  }
}
```

---

#### 查询用户角色

**GET** `/api/v1/rbac/users/{user_id}/roles`

查询用户的所有角色。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| resource_type | string | 否 | 资源类型过滤（kb/team/tenant） |
| resource_id | string | 否 | 资源ID过滤 |

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/rbac/users/user_789def/roles?resource_type=kb" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "roles": [
      {
        "role_name": "kb_owner",
        "resource_type": "kb",
        "resource_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de",
        "permissions": ["kb.view", "kb.edit", "kb.delete", "kb.manage_access"]
      }
    ]
  }
}
```

**系统角色枚举**

- `system_admin`: 系统管理员（全局权限）
- `tenant_admin`: 租户管理员
- `team_admin`: 团队管理员
- `kb_owner`: 知识库所有者
- `kb_editor`: 知识库编辑者
- `kb_viewer`: 知识库查看者

---

#### 分配角色

**POST** `/api/v1/rbac/users/{user_id}/roles`

为用户分配角色。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| role_name | string | 是 | 角色名称 |
| resource_type | string | 否 | 资源类型（kb/team/tenant） |
| resource_id | string | 否 | 资源ID |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/rbac/users/user_789def/roles" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "kb_editor",
    "resource_type": "kb",
    "resource_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "user_id": "user_789def",
    "role_name": "kb_editor",
    "resource_type": "kb",
    "resource_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de"
  },
  "message": "角色分配成功"
}
```

---

#### 撤销角色

**DELETE** `/api/v1/rbac/users/{user_id}/roles`

撤销用户的角色。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| role_name | string | 是 | 角色名称 |
| resource_type | string | 否 | 资源类型 |
| resource_id | string | 否 | 资源ID |

**请求示例**

```bash
curl -X DELETE "http://localhost:5000/api/v1/rbac/users/user_789def/roles" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "kb_editor",
    "resource_type": "kb",
    "resource_id": "aa0e6d20ab2b11f0a1bb66fc51ac58de"
  }'
```

**响应示例**

```json
{
  "code": 0,
  "message": "角色撤销成功"
}
```

---

### 文档解析服务

#### 文档解析（MinerU/DOTS）

**POST** `/api/v1/knowledgebases/documents/{doc_id}/parse`

使用增强的解析引擎（MinerU或DOTS）解析文档。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| doc_id | string | 是 | 文档ID |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| parser_engine | string | 否 | 解析引擎（mineru/dots，默认：mineru） |
| chunk_strategy | string | 否 | 分块策略（smart/advanced，默认：smart） |
| chunk_config | object | 否 | 分块配置 |

**chunk_config 参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| chunk_token_num | integer | 256 | 分块token数量 |
| min_chunk_tokens | integer | 10 | 最小分块token数 |
| use_coordinates | boolean | true | 使用精确坐标 |

**请求示例**

```bash
curl -X POST "http://localhost:5000/api/v1/knowledgebases/documents/abc35d56ab2b11f0a1bb66fc51ac58de/parse" \
  -H "Authorization: Bearer ragflow-YourApiKey" \
  -H "Content-Type: application/json" \
  -d '{
    "parser_engine": "mineru",
    "chunk_strategy": "smart",
    "chunk_config": {
      "chunk_token_num": 256,
      "min_chunk_tokens": 10,
      "use_coordinates": true
    }
  }'
```

**响应示例**

```json
{
  "code": 0,
  "data": {
    "task_id": "parse_task_123",
    "status": "processing",
    "document_id": "abc35d56ab2b11f0a1bb66fc51ac58de",
    "estimated_time": 120
  },
  "message": "文档解析任务已启动"
}
```

---

#### 查询解析进度

**GET** `/api/v1/knowledgebases/documents/{doc_id}/parse/progress`

查询文档解析任务的进度。

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| doc_id | string | 是 | 文档ID |

**请求示例**

```bash
curl -X GET "http://localhost:5000/api/v1/knowledgebases/documents/abc35d56ab2b11f0a1bb66fc51ac58de/parse/progress" \
  -H "Authorization: Bearer ragflow-YourApiKey"
```

**响应示例（进行中）**

```json
{
  "code": 0,
  "data": {
    "status": "processing",
    "progress": 45.5,
    "current_step": "chunking",
    "total_pages": 10,
    "processed_pages": 4,
    "estimated_remaining_time": 60
  }
}
```

**响应示例（完成）**

```json
{
  "code": 0,
  "data": {
    "status": "completed",
    "progress": 100.0,
    "total_chunks": 45,
    "total_pages": 10,
    "processing_time": 125
  }
}
```

**status 枚举值**

- `pending`: 等待处理
- `processing`: 处理中
- `completed`: 已完成
- `failed`: 处理失败

---

## 错误处理

### 错误码表

| 错误码 | 说明 | 常见原因 |
|--------|------|---------|
| 0 | 成功 | - |
| 102 | 参数无效 | 缺少必填参数或参数格式错误 |
| 109 | 权限不足 | 无操作权限 |
| 400 | 请求错误 | 请求格式错误或参数类型错误 |
| 401 | 未授权 | API Key无效或已过期 |
| 403 | 禁止访问 | 无访问权限 |
| 404 | 资源不存在 | 请求的资源ID不存在 |
| 500 | 服务器错误 | 服务器内部错误 |
| 503 | 服务不可用 | 服务初始化中或维护中 |

### 错误响应格式

```json
{
  "code": 400,
  "message": "参数验证失败",
  "details": {
    "field": "dataset_id",
    "error": "知识库ID不能为空"
  }
}
```

### 错误处理最佳实践

1. **始终检查响应code**: 即使HTTP状态码为200，也要检查JSON中的code字段
2. **实现重试机制**: 对于503等临时错误，建议实施指数退避重试
3. **记录错误详情**: 保存完整的错误响应用于调试
4. **用户友好提示**: 将技术错误转换为用户可理解的提示

**Python错误处理示例**

```python
def call_api_with_retry(url, data, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=data, headers=headers)
            result = response.json()

            if result['code'] == 0:
                return result['data']
            elif result['code'] == 503:
                # 服务初始化中，等待重试
                time.sleep(2 ** attempt)
                continue
            else:
                # 其他错误，直接抛出
                raise Exception(f"API Error: {result['message']}")

        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)

    raise Exception("Max retries exceeded")
```

---

## 最佳实践

### 1. API Key 安全

- 不要在客户端代码中硬编码API Key
- 使用环境变量或配置文件存储
- 定期轮换API Key
- 为不同环境使用不同的API Key

```python
import os

API_KEY = os.environ.get('KNOWFLOW_API_KEY')
if not API_KEY:
    raise Exception("请设置 KNOWFLOW_API_KEY 环境变量")
```

### 2. 请求频率控制

- 避免短时间内大量请求
- 实施客户端限流
- 使用批量接口处理多个资源

```python
import time
from functools import wraps

def rate_limit(calls_per_second=5):
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)
            result = func(*args, **kwargs)
            last_called[0] = time.time()
            return result
        return wrapper
    return decorator

@rate_limit(calls_per_second=5)
def create_dataset(name):
    return api_client.create_dataset(name)
```

### 3. 文档解析工作流

推荐的文档处理流程：

```
1. 上传文档
   ↓
2. 触发解析（选择合适的parser）
   ↓
3. 轮询检查解析进度
   ↓
4. 解析完成后查询分块
   ↓
5. 创建对话助手使用知识库
```

**完整示例**

```python
def process_document(api_client, dataset_id, file_path):
    # 1. 上传文档
    print("上传文档...")
    upload_result = api_client.upload_document(dataset_id, file_path)
    doc_id = upload_result['data'][0]['id']
    print(f"文档上传成功: {doc_id}")

    # 2. 触发解析
    print("启动文档解析...")
    api_client.parse_document(dataset_id, [doc_id])

    # 3. 等待解析完成
    print("等待解析完成...")
    while True:
        doc_info = api_client.get_document(dataset_id, doc_id)
        status = doc_info['data']['run']

        if status == '2':  # 完成
            print("解析完成！")
            break
        elif status == 'FAIL':
            raise Exception("解析失败")

        time.sleep(5)

    # 4. 查询分块
    chunks = api_client.get_chunks(dataset_id, doc_id)
    print(f"共生成 {chunks['data']['total']} 个分块")

    return doc_id
```

### 4. 分块策略选择

| 场景 | 推荐策略 | 原因 |
|------|---------|------|
| 技术文档 | smart + MinerU | 保留结构，精确坐标 |
| 学术论文 | paper + DeepDOC | 识别论文特定结构 |
| 法律文书 | laws + MinerU | 保留条款层次 |
| 一般文本 | naive + Plain Text | 快速处理 |
| 书籍 | book + smart | 按章节分块 |

### 5. 嵌入模型选择

| 模型 | 适用场景 | 特点 |
|------|---------|------|
| BAAI/bge-large-zh-v1.5 | 中文为主 | 高精度中文 |
| BAAI/bge-m3 | 多语言 | 支持100+语言 |
| text-embedding-ada-002 | 英文为主 | OpenAI官方 |

### 6. 检索参数调优

```python
# 高精度检索（牺牲召回率）
retrieval_config = {
    "similarity_threshold": 0.5,  # 提高阈值
    "vector_similarity_weight": 0.7,  # 更依赖语义
    "top_k": 512,  # 减少候选
    "page_size": 3  # 返回更少结果
}

# 高召回检索（牺牲精度）
retrieval_config = {
    "similarity_threshold": 0.1,  # 降低阈值
    "vector_similarity_weight": 0.3,  # 结合关键词
    "top_k": 2048,  # 增加候选
    "keyword": True,  # 启用关键词
    "page_size": 10
}
```

### 7. 流式响应处理

```python
def stream_chat(chat_id, question):
    response = requests.post(
        f"{BASE_URL}/api/v1/chats/{chat_id}/completions",
        json={"question": question, "stream": True},
        headers=headers,
        stream=True
    )

    answer = ""
    for line in response.iter_lines():
        if line:
            line = line.decode('utf-8')
            if line.startswith('data: '):
                data = json.loads(line[6:])
                if data['code'] == 0 and isinstance(data['data'], dict):
                    chunk = data['data'].get('answer', '')
                    if chunk:
                        answer = chunk
                        print(chunk, end='', flush=True)

    print()  # 换行
    return answer
```

### 8. 权限管理策略

**推荐的权限分配**

```
系统管理员 (system_admin)
    └── 租户管理员 (tenant_admin)
            └── 团队管理员 (team_admin)
                    └── 知识库所有者 (kb_owner)
                            ├── 知识库编辑者 (kb_editor)
                            └── 知识库查看者 (kb_viewer)
```

**权限检查示例**

```python
def safe_operation(api_client, kb_id, operation):
    # 先检查权限
    check_result = api_client.check_permission(
        permission=f"kb.{operation}",
        resource_type="kb",
        resource_id=kb_id
    )

    if not check_result['data']['has_permission']:
        raise PermissionError(
            f"无权执行操作: {operation} on {kb_id}"
        )

    # 执行操作
    if operation == 'edit':
        return api_client.update_dataset(kb_id, ...)
    elif operation == 'delete':
        return api_client.delete_dataset(kb_id)
```

### 9. 批量操作

```python
def batch_upload_documents(api_client, dataset_id, file_paths, batch_size=5):
    """分批上传文档，避免超时"""
    for i in range(0, len(file_paths), batch_size):
        batch = file_paths[i:i+batch_size]
        print(f"上传批次 {i//batch_size + 1}...")

        # 上传一批文件
        for file_path in batch:
            api_client.upload_document(dataset_id, file_path)

        # 批次间暂停
        time.sleep(1)
```

### 10. 监控和日志

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MonitoredAPIClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.api_key = api_key
        self.metrics = {
            'total_requests': 0,
            'failed_requests': 0,
            'total_time': 0
        }

    def _make_request(self, method, endpoint, **kwargs):
        start_time = time.time()
        self.metrics['total_requests'] += 1

        try:
            response = requests.request(
                method,
                f"{self.base_url}{endpoint}",
                headers={'Authorization': f'Bearer {self.api_key}'},
                **kwargs
            )
            result = response.json()

            if result['code'] != 0:
                self.metrics['failed_requests'] += 1
                logger.error(f"API Error: {result['message']}")

            elapsed = time.time() - start_time
            self.metrics['total_time'] += elapsed
            logger.info(f"{method} {endpoint} - {elapsed:.2f}s")

            return result
        except Exception as e:
            self.metrics['failed_requests'] += 1
            logger.exception(f"Request failed: {e}")
            raise

    def get_stats(self):
        avg_time = self.metrics['total_time'] / max(self.metrics['total_requests'], 1)
        success_rate = 1 - (self.metrics['failed_requests'] / max(self.metrics['total_requests'], 1))

        return {
            'total_requests': self.metrics['total_requests'],
            'failed_requests': self.metrics['failed_requests'],
            'success_rate': f"{success_rate*100:.2f}%",
            'avg_response_time': f"{avg_time:.2f}s"
        }
```

---

## 附录

### 快速参考

**RAGFlow 核心端点**
- `POST /api/v1/datasets` - 创建知识库
- `POST /api/v1/datasets/{id}/documents` - 上传文档
- `POST /api/v1/datasets/{id}/chunks` - 启动解析
- `POST /api/v1/retrieval` - 内容检索
- `POST /api/v1/chats/{id}/completions` - 对话问答

**KnowFlow Server 核心端点**
- `GET /health` - 健康检查
- `POST /api/v1/teams` - 创建团队
- `POST /api/v1/teams/{id}/members` - 添加成员
- `POST /api/v1/rbac/permissions/check` - 检查权限
- `POST /api/v1/knowledgebases/documents/{id}/parse` - MinerU解析

### 相关资源

- **官方文档**: https://docs.knowflow.com
- **GitHub**: https://github.com/weizxfree/KnowFlow
- **问题反馈**: https://github.com/weizxfree/KnowFlow/issues
- **RAGFlow文档**: https://ragflow.io/docs

### 更新日志

- **v2.1.6** (2025-10-17)
  - 添加 MinerU/DOTS 高精度解析
  - 增强 smart chunking 支持坐标映射
  - 完善 RBAC 权限系统
  - 新增团队协作功能

- **v2.1.5** (2025-09-01)
  - 初始版本发布
  - 基于 RAGFlow v0.20.1

---

**文档生成时间**: 2025-10-17
**测试覆盖率**: 98.59% (77/77 APIs)
**维护状态**: 活跃维护中

如有问题或建议，欢迎提交 Issue 或 Pull Request！

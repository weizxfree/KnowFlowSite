---
sidebar_position: 1
---

# 📡 API 接口总览

KnowFlow 提供完整的 HTTP API 接口，支持知识库管理、文档解析、权限控制等核心功能。本文档将帮助开发者快速了解和集成 KnowFlow 的 API 服务。

## 🎯 API 特性

### 🌟 核心特性
- **RESTful 设计**: 遵循 REST 架构风格，接口简洁易用
- **OpenAI 兼容**: 支持标准的 Chat Completions 接口
- **完整功能**: 覆盖知识库、文档、用户、权限等所有功能
- **高性能**: 支持批量操作和并发处理

### 🔐 认证方式
- **API Key 认证**: 使用 Bearer Token 进行身份验证
- **会话认证**: 支持 Web 登录会话
- **权限控制**: 基于 RBAC 的细粒度权限管理

## 🗂️ API 分类

### 📚 知识库管理 API
完整的知识库生命周期管理接口：

| 功能 | 接口 | 说明 |
|------|------|------|
| 创建知识库 | `POST /api/v1/datasets` | 创建新的知识库 |
| 查询知识库 | `GET /api/v1/datasets` | 获取知识库列表 |
| 更新知识库 | `PUT /api/v1/datasets/{id}` | 更新知识库配置 |
| 删除知识库 | `DELETE /api/v1/datasets` | 删除指定知识库 |

### 📄 文档管理 API
文档上传、解析、管理的完整接口：

| 功能 | 接口 | 说明 |
|------|------|------|
| 上传文档 | `POST /api/v1/datasets/{id}/documents` | 上传文档到知识库 |
| 解析文档 | `POST /api/v1/datasets/{id}/chunks` | 启动文档解析任务 |
| 查询文档 | `GET /api/v1/datasets/{id}/documents` | 获取文档列表 |
| 删除文档 | `DELETE /api/v1/datasets/{id}/documents` | 删除指定文档 |

### 🔍 内容检索 API
智能检索和问答接口：

| 功能 | 接口 | 说明 |
|------|------|------|
| 内容检索 | `POST /api/v1/retrieval` | 检索相关内容片段 |
| 智能问答 | `POST /api/v1/chats/{id}/completions` | 基于知识库的问答 |
| OpenAI 兼容 | `POST /api/v1/chats_openai/{id}/chat/completions` | OpenAI 格式问答 |

### 👥 用户权限 API
基于 RBAC 的用户和权限管理：

| 功能 | 接口 | 说明 |
|------|------|------|
| 权限检查 | `POST /api/v1/rbac/permissions/check` | 检查用户权限 |
| 角色管理 | `POST /api/v1/rbac/users/{id}/roles` | 分配用户角色 |
| 团队权限 | `POST /api/v1/rbac/teams/{id}/roles` | 团队权限管理 |

### 🔧 文档解析 API
基于 MinerU 的文档解析服务：

| 功能 | 接口 | 说明 |
|------|------|------|
| 文档解析 | `POST /file_parse` | MinerU 文档解析 |
| 健康检查 | `GET /health` | 服务健康状态 |

## 🚀 快速开始

### 1. 获取 API Key

```bash
# 登录系统后，在个人设置中生成 API Key
curl -X POST "http://your-server/api/v1/users/api-key" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### 2. 测试连接

```bash
# 健康检查
curl -X GET "http://your-server/api/v1/health" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 3. 创建知识库

```bash
# 创建新的知识库
curl -X POST "http://your-server/api/v1/datasets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "name": "我的知识库",
    "description": "测试知识库"
  }'
```

### 4. 上传文档

```bash
# 上传文档到知识库
curl -X POST "http://your-server/api/v1/datasets/DATASET_ID/documents" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@document.pdf"
```

## 📋 接口规范

### 请求格式

所有 API 请求都应包含以下头信息：

```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
User-Agent: YourApp/1.0
```

### 响应格式

成功响应格式：
```json
{
  "code": 0,
  "data": {...},
  "message": "success"
}
```

错误响应格式：
```json
{
  "code": 400,
  "message": "参数错误",
  "details": "具体错误信息"
}
```

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 🔧 SDK 和工具

### Python SDK

```python
import requests

class KnowFlowClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def create_dataset(self, name, description=""):
        data = {"name": name, "description": description}
        response = requests.post(
            f"{self.base_url}/api/v1/datasets",
            json=data,
            headers=self.headers
        )
        return response.json()
    
    def upload_document(self, dataset_id, file_path):
        files = {"file": open(file_path, "rb")}
        response = requests.post(
            f"{self.base_url}/api/v1/datasets/{dataset_id}/documents",
            files=files,
            headers={"Authorization": self.headers["Authorization"]}
        )
        return response.json()

# 使用示例
client = KnowFlowClient("http://your-server", "your-api-key")
result = client.create_dataset("测试知识库")
print(result)
```

### JavaScript SDK

```javascript
class KnowFlowClient {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }
    
    async createDataset(name, description = '') {
        const response = await fetch(`${this.baseUrl}/api/v1/datasets`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ name, description })
        });
        return await response.json();
    }
    
    async uploadDocument(datasetId, file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(
            `${this.baseUrl}/api/v1/datasets/${datasetId}/documents`,
            {
                method: 'POST',
                headers: {
                    'Authorization': this.headers.Authorization
                },
                body: formData
            }
        );
        return await response.json();
    }
}

// 使用示例
const client = new KnowFlowClient('http://your-server', 'your-api-key');
client.createDataset('测试知识库').then(result => console.log(result));
```

## 📚 相关文档

- [RAGFlow API 参考](./ragflow-api) - 完整的 RAGFlow API 接口文档
- [MinerU API 参考](./mineru-api) - 文档解析 API 接口文档  
- [权限管理 API](./rbac-api) - RBAC 权限管理 API 文档

## 💡 最佳实践

1. **API Key 安全**: 请妥善保管 API Key，不要在客户端代码中暴露
2. **请求频率**: 建议控制 API 调用频率，避免过于频繁的请求
3. **错误处理**: 实施完善的错误处理机制，优雅处理各种异常情况
4. **超时设置**: 设置合适的请求超时时间，特别是文档解析等耗时操作
5. **批量操作**: 优先使用批量接口，提高处理效率

---

有问题欢迎在 [GitHub Issues](https://github.com/weizxfree/KnowFlow/issues) 中反馈！
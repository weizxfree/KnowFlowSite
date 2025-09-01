---
sidebar_position: 2
---

# 🔥 RAGFlow API 参考

KnowFlow 完全兼容 RAGFlow 的 HTTP API 接口，支持知识库管理、文档处理、智能问答等完整功能。本文档基于 RAGFlow v0.20.1 版本。

## 🔐 认证方式

### API Key 获取

登录 KnowFlow 系统后，在用户设置中可以生成和管理 API Key：

1. 进入"个人设置" → "API 密钥"
2. 点击"生成新密钥"
3. 复制并保存密钥（仅显示一次）

### 认证头设置

所有 API 请求都需要在 Header 中包含认证信息：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## 📚 知识库管理

### 创建知识库

**接口地址:** `POST /api/v1/datasets`

**请求参数:**
```json
{
    "name": "我的知识库",
    "description": "知识库描述",
    "embedding_model": "BAAI/bge-large-zh-v1.5@BAAI",
    "permission": "me",
    "chunk_method": "naive",
    "parser_config": {
        "chunk_token_num": 512,
        "delimiter": "\n",
        "html4excel": false,
        "layout_recognize": "DeepDOC",
        "raptor": {"use_raptor": false},
        "graphrag": {"use_graphrag": false}
    }
}
```

**响应示例:**
```json
{
    "code": 0,
    "data": {
        "id": "dataset_id_123",
        "name": "我的知识库",
        "chunk_count": 0,
        "document_count": 0,
        "status": "1",
        "created_by": "user_id_456",
        "create_time": 1745836841611
    }
}
```

### 查询知识库列表

**接口地址:** `GET /api/v1/datasets`

**查询参数:**
- `page`: 页码（默认 1）
- `page_size`: 每页数量（默认 30）
- `orderby`: 排序字段（create_time/update_time）
- `desc`: 降序排列（true/false）
- `name`: 知识库名称过滤
- `id`: 知识库 ID 过滤

**请求示例:**
```bash
curl -X GET "http://your-server/api/v1/datasets?page=1&page_size=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**响应示例:**
```json
{
    "code": 0,
    "data": [
        {
            "id": "dataset_123",
            "name": "技术文档库",
            "chunk_count": 156,
            "document_count": 12,
            "embedding_model": "BAAI/bge-large-zh-v1.5",
            "status": "1",
            "create_time": 1726276357324
        }
    ]
}
```

### 更新知识库

**接口地址:** `PUT /api/v1/datasets/{dataset_id}`

**请求参数:**
```json
{
    "name": "更新后的知识库名称",
    "description": "更新后的描述",
    "embedding_model": "BAAI/bge-base-zh-v1.5@BAAI",
    "chunk_method": "naive",
    "parser_config": {
        "chunk_token_num": 1024,
        "delimiter": "\n"
    }
}
```

### 删除知识库

**接口地址:** `DELETE /api/v1/datasets`

**请求参数:**
```json
{
    "ids": ["dataset_id_1", "dataset_id_2"]
}
```

**注意**: 如果 `ids` 为 `null`，将删除所有知识库。

## 📄 文档管理

### 上传文档

**接口地址:** `POST /api/v1/datasets/{dataset_id}/documents`

**请求方式:** `multipart/form-data`

**请求示例:**
```bash
curl -X POST "http://your-server/api/v1/datasets/dataset_123/documents" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@document.pdf" \
  -F "file=@image.png"
```

**支持格式:**
- PDF 文档
- Office 文档（Word、Excel、PowerPoint）
- 图片文件（PNG、JPG、JPEG、BMP、TIFF）
- 文本文件（TXT、MD）

**响应示例:**
```json
{
    "code": 0,
    "data": [
        {
            "id": "doc_456",
            "name": "document.pdf",
            "size": 1024000,
            "chunk_method": "naive",
            "run": "UNSTART",
            "type": "doc",
            "parser_config": {
                "chunk_token_num": 512,
                "delimiter": "\n",
                "layout_recognize": true
            }
        }
    ]
}
```

### 查询文档列表

**接口地址:** `GET /api/v1/datasets/{dataset_id}/documents`

**查询参数:**
- `page`: 页码
- `page_size`: 每页数量
- `keywords`: 关键词搜索
- `id`: 文档 ID
- `name`: 文档名称
- `create_time_from`: 创建时间起始
- `create_time_to`: 创建时间结束

**响应示例:**
```json
{
    "code": 0,
    "data": {
        "docs": [
            {
                "id": "doc_456",
                "name": "技术手册.pdf",
                "chunk_count": 45,
                "size": 2048000,
                "progress": 100.0,
                "run": "2",
                "create_time": 1728897061948
            }
        ],
        "total": 1
    }
}
```

### 启动文档解析

**接口地址:** `POST /api/v1/datasets/{dataset_id}/chunks`

**请求参数:**
```json
{
    "document_ids": ["doc_456", "doc_789"]
}
```

**响应示例:**
```json
{
    "code": 0,
    "message": "文档解析任务已启动"
}
```

### 停止文档解析

**接口地址:** `DELETE /api/v1/datasets/{dataset_id}/chunks`

**请求参数:**
```json
{
    "document_ids": ["doc_456", "doc_789"]
}
```

### 删除文档

**接口地址:** `DELETE /api/v1/datasets/{dataset_id}/documents`

**请求参数:**
```json
{
    "ids": ["doc_456", "doc_789"]
}
```

## 🔍 内容检索

### 检索相关内容

**接口地址:** `POST /api/v1/retrieval`

**请求参数:**
```json
{
    "question": "什么是机器学习？",
    "dataset_ids": ["dataset_123"],
    "document_ids": ["doc_456"],
    "page": 1,
    "page_size": 10,
    "similarity_threshold": 0.2,
    "vector_similarity_weight": 0.3,
    "top_k": 1024,
    "keyword": false,
    "highlight": true
}
```

**请求示例:**
```bash
curl -X POST "http://your-server/api/v1/retrieval" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "question": "什么是深度学习？",
    "dataset_ids": ["dataset_123"]
  }'
```

**响应示例:**
```json
{
    "code": 0,
    "data": {
        "chunks": [
            {
                "id": "chunk_789",
                "content": "深度学习是机器学习的一个分支...",
                "document_id": "doc_456",
                "document_keyword": "AI技术手册.pdf",
                "similarity": 0.87,
                "vector_similarity": 0.82,
                "term_similarity": 0.92,
                "highlight": "<em>深度学习</em>是机器学习的一个分支..."
            }
        ],
        "doc_aggs": [
            {
                "doc_name": "AI技术手册.pdf",
                "doc_id": "doc_456",
                "count": 3
            }
        ],
        "total": 1
    }
}
```

## 🤖 智能问答

### 创建对话助手

**接口地址:** `POST /api/v1/chats`

**请求参数:**
```json
{
    "name": "技术顾问",
    "dataset_ids": ["dataset_123"],
    "description": "专业技术问答助手",
    "llm": {
        "model_name": "gpt-4",
        "temperature": 0.1,
        "top_p": 0.3,
        "presence_penalty": 0.4,
        "frequency_penalty": 0.7
    },
    "prompt": {
        "similarity_threshold": 0.2,
        "keywords_similarity_weight": 0.3,
        "top_n": 6,
        "opener": "您好！我是技术顾问，有什么可以帮助您的？",
        "prompt": "你是一个专业的技术顾问，请基于知识库内容回答用户问题。"
    }
}
```

**响应示例:**
```json
{
    "code": 0,
    "data": {
        "id": "chat_789",
        "name": "技术顾问",
        "dataset_ids": ["dataset_123"],
        "status": "1",
        "create_time": 1729768709023
    }
}
```

### 发起对话

**接口地址:** `POST /api/v1/chats/{chat_id}/completions`

**请求参数:**
```json
{
    "question": "请解释一下什么是神经网络？",
    "stream": true,
    "session_id": "session_456"
}
```

**流式响应示例:**
```json
data: {"code": 0, "data": {"answer": "神经网络是", "session_id": "session_456"}}
data: {"code": 0, "data": {"answer": "神经网络是一种", "session_id": "session_456"}}
data: {"code": 0, "data": {"answer": "神经网络是一种模拟人脑", "session_id": "session_456"}}
data: {"code": 0, "data": true}
```

### OpenAI 兼容接口

**接口地址:** `POST /api/v1/chats_openai/{chat_id}/chat/completions`

**请求参数:**
```json
{
    "model": "gpt-4",
    "messages": [
        {"role": "user", "content": "什么是深度学习？"}
    ],
    "stream": true,
    "temperature": 0.7
}
```

**请求示例:**
```bash
curl -X POST "http://your-server/api/v1/chats_openai/chat_123/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "什么是机器学习？"}],
    "stream": false
  }'
```

**响应格式:**
```json
{
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1677652288,
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

## 📝 内容分块管理

### 查询文档分块

**接口地址:** `GET /api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`

**查询参数:**
- `keywords`: 关键词搜索
- `page`: 页码
- `page_size`: 每页数量
- `id`: 分块 ID

**响应示例:**
```json
{
    "code": 0,
    "data": {
        "chunks": [
            {
                "id": "chunk_123",
                "content": "机器学习是一种人工智能技术...",
                "document_id": "doc_456",
                "available": true,
                "important_keywords": ["机器学习", "人工智能"],
                "positions": ["page_1"]
            }
        ],
        "total": 1
    }
}
```

### 添加分块内容

**接口地址:** `POST /api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`

**请求参数:**
```json
{
    "content": "这是新增的内容分块",
    "important_keywords": ["关键词1", "关键词2"],
    "questions": ["相关问题1", "相关问题2"]
}
```

### 更新分块内容

**接口地址:** `PUT /api/v1/datasets/{dataset_id}/documents/{document_id}/chunks/{chunk_id}`

**请求参数:**
```json
{
    "content": "更新后的内容",
    "important_keywords": ["新关键词"],
    "available": true
}
```

### 删除分块内容

**接口地址:** `DELETE /api/v1/datasets/{dataset_id}/documents/{document_id}/chunks`

**请求参数:**
```json
{
    "chunk_ids": ["chunk_123", "chunk_456"]
}
```

## 📊 知识图谱

### 获取知识图谱

**接口地址:** `GET /api/v1/datasets/{dataset_id}/knowledge_graph`

**响应示例:**
```json
{
    "code": 0,
    "data": {
        "graph": {
            "nodes": [
                {
                    "id": "entity_1",
                    "entity_name": "机器学习",
                    "entity_type": "CONCEPT",
                    "description": "一种人工智能技术",
                    "pagerank": 0.85
                }
            ],
            "edges": [
                {
                    "source": "entity_1",
                    "target": "entity_2",
                    "description": "机器学习包含深度学习",
                    "weight": 0.9
                }
            ]
        }
    }
}
```

### 删除知识图谱

**接口地址:** `DELETE /api/v1/datasets/{dataset_id}/knowledge_graph`

## ⚠️ 错误处理

### 错误码说明

| 错误码 | 说明 | 处理建议 |
|--------|------|---------|
| 400 | 请求参数错误 | 检查参数格式和必填项 |
| 401 | 未授权访问 | 检查 API Key 是否正确 |
| 403 | 权限不足 | 联系管理员获取相应权限 |
| 404 | 资源不存在 | 检查资源 ID 是否正确 |
| 500 | 服务器内部错误 | 联系技术支持 |

### 错误响应格式

```json
{
    "code": 400,
    "message": "参数验证失败",
    "details": {
        "field": "dataset_id",
        "error": "数据集ID不能为空"
    }
}
```

## 🚀 使用示例

### Python 完整示例

```python
import requests
import json
import time

class KnowFlowAPI:
    def __init__(self, base_url, api_key):
        self.base_url = base_url.rstrip('/')
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def create_dataset(self, name, description=""):
        """创建知识库"""
        data = {
            "name": name,
            "description": description,
            "chunk_method": "naive"
        }
        
        response = requests.post(
            f"{self.base_url}/api/v1/datasets",
            json=data,
            headers=self.headers
        )
        
        return response.json()
    
    def upload_document(self, dataset_id, file_path):
        """上传文档"""
        files = {'file': open(file_path, 'rb')}
        headers = {'Authorization': self.headers['Authorization']}
        
        response = requests.post(
            f"{self.base_url}/api/v1/datasets/{dataset_id}/documents",
            files=files,
            headers=headers
        )
        
        return response.json()
    
    def parse_document(self, dataset_id, document_ids):
        """解析文档"""
        data = {"document_ids": document_ids}
        
        response = requests.post(
            f"{self.base_url}/api/v1/datasets/{dataset_id}/chunks",
            json=data,
            headers=self.headers
        )
        
        return response.json()
    
    def create_chat_assistant(self, name, dataset_ids):
        """创建对话助手"""
        data = {
            "name": name,
            "dataset_ids": dataset_ids
        }
        
        response = requests.post(
            f"{self.base_url}/api/v1/chats",
            json=data,
            headers=self.headers
        )
        
        return response.json()
    
    def chat(self, chat_id, question, stream=False):
        """发起对话"""
        data = {
            "question": question,
            "stream": stream
        }
        
        response = requests.post(
            f"{self.base_url}/api/v1/chats/{chat_id}/completions",
            json=data,
            headers=self.headers,
            stream=stream
        )
        
        if stream:
            # 处理流式响应
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        yield json.loads(line[6:])
        else:
            return response.json()

# 使用示例
if __name__ == "__main__":
    api = KnowFlowAPI("http://localhost", "your-api-key")
    
    # 1. 创建知识库
    dataset = api.create_dataset("技术文档库", "存储技术相关文档")
    dataset_id = dataset['data']['id']
    print(f"创建知识库: {dataset_id}")
    
    # 2. 上传文档
    doc_result = api.upload_document(dataset_id, "document.pdf")
    doc_id = doc_result['data'][0]['id']
    print(f"上传文档: {doc_id}")
    
    # 3. 解析文档
    parse_result = api.parse_document(dataset_id, [doc_id])
    print("文档解析已启动")
    
    # 4. 等待解析完成（实际使用中可以通过查询文档状态来判断）
    time.sleep(30)
    
    # 5. 创建对话助手
    chat_result = api.create_chat_assistant("技术顾问", [dataset_id])
    chat_id = chat_result['data']['id']
    print(f"创建对话助手: {chat_id}")
    
    # 6. 进行对话
    answer = api.chat(chat_id, "什么是机器学习？")
    print(f"AI回答: {answer['data']['answer']}")
    
    # 7. 流式对话
    print("流式对话:")
    for chunk in api.chat(chat_id, "深度学习的应用有哪些？", stream=True):
        if chunk.get('data') and isinstance(chunk['data'], dict):
            answer_part = chunk['data'].get('answer', '')
            print(answer_part, end='', flush=True)
```

## 📱 移动端集成

### React Native 示例

```javascript
class KnowFlowMobile {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    
    async uploadDocumentMobile(datasetId, fileUri, fileName) {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            type: 'application/pdf',
            name: fileName
        });
        
        const response = await fetch(
            `${this.baseUrl}/api/v1/datasets/${datasetId}/documents`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            }
        );
        
        return await response.json();
    }
    
    async chatStream(chatId, question, onMessage) {
        const response = await fetch(
            `${this.baseUrl}/api/v1/chats/${chatId}/completions`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question,
                    stream: true
                })
            }
        );
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.substring(6));
                    onMessage(data);
                }
            }
        }
    }
}
```

---

更多详细信息请参考 [RAGFlow 官方文档](https://ragflow.io/docs/dev) 或在 [GitHub Issues](https://github.com/weizxfree/KnowFlow/issues) 中提问。
---
sidebar_position: 3
---

# 🔧 MinerU API 参考

KnowFlow 集成了 MinerU v2.1.11 文档解析引擎，提供强大的 OCR 和文档结构化能力。本接口基于 MinerU 官方 API 重新设计，完全兼容官方接口规范。

## 🌟 特性概览

- ✅ **完全兼容官方 API**: 基于 MinerU 官方 `aio_do_parse` 函数
- ✅ **多文件支持**: 支持批量上传和处理多个文件  
- ✅ **多后端支持**: pipeline, vlm-transformers, vlm-sglang-engine, vlm-sglang-client
- ✅ **灵活输出**: 支持 Markdown、中间 JSON、模型输出、内容列表、图片等
- ✅ **健康检查**: 自动检查 SGLang 服务器状态
- ✅ **错误处理**: 完善的错误处理和用户友好的错误信息

## 🚀 快速开始

### 基础调用

```bash
# 基础文档解析
curl -X POST "http://your-server:8888/file_parse" \
  -F "files=@document.pdf" \
  -F "backend=pipeline" \
  -F "return_md=true"
```

### 服务健康检查

```bash
# 检查服务状态
curl -X GET "http://your-server:8888/health"
```

## 📡 API 接口

### POST /file_parse

解析文件（PDF、图片）并返回结构化结果。

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `files` | File[] | ✅ | - | 要解析的文件列表 |
| `output_dir` | String | ❌ | `./output` | 输出目录 |
| `lang_list` | String[] | ❌ | `["ch"]` | 语言列表 |
| `backend` | String | ❌ | `pipeline` | 解析后端 |
| `parse_method` | String | ❌ | `auto` | 解析方法 |
| `formula_enable` | Boolean | ❌ | `true` | 启用公式解析 |
| `table_enable` | Boolean | ❌ | `true` | 启用表格解析 |
| `server_url` | String | 🔶 | - | SGLang 服务器地址 |
| `return_md` | Boolean | ❌ | `true` | 返回 Markdown 内容 |
| `return_middle_json` | Boolean | ❌ | `false` | 返回中间 JSON |
| `return_model_output` | Boolean | ❌ | `false` | 返回模型输出 |
| `return_content_list` | Boolean | ❌ | `false` | 返回内容列表 |
| `return_images` | Boolean | ❌ | `false` | 返回图片 |
| `start_page_id` | Integer | ❌ | `0` | 起始页码 |
| `end_page_id` | Integer | ❌ | `99999` | 结束页码 |

#### 支持的文件格式

| 格式类型 | 支持格式 |
|---------|---------|
| **PDF 文档** | `.pdf` |
| **图片文件** | `.png`, `.jpg`, `.jpeg`, `.bmp`, `.tiff` |
| **Office 文档** | `.doc`, `.docx`, `.ppt`, `.pptx`, `.xls`, `.xlsx` |

#### 解析后端说明

| 后端类型 | 说明 | 适用场景 | 依赖 |
|---------|------|---------|------|
| `pipeline` | 标准管道模式 | 通用文档解析，性能稳定 | 基础依赖 |
| `vlm-transformers` | VLM Transformers 模式 | 需要视觉理解的文档 | transformers |
| `vlm-sglang-engine` | VLM SGLang 引擎模式 | 高性能视觉模型推理 | SGLang 引擎 |
| `vlm-sglang-client` | VLM SGLang 客户端模式 | 分布式推理部署 | SGLang 服务器 |

:::tip 后端选择建议
- **一般用途**: 使用 `pipeline` 后端，性能稳定
- **图片丰富文档**: 使用 `vlm-sglang-client` 后端，视觉理解能力更强
- **大批量处理**: 使用 `vlm-sglang-engine` 后端，性能更高
:::

### GET /health

检查 MinerU API 服务健康状态。

#### 响应示例

```json
{
    "status": "healthy",
    "service": "MinerU API",
    "version": "2.1.11",
    "backend_status": {
        "pipeline": "available",
        "vlm-sglang-client": "connected",
        "sglang_server": "http://localhost:30000"
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📝 使用示例

### 1. 基础 PDF 解析

```bash
curl -X POST "http://localhost:8888/file_parse" \
  -F "files=@document.pdf" \
  -F "backend=pipeline" \
  -F "return_md=true" \
  -F "formula_enable=true" \
  -F "table_enable=true"
```

**响应示例:**
```json
{
    "results": [
        {
            "filename": "document.pdf",
            "md_content": "# 文档标题\n\n## 第一章\n\n这是文档内容...",
            "content_list": [...],
            "backend": "pipeline",
            "pages_processed": 10,
            "processing_time": 15.6
        }
    ],
    "total_files": 1,
    "successful_files": 1
}
```

### 2. VLM SGLang 客户端模式

```bash
curl -X POST "http://localhost:8888/file_parse" \
  -F "files=@complex_document.pdf" \
  -F "backend=vlm-sglang-client" \
  -F "server_url=http://localhost:30000" \
  -F "return_md=true" \
  -F "return_content_list=true" \
  -F "return_images=true"
```

**响应示例:**
```json
{
    "results": [
        {
            "filename": "complex_document.pdf",
            "md_content": "# 复杂文档\n\n![图片1](image_1.png)\n\n表格内容...",
            "content_list": [
                {
                    "type": "title",
                    "content": "复杂文档",
                    "level": 1
                },
                {
                    "type": "image",
                    "content": "![图片1](image_1.png)",
                    "bbox": [100, 200, 400, 300]
                }
            ],
            "images": {
                "image_1.png": "base64_encoded_image_data"
            },
            "backend": "vlm-sglang-client"
        }
    ],
    "total_files": 1,
    "successful_files": 1
}
```

### 3. 多文件批量处理

```bash
curl -X POST "http://localhost:8888/file_parse" \
  -F "files=@doc1.pdf" \
  -F "files=@doc2.pdf" \
  -F "files=@image.png" \
  -F "backend=pipeline" \
  -F "return_md=true" \
  -F "return_images=true"
```

**响应示例:**
```json
{
    "results": [
        {
            "filename": "doc1.pdf",
            "md_content": "# 文档1内容...",
            "backend": "pipeline"
        },
        {
            "filename": "doc2.pdf", 
            "md_content": "# 文档2内容...",
            "backend": "pipeline"
        },
        {
            "filename": "image.png",
            "md_content": "识别出的文字内容...",
            "backend": "pipeline"
        }
    ],
    "total_files": 3,
    "successful_files": 3,
    "failed_files": 0
}
```

### 4. 指定页面范围解析

```bash
curl -X POST "http://localhost:8888/file_parse" \
  -F "files=@large_document.pdf" \
  -F "backend=pipeline" \
  -F "start_page_id=5" \
  -F "end_page_id=15" \
  -F "return_md=true"
```

## 🔧 高级配置

### 环境变量

可以通过环境变量配置 MinerU API 的默认行为：

```bash
# SGLang 服务器默认地址
export SGLANG_SERVER_URL=http://localhost:30000

# MinerU VLM 服务器地址（备用）
export MINERU_VLM_SERVER_URL=http://localhost:30000

# 模型源配置
export MINERU_MODEL_SOURCE=modelscope  # 或 huggingface

# 设备模式
export MINERU_DEVICE_MODE=gpu  # 或 cpu

# 日志级别
export LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR
```

### Docker 部署配置

**完整版镜像（推荐）:**
```bash
docker run -d \
    --gpus all \
    -p 8888:8888 \
    -p 30000:30000 \
    -e MINERU_MODEL_SOURCE=local \
    -e SGLANG_MEM_FRACTION_STATIC=0.8 \
    --name mineru-api \
    zxwei/mineru-api-full:v2.1.11
```

**基础版镜像:**
```bash
docker run -d \
    --gpus all \
    -p 8888:8888 \
    -e MINERU_MODEL_SOURCE=local \
    -e INSTALL_TYPE=core \
    --name mineru-api \
    zxwei/mineru-api-full:v2.1.11
```

## 🐍 Python SDK

```python
import requests
import json
from typing import List, Dict, Any, Optional

class MinerUAPI:
    def __init__(self, base_url: str = "http://localhost:8888"):
        self.base_url = base_url.rstrip('/')
    
    def health_check(self) -> Dict[str, Any]:
        """检查服务健康状态"""
        response = requests.get(f"{self.base_url}/health")
        return response.json()
    
    def parse_files(
        self,
        file_paths: List[str],
        backend: str = "pipeline",
        lang_list: List[str] = None,
        return_md: bool = True,
        return_content_list: bool = False,
        return_images: bool = False,
        formula_enable: bool = True,
        table_enable: bool = True,
        server_url: Optional[str] = None,
        start_page: int = 0,
        end_page: int = 99999
    ) -> Dict[str, Any]:
        """
        解析文件
        
        Args:
            file_paths: 文件路径列表
            backend: 解析后端
            lang_list: 语言列表
            return_md: 返回 Markdown
            return_content_list: 返回内容列表
            return_images: 返回图片
            formula_enable: 启用公式解析
            table_enable: 启用表格解析
            server_url: SGLang 服务器地址
            start_page: 起始页码
            end_page: 结束页码
        """
        
        # 准备文件
        files = []
        for file_path in file_paths:
            files.append(('files', open(file_path, 'rb')))
        
        # 准备数据
        data = {
            'backend': backend,
            'lang_list': json.dumps(lang_list or ["ch"]),
            'return_md': str(return_md).lower(),
            'return_content_list': str(return_content_list).lower(),
            'return_images': str(return_images).lower(),
            'formula_enable': str(formula_enable).lower(),
            'table_enable': str(table_enable).lower(),
            'start_page_id': str(start_page),
            'end_page_id': str(end_page)
        }
        
        if server_url:
            data['server_url'] = server_url
        
        try:
            response = requests.post(
                f"{self.base_url}/file_parse",
                files=files,
                data=data,
                timeout=300  # 5分钟超时
            )
            
            return response.json()
            
        finally:
            # 关闭文件句柄
            for _, file_obj in files:
                file_obj.close()
    
    def parse_single_file(
        self,
        file_path: str,
        backend: str = "pipeline",
        **kwargs
    ) -> Dict[str, Any]:
        """解析单个文件"""
        result = self.parse_files([file_path], backend=backend, **kwargs)
        
        if result.get("results") and len(result["results"]) > 0:
            return result["results"][0]
        else:
            raise Exception(f"解析失败: {result}")

# 使用示例
def main():
    # 初始化 API 客户端
    api = MinerUAPI("http://localhost:8888")
    
    # 1. 健康检查
    health = api.health_check()
    print(f"服务状态: {health}")
    
    # 2. 解析单个 PDF 文件
    try:
        result = api.parse_single_file(
            "document.pdf",
            backend="pipeline",
            return_md=True,
            return_content_list=True,
            formula_enable=True,
            table_enable=True
        )
        
        print(f"文件名: {result['filename']}")
        print(f"Markdown 内容: {result['md_content'][:200]}...")
        
    except Exception as e:
        print(f"解析失败: {e}")
    
    # 3. 批量解析多个文件
    try:
        result = api.parse_files(
            ["doc1.pdf", "doc2.pdf", "image.png"],
            backend="pipeline",
            return_md=True,
            return_images=True
        )
        
        print(f"总文件数: {result['total_files']}")
        print(f"成功解析: {result['successful_files']}")
        
        for file_result in result['results']:
            print(f"- {file_result['filename']}: 解析成功")
            
    except Exception as e:
        print(f"批量解析失败: {e}")
    
    # 4. 使用 VLM 后端解析复杂文档
    try:
        result = api.parse_single_file(
            "complex_document.pdf",
            backend="vlm-sglang-client",
            server_url="http://localhost:30000",
            return_md=True,
            return_content_list=True,
            return_images=True
        )
        
        print(f"VLM 解析结果: {result['filename']}")
        if result.get('images'):
            print(f"提取图片数量: {len(result['images'])}")
            
    except Exception as e:
        print(f"VLM 解析失败: {e}")

if __name__ == "__main__":
    main()
```

## 📱 JavaScript SDK

```javascript
class MinerUAPI {
    constructor(baseUrl = 'http://localhost:8888') {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }
    
    async healthCheck() {
        const response = await fetch(`${this.baseUrl}/health`);
        return await response.json();
    }
    
    async parseFiles(files, options = {}) {
        const formData = new FormData();
        
        // 添加文件
        for (const file of files) {
            formData.append('files', file);
        }
        
        // 添加选项参数
        const defaults = {
            backend: 'pipeline',
            lang_list: ['ch'],
            return_md: true,
            return_content_list: false,
            return_images: false,
            formula_enable: true,
            table_enable: true,
            start_page_id: 0,
            end_page_id: 99999
        };
        
        const config = { ...defaults, ...options };
        
        Object.keys(config).forEach(key => {
            if (key === 'lang_list') {
                formData.append(key, JSON.stringify(config[key]));
            } else {
                formData.append(key, config[key].toString());
            }
        });
        
        const response = await fetch(`${this.baseUrl}/file_parse`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    async parseSingleFile(file, options = {}) {
        const result = await this.parseFiles([file], options);
        
        if (result.results && result.results.length > 0) {
            return result.results[0];
        } else {
            throw new Error(`解析失败: ${JSON.stringify(result)}`);
        }
    }
}

// 使用示例
async function demo() {
    const api = new MinerUAPI('http://localhost:8888');
    
    // 1. 健康检查
    try {
        const health = await api.healthCheck();
        console.log('服务状态:', health);
    } catch (error) {
        console.error('健康检查失败:', error);
    }
    
    // 2. 文件解析（需要在浏览器环境中使用文件输入）
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', async (event) => {
        const files = Array.from(event.target.files);
        
        try {
            const result = await api.parseFiles(files, {
                backend: 'pipeline',
                return_md: true,
                return_content_list: true,
                return_images: true
            });
            
            console.log('解析结果:', result);
            
            result.results.forEach(fileResult => {
                console.log(`文件: ${fileResult.filename}`);
                console.log(`内容: ${fileResult.md_content.substring(0, 200)}...`);
                
                if (fileResult.images) {
                    console.log(`图片数量: ${Object.keys(fileResult.images).length}`);
                }
            });
            
        } catch (error) {
            console.error('解析失败:', error);
        }
    });
}

// Node.js 环境示例
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

class MinerUAPINode {
    constructor(baseUrl = 'http://localhost:8888') {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }
    
    async parseFile(filePath, options = {}) {
        const formData = new FormData();
        
        // 添加文件
        formData.append('files', fs.createReadStream(filePath));
        
        // 添加选项
        const defaults = {
            backend: 'pipeline',
            return_md: 'true',
            formula_enable: 'true',
            table_enable: 'true'
        };
        
        const config = { ...defaults, ...options };
        Object.keys(config).forEach(key => {
            formData.append(key, config[key]);
        });
        
        const response = await fetch(`${this.baseUrl}/file_parse`, {
            method: 'POST',
            body: formData
        });
        
        return await response.json();
    }
}

// Node.js 使用示例
async function nodeDemo() {
    const api = new MinerUAPINode('http://localhost:8888');
    
    try {
        const result = await api.parseFile('document.pdf', {
            backend: 'pipeline',
            return_md: 'true',
            return_content_list: 'true'
        });
        
        console.log('解析结果:', result);
    } catch (error) {
        console.error('解析失败:', error);
    }
}
```

## ⚠️ 故障排除

### 常见问题

#### 1. SGLang 服务器连接问题

**现象**: 使用 `vlm-sglang-client` 后端时连接失败

**解决方案**:
```bash
# 1. 检查 SGLang 服务状态
curl http://localhost:30000/health

# 2. 确认服务器地址正确
curl -X POST "http://localhost:8888/file_parse" \
  -F "files=@test.pdf" \
  -F "backend=vlm-sglang-client" \
  -F "server_url=http://localhost:30000"

# 3. 检查防火墙设置
sudo ufw status
sudo ufw allow 30000
```

#### 2. 内存不足问题

**现象**: 解析大文件时出现 OOM 错误

**解决方案**:
```bash
# 1. 增加 Docker 内存限制
docker run --memory=8g --gpus all ...

# 2. 调整 SGLang 内存配置
-e SGLANG_MEM_FRACTION_STATIC=0.7

# 3. 分页处理大文档
curl -X POST "http://localhost:8888/file_parse" \
  -F "files=@large.pdf" \
  -F "start_page_id=0" \
  -F "end_page_id=10"
```

#### 3. 模型下载问题

**现象**: 首次启动时模型下载失败

**解决方案**:
```bash
# 1. 设置模型源
export MINERU_MODEL_SOURCE=modelscope  # 国内推荐

# 2. 手动下载模型
docker exec -it mineru-api bash
python -c "import mineru; mineru.download_models()"

# 3. 使用预置模型镜像
docker run zxwei/mineru-api-full:v2.1.11  # 包含所有模型
```

### 性能优化

#### 1. GPU 加速配置

```bash
# 确保 GPU 可用
nvidia-smi

# 启用 GPU 加速
docker run --gpus all \
  -e MINERU_DEVICE_MODE=gpu \
  zxwei/mineru-api-full:v2.1.11
```

#### 2. 批量处理优化

```python
# 推荐：批量提交多个文件
result = api.parse_files([
    "doc1.pdf", "doc2.pdf", "doc3.pdf"
])

# 避免：逐个处理文件
# for file in files:
#     result = api.parse_single_file(file)  # 效率较低
```

#### 3. 缓存机制

```bash
# 挂载缓存目录
docker run -v /path/to/cache:/app/cache \
  zxwei/mineru-api-full:v2.1.11
```

### 日志调试

```bash
# 查看服务日志
docker logs mineru-api

# 启用详细日志
docker run -e LOG_LEVEL=DEBUG \
  zxwei/mineru-api-full:v2.1.11

# 实时监控日志
docker logs -f mineru-api
```

---

更多技术细节请参考 [MinerU 官方文档](https://github.com/opendatalab/MinerU) 或在 [KnowFlow Issues](https://github.com/weizxfree/KnowFlow/issues) 中提问。
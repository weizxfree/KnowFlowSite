# MaxKB 接入

## 概述

通过 MaxKB 的**高级编排 + 工具**功能，实现在 MaxKB 中使用 KnowFlow 知识库的问答能力。

## 配置步骤

### 第一步：构建 API 工具

1. 在 MaxKB 中进入 **工具** → **创建工具**

![创建工具](./images/maxkb-create-tool.png)

2. 配置工具参数：
    - 工具名称：KnowFlowAPI
    - 描述：knowflow 的 API 工具
    - 启动参数：无
    - 输入参数：question 用户问题
    - 工具内容：见文档底部 Python 调用示例

![工具配置](./images/maxkb-tool-config.png)

![工具内容配置](./images/maxkb-tool-content.png)

3. 调试工具，确认返回正常后保存

### 第二步：创建高级编排

1. 在 MaxKB 应用中，选择 **创建高级编排**

![创建高级编排](./images/maxkb-add-tool.png)

2. 在编排流程中接入刚创建的 **KnowFlow API 工具**
3. 配置工具节点，将用户问题传递给 `question` 参数
4. 进行调试测试

![调试测试](./images/maxkb-debug.png)

5. 确认正常返回后，对接功能完成

![返回结果](./images/maxkb-result.png)

## Python 调用示例

```python
#!/usr/bin/env python3
import json
import requests
import sys

def query(question):
    url = "http://xx.xx.xx.xx:xxxx/api/v1/dify/retrieval"  # KnowFlow 检索接口
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ragflow-gxP2hDRpq4I-olmt61OJqjoqcySI6FyXzb_rk207zYE'  # KnowFlow API Key
    }

    payload = {
        'knowledge_id': 'f8666889f66411f0b70e361b50fe9a45',  # 知识库 ID
        'query': question,
        'retrieval_setting': {
            'top_k': 3,
            'score_threshold': 0.01
        }
    }

    print(f"\n查询: {question}")
    response = requests.post(url, json=payload, headers=headers)
    result = response.json()
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python retrieval.py <question>")
        sys.exit(1)

    question = " ".join(sys.argv[1:])
    result = query(question)
    print(result)
```

## 参数说明

| 参数              | 说明                    | 示例                                            |
| ----------------- | ----------------------- | ----------------------------------------------- |
| `url`             | KnowFlow 检索接口地址   | `http://xx.xx.xx.xx:xxxx/api/v1/dify/retrieval` |
| `Authorization`   | KnowFlow 账号的 API Key | `Bearer ragflow-xxx...`                         |
| `knowledge_id`    | KnowFlow 中的知识库 ID  | `f8666889f66411f0b70e361b50fe9a45`              |
| `query`           | 用户查询问题            | 用户输入的问题文本                              |
| `top_k`           | 返回的文档数量          | `3`                                             |
| `score_threshold` | 相似度阈值              | `0.01`                                          |

## 注意事项

- 确保 KnowFlow 服务地址可访问
- API Key 需要从 KnowFlow 登录账号中获取
- 知识库 ID 可在 KnowFlow 知识库管理页面查看
- `score_threshold` 可根据实际需求调整，值越低返回结果越多

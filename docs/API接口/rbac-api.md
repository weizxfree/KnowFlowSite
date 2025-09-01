---
sidebar_position: 4
---

# 🔐 RBAC 权限管理 API

KnowFlow 提供完整的 RBAC（基于角色的访问控制）API 接口，支持用户权限检查、角色管理、团队权限等核心功能。本文档基于 KnowFlow RBAC 系统 v1.0.0 版本。

## 🎯 API 概览

### 接口分类

| 分类 | 功能 | 接口数量 |
|------|------|---------|
| **权限检查** | 验证用户权限 | 3个 |
| **用户角色管理** | 用户角色分配和查询 | 4个 |
| **团队角色管理** | 团队权限管理 | 4个 |
| **权限查询** | 角色和权限信息查询 | 4个 |

### 认证方式

所有 API 请求都需要在 Header 中包含认证信息：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## 🔍 权限检查接口

### 1. 检查用户权限

**接口地址:** `POST /api/v1/rbac/permissions/check`

验证用户是否具有对特定资源的特定权限。

**请求参数:**
```json
{
    "user_id": "user_123",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456", 
    "permission_type": "read",
    "tenant_id": "tenant_789"
}
```

**参数说明:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `user_id` | String | ✅ | 用户ID |
| `resource_type` | String | ✅ | 资源类型（knowledgebase/document/team/system/user） |
| `resource_id` | String | ❌ | 资源ID，全局权限检查时可为空 |
| `permission_type` | String | ✅ | 权限类型（read/write/delete/admin/share/export） |
| `tenant_id` | String | ❌ | 租户ID，默认为用户所属租户 |

**响应数据:**
```json
{
    "has_permission": true,
    "user_id": "user_123",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "permission_type": "read",
    "granted_roles": ["editor"],
    "reason": "角色权限授权",
    "checked_at": "2024-01-15T10:30:00Z"
}
```

**使用示例:**
```bash
curl -X POST "http://your-server/api/v1/rbac/permissions/check" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "user_id": "user_123",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "permission_type": "write"
  }'
```

### 2. 检查全局权限

**接口地址:** `POST /api/v1/rbac/permissions/check-global`

检查用户的全局权限（不绑定特定资源）。

**请求参数:**
```json
{
    "user_id": "user_123",
    "permission_type": "admin",
    "tenant_id": "tenant_789"
}
```

**响应数据:**
```json
{
    "has_permission": true,
    "user_id": "user_123",
    "resource_type": "system",
    "resource_id": null,
    "permission_type": "admin",
    "granted_roles": ["admin"],
    "reason": "全局角色权限授权"
}
```

### 3. 简化权限检查

**接口地址:** `POST /api/v1/rbac/permissions/simple-check`

使用权限代码进行快速权限检查。

**请求参数:**
```json
{
    "user_id": "user_123",
    "permission_code": "kb_read",
    "resource_id": "kb_456",
    "tenant_id": "tenant_789"
}
```

**权限代码格式:** `{resource_type}_{permission_type}`

常用权限代码：
- `kb_read` - 知识库读取
- `kb_write` - 知识库写入  
- `kb_admin` - 知识库管理
- `doc_read` - 文档读取
- `team_admin` - 团队管理

**响应数据:**
```json
{
    "has_permission": true,
    "user_id": "user_123",
    "permission_code": "kb_read",
    "resource_id": "kb_456",
    "tenant_id": "tenant_789"
}
```

## 👤 用户角色管理接口

### 1. 获取用户角色

**接口地址:** `GET /api/v1/rbac/users/{user_id}/roles`

获取用户的所有角色信息。

**路径参数:**
- `user_id`: 用户ID

**查询参数:**
- `tenant_id`: 租户ID（可选，默认为default）
- `resource_type`: 资源类型过滤（可选）
- `resource_id`: 资源ID过滤（可选）

**请求示例:**
```bash
curl -X GET "http://your-server/api/v1/rbac/users/user_123/roles?tenant_id=tenant_789" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**响应数据:**
```json
{
    "user_id": "user_123",
    "roles": [
        {
            "id": "role_001",
            "name": "编辑者",
            "code": "editor",
            "description": "可以读取、编辑和分享资源",
            "role_type": "editor",
            "is_system": true,
            "tenant_id": "tenant_789",
            "resource_type": "knowledgebase",
            "resource_id": "kb_456",
            "granted_by": "admin_user",
            "granted_at": "2024-01-01T10:00:00Z",
            "expires_at": null,
            "is_active": true
        }
    ],
    "total": 1
}
```

### 2. 为用户分配角色

**接口地址:** `POST /api/v1/rbac/users/{user_id}/roles`

为用户分配新角色或更新现有角色。

**请求参数:**
```json
{
    "role_code": "editor",
    "tenant_id": "tenant_789",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "expires_at": "2024-12-31T23:59:59Z",
    "granted_by": "admin_user"
}
```

**参数说明:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `role_code` | String | ✅ | 角色代码 |
| `tenant_id` | String | ❌ | 租户ID |
| `resource_type` | String | ❌ | 资源类型，全局角色时可为空 |
| `resource_id` | String | ❌ | 资源ID，全局角色时可为空 |
| `expires_at` | String | ❌ | 过期时间，ISO 8601格式 |
| `granted_by` | String | ❌ | 授权人ID |

**响应数据:**
```json
{
    "message": "成功为用户 user_123 授予角色 editor",
    "user_id": "user_123",
    "role_code": "editor",
    "granted_by": "admin_user",
    "tenant_id": "tenant_789",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "expires_at": "2024-12-31T23:59:59Z",
    "granted_at": "2024-01-15T10:30:00Z"
}
```

**使用示例:**
```bash
# 分配全局角色
curl -X POST "http://your-server/api/v1/rbac/users/user_123/roles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "role_code": "admin",
    "tenant_id": "tenant_789"
  }'

# 分配资源角色
curl -X POST "http://your-server/api/v1/rbac/users/user_123/roles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "role_code": "editor",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "expires_at": "2024-12-31T23:59:59"
  }'
```

### 3. 撤销用户角色

**接口地址:** `DELETE /api/v1/rbac/users/{user_id}/roles/{role_code}`

撤销用户的特定角色。

**路径参数:**
- `user_id`: 用户ID
- `role_code`: 角色代码

**查询参数:**
- `tenant_id`: 租户ID（必填）
- `resource_type`: 资源类型（可选）
- `resource_id`: 资源ID（可选）

**请求示例:**
```bash
# 撤销全局角色
curl -X DELETE "http://your-server/api/v1/rbac/users/user_123/roles/admin?tenant_id=tenant_789" \
  -H "Authorization: Bearer YOUR_API_KEY"

# 撤销资源角色
curl -X DELETE "http://your-server/api/v1/rbac/users/user_123/roles/editor?tenant_id=tenant_789&resource_type=knowledgebase&resource_id=kb_456" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**响应数据:**
```json
{
    "message": "成功撤销用户 user_123 的角色 editor",
    "user_id": "user_123",
    "role_code": "editor",
    "tenant_id": "tenant_789",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "revoked_at": "2024-01-15T10:30:00Z"
}
```

### 4. 获取用户权限

**接口地址:** `GET /api/v1/rbac/users/{user_id}/permissions`

获取用户的所有权限列表（通过角色继承得到）。

**查询参数:**
- `tenant_id`: 租户ID
- `resource_type`: 资源类型过滤（可选）

**响应数据:**
```json
{
    "user_id": "user_123",
    "permissions": [
        {
            "id": "perm_001",
            "name": "查看知识库",
            "code": "kb_read",
            "description": "可以查看知识库内容",
            "resource_type": "knowledgebase",
            "permission_type": "read",
            "granted_by_role": "editor",
            "is_system": true
        }
    ],
    "total": 1,
    "resource_type_filter": "knowledgebase"
}
```

## 👥 团队角色管理接口

### 1. 为团队分配角色

**接口地址:** `POST /api/v1/rbac/teams/{team_id}/roles`

为团队分配角色，团队成员将自动继承团队角色。

**请求参数:**
```json
{
    "role_code": "editor",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "tenant_id": "tenant_789",
    "granted_by": "admin_user",
    "expires_at": "2024-12-31T23:59:59Z"
}
```

**响应数据:**
```json
{
    "message": "团队角色授权成功",
    "team_id": "team_123",
    "role_code": "editor",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "tenant_id": "tenant_789",
    "granted_by": "admin_user",
    "granted_at": "2024-01-15T10:30:00Z"
}
```

**使用示例:**
```bash
curl -X POST "http://your-server/api/v1/rbac/teams/team_123/roles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "role_code": "editor",
    "resource_type": "knowledgebase",
    "resource_id": "kb_456",
    "tenant_id": "tenant_789"
  }'
```

### 2. 撤销团队角色

**接口地址:** `DELETE /api/v1/rbac/teams/{team_id}/roles`

撤销团队的角色权限。

**查询参数:**
- `role_code`: 角色代码（可选，如果不指定则撤销所有角色）
- `resource_type`: 资源类型
- `resource_id`: 资源ID
- `tenant_id`: 租户ID

**响应数据:**
```json
{
    "message": "团队角色撤销成功",
    "team_id": "team_123",
    "affected_rows": 1,
    "revoked_at": "2024-01-15T10:30:00Z"
}
```

### 3. 获取团队角色

**接口地址:** `GET /api/v1/rbac/teams/{team_id}/roles`

获取团队的所有角色分配。

**查询参数:**
- `resource_type`: 资源类型（可选）
- `resource_id`: 资源ID（可选）
- `tenant_id`: 租户ID

**响应数据:**
```json
{
    "team_id": "team_123",
    "roles": [
        {
            "id": "team_role_001",
            "team_id": "team_123",
            "role_code": "editor",
            "resource_type": "knowledgebase",
            "resource_id": "kb_456",
            "tenant_id": "tenant_789",
            "granted_by": "admin_user",
            "granted_at": "2024-01-01T10:00:00Z",
            "expires_at": null,
            "is_active": true
        }
    ],
    "total": 1
}
```

### 4. 获取用户团队角色

**接口地址:** `GET /api/v1/rbac/users/{user_id}/team-roles`

获取用户通过团队继承的所有角色。

**查询参数:**
- `tenant_id`: 租户ID

**响应数据:**
```json
{
    "user_id": "user_123",
    "team_roles": [
        {
            "team_id": "team_456",
            "team_name": "开发团队",
            "role_code": "editor",
            "resource_type": "knowledgebase",
            "resource_id": "kb_789",
            "tenant_id": "tenant_789",
            "granted_by": "admin_user",
            "granted_at": "2024-01-01T10:00:00Z",
            "expires_at": null,
            "is_active": true
        }
    ],
    "total": 1
}
```

## 🔍 权限查询接口

### 1. 获取所有角色

**接口地址:** `GET /api/v1/rbac/roles`

获取系统中所有可用的角色。

**查询参数:**
- `tenant_id`: 租户ID（可选）
- `is_system`: 是否仅查询系统角色（可选）

**响应数据:**
```json
{
    "success": true,
    "data": [
        {
            "id": "role_001",
            "name": "超级管理员",
            "code": "super_admin",
            "description": "拥有系统所有权限",
            "role_type": "super_admin",
            "is_system": true,
            "tenant_id": null,
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z"
        },
        {
            "id": "role_002",
            "name": "管理员",
            "code": "admin", 
            "description": "拥有租户内所有权限",
            "role_type": "admin",
            "is_system": true,
            "tenant_id": null,
            "created_at": "2024-01-01T10:00:00Z",
            "updated_at": "2024-01-01T10:00:00Z"
        }
    ],
    "total": 2
}
```

### 2. 获取所有权限

**接口地址:** `GET /api/v1/rbac/permissions`

获取系统中所有权限定义。

**查询参数:**
- `resource_type`: 资源类型过滤（可选）
- `permission_type`: 权限类型过滤（可选）

**响应数据:**
```json
[
    {
        "id": "perm_001",
        "code": "kb_read",
        "name": "查看知识库",
        "description": "可以查看知识库内容",
        "resource_type": "knowledgebase",
        "permission_type": "read",
        "is_system": true,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
    },
    {
        "id": "perm_002",
        "code": "kb_write",
        "name": "编辑知识库",
        "description": "可以编辑知识库内容",
        "resource_type": "knowledgebase",
        "permission_type": "write",
        "is_system": true,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
    }
]
```

### 3. 获取角色权限映射

**接口地址:** `GET /api/v1/rbac/roles/{role_code}/permissions`

获取指定角色包含的所有权限。

**路径参数:**
- `role_code`: 角色代码

**响应数据:**
```json
[
    {
        "permission_id": "perm_001",
        "permission_code": "kb_read",
        "permission_name": "查看知识库",
        "description": "可以查看知识库内容",
        "resource_type": "knowledgebase",
        "permission_type": "read",
        "role_name": "编辑者",
        "granted_at": "2024-01-01T10:00:00Z"
    },
    {
        "permission_id": "perm_002", 
        "permission_code": "kb_write",
        "permission_name": "编辑知识库",
        "description": "可以编辑知识库内容",
        "resource_type": "knowledgebase",
        "permission_type": "write",
        "role_name": "编辑者",
        "granted_at": "2024-01-01T10:00:00Z"
    }
]
```

### 4. 健康检查

**接口地址:** `GET /api/v1/rbac/health`

检查 RBAC 服务健康状态。

**响应数据:**
```json
{
    "status": "healthy",
    "service": "RBAC权限管理系统",
    "version": "1.0.0",
    "database_status": "connected",
    "cache_status": "active",
    "total_users": 156,
    "total_roles": 6,
    "total_permissions": 24,
    "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🐍 Python SDK

```python
import requests
import json
from typing import Dict, List, Optional, Any

class KnowFlowRBACAPI:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip('/')
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def check_permission(
        self, 
        user_id: str, 
        resource_type: str, 
        permission_type: str,
        resource_id: Optional[str] = None,
        tenant_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """检查用户权限"""
        data = {
            "user_id": user_id,
            "resource_type": resource_type,
            "permission_type": permission_type
        }
        
        if resource_id:
            data["resource_id"] = resource_id
        if tenant_id:
            data["tenant_id"] = tenant_id
        
        response = requests.post(
            f"{self.base_url}/api/v1/rbac/permissions/check",
            json=data,
            headers=self.headers
        )
        
        return response.json()
    
    def assign_role(
        self,
        user_id: str,
        role_code: str,
        tenant_id: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        expires_at: Optional[str] = None
    ) -> Dict[str, Any]:
        """为用户分配角色"""
        data = {"role_code": role_code}
        
        if tenant_id:
            data["tenant_id"] = tenant_id
        if resource_type:
            data["resource_type"] = resource_type
        if resource_id:
            data["resource_id"] = resource_id
        if expires_at:
            data["expires_at"] = expires_at
        
        response = requests.post(
            f"{self.base_url}/api/v1/rbac/users/{user_id}/roles",
            json=data,
            headers=self.headers
        )
        
        return response.json()
    
    def revoke_role(
        self,
        user_id: str,
        role_code: str,
        tenant_id: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """撤销用户角色"""
        params = {"tenant_id": tenant_id}
        
        if resource_type:
            params["resource_type"] = resource_type
        if resource_id:
            params["resource_id"] = resource_id
        
        response = requests.delete(
            f"{self.base_url}/api/v1/rbac/users/{user_id}/roles/{role_code}",
            params=params,
            headers=self.headers
        )
        
        return response.json()
    
    def get_user_roles(
        self,
        user_id: str,
        tenant_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """获取用户角色"""
        params = {}
        if tenant_id:
            params["tenant_id"] = tenant_id
        
        response = requests.get(
            f"{self.base_url}/api/v1/rbac/users/{user_id}/roles",
            params=params,
            headers=self.headers
        )
        
        return response.json()
    
    def assign_team_role(
        self,
        team_id: str,
        role_code: str,
        tenant_id: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """为团队分配角色"""
        data = {
            "role_code": role_code,
            "tenant_id": tenant_id
        }
        
        if resource_type:
            data["resource_type"] = resource_type
        if resource_id:
            data["resource_id"] = resource_id
        
        response = requests.post(
            f"{self.base_url}/api/v1/rbac/teams/{team_id}/roles",
            json=data,
            headers=self.headers
        )
        
        return response.json()
    
    def get_all_roles(self) -> Dict[str, Any]:
        """获取所有角色"""
        response = requests.get(
            f"{self.base_url}/api/v1/rbac/roles",
            headers=self.headers
        )
        
        return response.json()
    
    def get_all_permissions(self) -> List[Dict[str, Any]]:
        """获取所有权限"""
        response = requests.get(
            f"{self.base_url}/api/v1/rbac/permissions",
            headers=self.headers
        )
        
        return response.json()
    
    def health_check(self) -> Dict[str, Any]:
        """健康检查"""
        response = requests.get(
            f"{self.base_url}/api/v1/rbac/health",
            headers=self.headers
        )
        
        return response.json()

# 使用示例
def main():
    # 初始化客户端
    rbac = KnowFlowRBACAPI("http://localhost", "your-api-key")
    
    # 1. 健康检查
    health = rbac.health_check()
    print(f"RBAC服务状态: {health['status']}")
    
    # 2. 检查用户权限
    permission_result = rbac.check_permission(
        user_id="user_123",
        resource_type="knowledgebase",
        resource_id="kb_456",
        permission_type="read"
    )
    print(f"用户权限: {permission_result['has_permission']}")
    
    # 3. 为用户分配角色
    assign_result = rbac.assign_role(
        user_id="user_123",
        role_code="editor",
        resource_type="knowledgebase",
        resource_id="kb_456"
    )
    print(f"角色分配: {assign_result['message']}")
    
    # 4. 获取用户角色
    user_roles = rbac.get_user_roles("user_123")
    print(f"用户角色数: {user_roles['total']}")
    
    # 5. 为团队分配角色
    team_result = rbac.assign_team_role(
        team_id="team_123",
        role_code="viewer",
        tenant_id="tenant_789",
        resource_type="knowledgebase",
        resource_id="kb_456"
    )
    print(f"团队角色分配: {team_result['message']}")
    
    # 6. 获取所有角色
    all_roles = rbac.get_all_roles()
    print(f"系统角色数: {all_roles['total']}")

if __name__ == "__main__":
    main()
```

## 📱 JavaScript SDK

```javascript
class KnowFlowRBACAPI {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }
    
    async checkPermission(userId, resourceType, permissionType, resourceId = null, tenantId = null) {
        const data = {
            user_id: userId,
            resource_type: resourceType,
            permission_type: permissionType
        };
        
        if (resourceId) data.resource_id = resourceId;
        if (tenantId) data.tenant_id = tenantId;
        
        const response = await fetch(`${this.baseUrl}/api/v1/rbac/permissions/check`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        
        return await response.json();
    }
    
    async assignRole(userId, roleCode, options = {}) {
        const data = { role_code: roleCode };
        
        if (options.tenantId) data.tenant_id = options.tenantId;
        if (options.resourceType) data.resource_type = options.resourceType;
        if (options.resourceId) data.resource_id = options.resourceId;
        if (options.expiresAt) data.expires_at = options.expiresAt;
        
        const response = await fetch(`${this.baseUrl}/api/v1/rbac/users/${userId}/roles`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        
        return await response.json();
    }
    
    async revokeRole(userId, roleCode, tenantId, resourceType = null, resourceId = null) {
        const params = new URLSearchParams({ tenant_id: tenantId });
        if (resourceType) params.append('resource_type', resourceType);
        if (resourceId) params.append('resource_id', resourceId);
        
        const response = await fetch(
            `${this.baseUrl}/api/v1/rbac/users/${userId}/roles/${roleCode}?${params}`,
            {
                method: 'DELETE',
                headers: this.headers
            }
        );
        
        return await response.json();
    }
    
    async getUserRoles(userId, tenantId = null) {
        const params = new URLSearchParams();
        if (tenantId) params.append('tenant_id', tenantId);
        
        const response = await fetch(
            `${this.baseUrl}/api/v1/rbac/users/${userId}/roles?${params}`,
            { headers: this.headers }
        );
        
        return await response.json();
    }
    
    async assignTeamRole(teamId, roleCode, tenantId, resourceType = null, resourceId = null) {
        const data = {
            role_code: roleCode,
            tenant_id: tenantId
        };
        
        if (resourceType) data.resource_type = resourceType;
        if (resourceId) data.resource_id = resourceId;
        
        const response = await fetch(`${this.baseUrl}/api/v1/rbac/teams/${teamId}/roles`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        
        return await response.json();
    }
    
    async getAllRoles() {
        const response = await fetch(`${this.baseUrl}/api/v1/rbac/roles`, {
            headers: this.headers
        });
        
        return await response.json();
    }
    
    async getAllPermissions() {
        const response = await fetch(`${this.baseUrl}/api/v1/rbac/permissions`, {
            headers: this.headers
        });
        
        return await response.json();
    }
    
    async healthCheck() {
        const response = await fetch(`${this.baseUrl}/api/v1/rbac/health`, {
            headers: this.headers
        });
        
        return await response.json();
    }
}

// 使用示例
async function demo() {
    const rbac = new KnowFlowRBACAPI('http://localhost', 'your-api-key');
    
    try {
        // 1. 健康检查
        const health = await rbac.healthCheck();
        console.log('RBAC服务状态:', health.status);
        
        // 2. 检查权限
        const hasPermission = await rbac.checkPermission(
            'user_123',
            'knowledgebase', 
            'read',
            'kb_456'
        );
        console.log('用户有读取权限:', hasPermission.has_permission);
        
        // 3. 分配角色
        const assignResult = await rbac.assignRole('user_123', 'editor', {
            resourceType: 'knowledgebase',
            resourceId: 'kb_456'
        });
        console.log('角色分配结果:', assignResult.message);
        
        // 4. 获取用户角色
        const userRoles = await rbac.getUserRoles('user_123');
        console.log('用户角色:', userRoles.roles.map(r => r.code));
        
        // 5. 获取所有角色
        const allRoles = await rbac.getAllRoles();
        console.log('系统角色:', allRoles.data.map(r => r.code));
        
    } catch (error) {
        console.error('API调用失败:', error);
    }
}

// 调用示例
demo();
```

## ⚠️ 错误处理

### 错误码说明

| 错误码 | 说明 | 处理建议 |
|--------|------|---------|
| 400 | 请求参数错误 | 检查参数格式和必填项 |
| 401 | 未授权访问 | 检查 API Key 是否正确 |
| 403 | 权限不足 | 联系管理员获取相应权限 |
| 404 | 资源不存在 | 检查用户ID、角色代码是否正确 |
| 409 | 资源冲突 | 角色已存在或状态冲突 |
| 500 | 服务器内部错误 | 联系系统管理员 |

### 错误响应格式

```json
{
    "code": 400,
    "message": "参数验证失败",
    "details": {
        "field": "user_id",
        "error": "用户ID不能为空"
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
```

### 常见错误处理

```python
def safe_check_permission(rbac_client, user_id, resource_type, permission_type):
    try:
        result = rbac_client.check_permission(user_id, resource_type, permission_type)
        return result['has_permission']
    except requests.exceptions.RequestException as e:
        print(f"网络错误: {e}")
        return False
    except KeyError as e:
        print(f"响应格式错误: {e}")
        return False
    except Exception as e:
        print(f"未知错误: {e}")
        return False
```

## 📋 接口调用限制

### 频率限制

| 接口类型 | 限制 | 时间窗口 |
|---------|------|---------|
| 权限检查 | 1000次/分钟 | 1分钟 |
| 角色管理 | 100次/分钟 | 1分钟 |
| 查询接口 | 200次/分钟 | 1分钟 |

### 批量操作

对于需要处理大量用户权限的场景，建议使用批量接口：

```python
# 推荐：批量权限检查（如果支持）
def batch_check_permissions(users, resource_type, permission_type):
    # 实现批量检查逻辑
    pass

# 避免：循环单个检查
# for user in users:
#     check_permission(user, resource_type, permission_type)
```

---

更多详细信息请参考 [RBAC 权限管理使用指南](../产品使用/rbac-permission) 或在 [GitHub Issues](https://github.com/weizxfree/KnowFlow/issues) 中提问。
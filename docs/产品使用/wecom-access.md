# 企业微信接入

## 一、功能简介

将 KnowFlow 配置好的聊天直接接入企业微信智能机器人，轻松实现在企业微信中接入并使用 KnowFlow。

## 二、配置步骤

### 1. 选择目标聊天

打开 KnowFlow 前端聊天功能，选择一个目标聊天卡片。

![选择聊天卡片](images/wecom-chat-1.png)

### 2. 进入三方接入

点击进入聊天详情页，点击详情页右上角的三方接入按钮。

![点击三方接入](images/wecom-chat-2.png)

### 3. 选择企业微信智能机器人

在弹出框中选择企业微信智能机器人。

![选择企业微信](images/wecom-chat-3.png)

### 4. 打开企业微信后台

点击企业微信后台的链接：https://work.weixin.qq.com/wework_admin/frame#/manageTools

![后台链接](images/wecom-chat-4.png)

### 5. 进入智能机器人管理

点击后会在新页面打开企业微信后台，在安全与管理模块，点击管理工具，然后点击右侧内容区域的智能机器人。

![智能机器人入口](images/wecom-chat-5.png)

### 6. API 模式创建机器人

点击创建机器人，然后拉到页面的最下面，点击【API模式创建】。

![创建机器人](images/wecom-chat-6.png)

![API模式创建](images/wecom-chat-7.png)

### 7. 配置回调地址和密钥

复制 KnowFlow 页面中的回调地址并粘贴到企业微信这里的 URL 输入框中。然后在企业微信页面点击随机获取 Token 和 EncodingAESKey。

![配置密钥](images/wecom-chat-8.png)

### 8. 保存 KnowFlow 配置

切到 KnowFlow 页面，将获取到的 Token 和 EncodingAESKey 复制粘贴到 KnowFlow 页面的 Token 和 EncodingAESKey 输入框中，然后先在 KnowFlow 这边点击保存。

![保存配置](images/wecom-chat-9.png)

### 9. 完成创建

切换到企业微信页面，点击创建，完成智能机器人的创建。

![完成创建](images/wecom-chat-8.png)

### 10. 验证使用

使用该智能机器人配置的可见范围人员账号登录自己的企业微信，在通讯录中，点击智能机器人，点击你创建的机器人即可实现单聊，也可以在群聊中，拉入这个机器人，@机器人进行问答。

![通讯录](images/wecom-chat-10.png)

![单聊](images/wecom-chat-11.png)

![群聊](images/wecom-chat-12.png)

![问答示例](images/wecom-chat-13.png)

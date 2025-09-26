interface FormData {
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  need: string;
  message: string;
}

export const sendToWeChatWork = async (formData: FormData): Promise<boolean> => {
  const webhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2eac2f11-6641-430c-bb2c-50340c4adcff';
  const message = formatFormDataToMessage(formData);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'text',
        text: {
          content: message
        }
      })
    });

    // 由于使用 no-cors 模式，无法读取响应内容
    // 但请求已经发送，我们假设成功
    console.log('消息已发送到企业微信');
    return true;
  } catch (error) {
    console.error('发送到企业微信失败:', error);
    return false;
  }
};

const formatFormDataToMessage = (data: FormData): string => {
  const timestamp = new Date().toLocaleString('zh-CN');

  return `🔔 新的咨询表单提交

📅 提交时间：${timestamp}

👤 联系人信息：
• 姓名：${data.name}
• 公司：${data.company}
• 职位：${data.position || '未填写'}
• 邮箱：${data.email}
• 电话：${data.phone || '未填写'}

📋 咨询信息：
• 需求类型：${data.need}
• 需求描述：${data.message || '未填写'}

请及时跟进处理！`;
};


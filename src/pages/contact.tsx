import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

export default function Contact(): JSX.Element {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    need: '演示',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟表单提交
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');

      // 重置表单
      setTimeout(() => {
        setFormData({
          name: '',
          company: '',
          position: '',
          email: '',
          phone: '',
          need: '演示',
          message: '',
        });
        setSubmitStatus('idle');
      }, 3000);
    }, 1000);
  };

  return (
    <Layout
      title="联系我们"
      description="联系 KnowFlow 团队，获取产品演示和定制方案">

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>联系我们</h1>
          <p className={styles.heroSubtitle}>
            无论您需要产品演示、技术咨询还是定制方案，我们都期待与您交流
          </p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>

            <div className={styles.formContainer}>
              <h2>获取专属方案</h2>
              <p className={styles.formDesc}>
                请填写以下信息，我们的专家团队将在 24 小时内与您联系
              </p>

              {submitStatus === 'success' ? (
                <div className={styles.successMessage}>
                  <span className={styles.successIcon}>✓</span>
                  <h3>提交成功！</h3>
                  <p>感谢您的咨询，我们会尽快与您联系。</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">姓名 *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="请输入您的姓名"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="company">公司名称 *</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        placeholder="请输入公司名称"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">邮箱 *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="example@company.com"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">联系电话</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="请输入联系电话"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="position">职位</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="请输入您的职位"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="need">需求类型 *</label>
                      <select
                        id="need"
                        name="need"
                        value={formData.need}
                        onChange={handleChange}
                        required
                      >
                        <option value="演示">产品演示</option>
                        <option value="报价">获取报价</option>
                        <option value="技术咨询">技术咨询</option>
                        <option value="合作">商务合作</option>
                        <option value="其他">其他需求</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">需求描述</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="请描述您的具体需求，比如企业规模、使用场景、预期目标等"
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '提交中...' : '提交咨询'}
                  </button>

                  <p className={styles.privacy}>
                    提交即表示您同意我们的 <a href="/privacy">隐私政策</a>
                  </p>
                </form>
              )}
            </div>

            <div className={styles.infoContainer}>
              <div className={styles.infoCard}>
                <h3>直接联系</h3>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📧</span>
                  <div>
                    <p className={styles.infoLabel}>商务合作</p>
                    <p className={styles.infoValue}>business@knowflowchat.cn</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>💬</span>
                  <div>
                    <p className={styles.infoLabel}>技术支持</p>
                    <p className={styles.infoValue}>support@knowflowchat.cn</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📱</span>
                  <div>
                    <p className={styles.infoLabel}>微信咨询</p>
                    <p className={styles.infoValue}>knowflowchat</p>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>常见问题</h3>
                <ul className={styles.faqList}>
                  <li>
                    <strong>支持哪些部署方式？</strong>
                    <p>支持私有化部署、Docker、Kubernetes 等多种方式</p>
                  </li>
                  <li>
                    <strong>是否提供试用？</strong>
                    <p>提供 14 天免费试用，可申请演示账号体验全部功能</p>
                  </li>
                  <li>
                    <strong>如何获取技术支持？</strong>
                    <p>企业版客户享受 7x24 小时技术支持服务</p>
                  </li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h3>响应时间</h3>
                <p className={styles.responseTime}>
                  我们承诺在工作日 24 小时内回复您的咨询，
                  紧急问题可通过电话或微信直接联系我们。
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2>准备好开始了吗？</h2>
          <p>查看文档了解更多产品细节，或直接联系我们获取定制方案</p>
          <div className={styles.ctaButtons}>
            <a href="/docs/intro" className={styles.secondaryButton}>
              查看文档
            </a>
            <a href="#form" className={styles.primaryButton}>
              立即咨询
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
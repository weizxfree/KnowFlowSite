import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

const features = [
  {
    icon: '🔒',
    title: '私有化部署',
    description: '数据安全合规，完全自主可控，支持内网部署',
  },
  {
    icon: '📊',
    title: '多源文档解析',
    description: '支持 MinerU/DOTS 引擎，精准识别文档结构',
  },
  {
    icon: '🛡️',
    title: '企业级权限',
    description: 'RBAC 权限体系，细粒度访问控制',
  },
  {
    icon: '⚡',
    title: '高性能优化',
    description: '毫秒级检索响应，流畅的使用体验',
  },
];

const scenarios = [
  {
    title: '企业知识库',
    description: '构建组织知识中心，实现知识资产统一管理',
    icon: '📚',
  },
  {
    title: '智能客服',
    description: '基于FAQ的智能问答，提升服务效率',
    icon: '💬',
  },
  {
    title: '文档检索',
    description: '快速定位所需信息，提高工作效率',
    icon: '🔍',
  },
];

const testimonials = [
  {
    content: 'KnowFlow 帮助我们建立了完善的知识管理体系，大大提升了团队协作效率。',
    author: '张总',
    company: '某科技公司 CTO',
  },
  {
    content: '私有化部署保证了数据安全，同时性能表现超出预期，非常满意。',
    author: '李经理',
    company: '某金融机构 IT负责人',
  },
  {
    content: '产品功能完善，技术支持响应及时，是值得信赖的合作伙伴。',
    author: '王总监',
    company: '某制造企业 信息化总监',
  },
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const productPreview = useBaseUrl('/img/product-preview.png');

  return (
    <Layout
      title="企业级知识库与 RAG 系统"
      description="基于 RAGFlow 深度定制的企业知识管理解决方案">

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              企业级知识库与
              <span className={styles.highlight}> RAG 系统</span>
            </h1>
            <p className={styles.heroSubtitle}>
              基于 RAGFlow 深度定制，为企业提供安全、高效、可控的知识管理解决方案
            </p>
            <div className={styles.heroCta}>
              <a href="/contact" className={styles.primaryButton}>
                申请演示
              </a>
              <a href="/docs/intro" className={styles.secondaryButton}>
                查看文档
              </a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>30+</span>
                <span className={styles.statLabel}>企业客户</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>1M+</span>
                <span className={styles.statLabel}>文档处理</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>99.9%</span>
                <span className={styles.statLabel}>服务可用性</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>核心优势</h2>
            <p className={styles.sectionSubtitle}>
              为企业打造的专业知识管理平台
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className={styles.product}>
        <div className={styles.productContainer}>
          <div className={styles.productContent}>
            <div className={styles.productText}>
              <h2>全方位的知识管理能力</h2>
              <p>
                从文档解析到智能问答，从权限管理到数据分析，
                KnowFlow 提供完整的知识管理解决方案。
              </p>
              <ul className={styles.productFeatures}>
                <li>支持 PDF、Word、Excel 等多种文档格式</li>
                <li>智能分块策略，保证语义完整性</li>
                <li>基于 RAG 技术的精准问答</li>
                <li>企业级权限和审计系统</li>
                <li>灵活的 API 接口，易于集成</li>
              </ul>
              <a href="/product" className={styles.learnMore}>
                了解更多产品功能 →
              </a>
            </div>
            <div className={styles.productImage}>
              <img
                src={productPreview}
                alt="KnowFlow 产品界面预览"
                className={styles.productPreview}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section className={styles.scenarios}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>应用场景</h2>
            <p className={styles.sectionSubtitle}>
              满足各行业的知识管理需求
            </p>
          </div>
          <div className={styles.scenarioGrid}>
            {scenarios.map((scenario, idx) => (
              <div key={idx} className={styles.scenarioCard}>
                <div className={styles.scenarioIcon}>{scenario.icon}</div>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>客户评价</h2>
            <p className={styles.sectionSubtitle}>
              听听他们怎么说
            </p>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <p className={styles.testimonialContent}>
                  "{testimonial.content}"
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>准备开始使用 KnowFlow？</h2>
            <p>立即体验企业级知识库 RAG 系统</p>
            <div className={styles.ctaButtons}>
              <a href="/contact" className={styles.ctaPrimary}>
                联系我们获取方案
              </a>
              <a href="/docs/intro" className={styles.ctaSecondary}>
                快速开始
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

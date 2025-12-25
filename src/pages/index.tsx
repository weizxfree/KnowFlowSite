import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

// 四大核心能力
const coreCapabilities = [
  {
    id: 'document-structure',
    number: '01',
    title: '文档结构理解 + 量身定制的分块能力',
    subtitle: '从"切文本"升级为"理解文档结构"',
    description: 'KnowFlow 不将文档视为纯文本，而是完整还原文档的结构、层级与语义关系，为高准确检索和问答打下基础。',
    features: [
      '深度文档结构解析（标题层级、段落、表格、图片、caption）',
      '多种分块策略可选：Smart / Regex / Title / Parent-Child',
      '父子分块能力：保留上下文语义连续性，避免碎片化召回',
      '分块结果可追溯到原文位置，支持精准引用',
    ],
    value: '准确不是"多召回"，而是"召回刚好正确的内容"',
    icon: '📄',
  },
  {
    id: 'multimodal',
    number: '02',
    title: '原生多模态知识库能力',
    subtitle: '不只是支持多模态，而是让多模态"可用、可控、可落地"',
    description: 'KnowFlow 将图片、表格、视频等非文本信息，纳入统一的知识理解与检索体系，而不是作为孤立附件存在。',
    features: [
      '图文混排文档结构还原',
      '图片语义理解，支持以文搜图',
      '图片上下文与标题联合理解，避免语义孤立',
      '支持多模态视频解析',
      '在算力受限或离线环境下仍可稳定运行',
    ],
    value: '企业知识，不再只存在于文字中',
    icon: '🖼️',
  },
  {
    id: 'engineering',
    number: '03',
    title: '工程化能力：可迁移、可评估、可长期维护',
    subtitle: '面向真实生产环境，而非 Demo 系统',
    description: 'KnowFlow 从工程实践出发，补齐大多数知识库系统缺失的运维与评估能力。',
    features: [
      '知识库离线导入 / 导出，支持跨环境迁移',
      '支持备份与恢复',
      '知识库评估体系，支持检索与问答效果评估',
      '帮助持续优化分块与检索策略',
      '完整 API 能力，支持自动化与系统集成',
    ],
    value: '知识库不是一次性构建，而是可以持续演进的资产',
    icon: '⚙️',
  },
  {
    id: 'enterprise',
    number: '04',
    title: '企业级能力：权限、安全与生态接入',
    subtitle: '为私有化与组织级使用而生',
    description: 'KnowFlow 天然面向企业与组织级部署，提供完善的权限体系与外部系统接入能力。',
    features: [
      'RBAC 权限管理体系',
      '用户 / 团队 / 知识库 / 配置多级权限控制',
      '支持三方系统接入（如企业内部系统、外部 Agent 平台）',
      '私有化与离线部署友好',
      '满足政企、内网、合规场景需求',
    ],
    value: '知识库不仅要"好用"，更要"可控、可管、可审计"',
    icon: '🏢',
  },
];

const scenarios = [
  {
    title: '政企内网知识库',
    description: '满足政府、央企对数据安全与合规的严格要求，支持完全离线部署',
    icon: '🏛️',
  },
  {
    title: '企业知识中台',
    description: '构建组织级知识资产，统一管理文档、FAQ、产品手册等多类型知识',
    icon: '📚',
  },
  {
    title: '智能客服/问答系统',
    description: '基于精准检索的智能问答，提供可追溯、可验证的答案',
    icon: '💬',
  },
  {
    title: 'Agent 知识底座',
    description: '为 AI Agent 提供可靠的知识检索能力，支持多系统集成',
    icon: '🤖',
  },
];

const testimonials = [
  {
    content: 'KnowFlow 的文档结构理解能力让我们的检索准确率提升了显著，特别是对复杂报告类文档的处理效果很好。',
    author: '张总',
    company: '某央企信息化部门负责人',
  },
  {
    content: '私有化部署 + 完善的权限体系，完美满足了我们的合规要求。知识库导入导出功能也很实用。',
    author: '李经理',
    company: '某金融机构 IT负责人',
  },
  {
    content: '多模态能力是我们选择 KnowFlow 的关键因素，图片和表格终于可以被正确理解和检索了。',
    author: '王总监',
    company: '某制造企业 信息化总监',
  },
];

export default function Home(): ReactNode {
  const productPreview = useBaseUrl('/img/product-preview.png');

  return (
    <Layout
      title="KnowFlow - 准确、可靠、可落地的私有化知识库"
      description="以文档结构理解为核心，构建高准确、可验证、可控的企业级知识库">

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>私有化场景首选</div>
            <h1 className={styles.heroTitle}>
              准确、可靠、可落地的企业级知识库
            </h1>
            <p className={styles.heroSubtitle}>
              KnowFlow 为私有化场景而生
            </p>
            <div className={styles.heroCta}>
              <a href="/contact" className={styles.primaryButton}>
                申请演示
              </a>
              <a href="/docs/intro" className={styles.secondaryButton}>
                查看文档
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className={styles.coreCapabilities}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>核心能力</h2>
            <p className={styles.sectionSubtitle}>
              KnowFlow 以「文档结构理解」为核心，提供完整的企业级知识库解决方案
            </p>
          </div>

          <div className={styles.capabilitiesList}>
            {coreCapabilities.map((capability, idx) => (
              <div key={capability.id} className={`${styles.capabilityCard} ${idx % 2 === 1 ? styles.capabilityCardReverse : ''}`}>
                <div className={styles.capabilityContent}>
                  <div className={styles.capabilityNumber}>{capability.number}</div>
                  <h3 className={styles.capabilityTitle}>{capability.title}</h3>
                  <p className={styles.capabilitySubtitle}>{capability.subtitle}</p>
                  <p className={styles.capabilityDescription}>{capability.description}</p>
                  <ul className={styles.capabilityFeatures}>
                    {capability.features.map((feature, fidx) => (
                      <li key={fidx}>{feature}</li>
                    ))}
                  </ul>
                  <div className={styles.capabilityValue}>
                    <span className={styles.valueIcon}>💡</span>
                    <span className={styles.valueText}>{capability.value}</span>
                  </div>
                </div>
                <div className={styles.capabilityVisual}>
                  <div className={styles.capabilityIcon}>{capability.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className={styles.product}>
        <div className="container">
          <div className={styles.productContent}>
            <div className={styles.productText}>
              <h2>为生产环境而生</h2>
              <p>
                KnowFlow 不是一个 Demo 系统，而是面向真实生产环境设计的企业级产品。
                从文档解析到问答输出，每一个环节都经过精心打磨。
              </p>
              <ul className={styles.productFeatures}>
                <li>支持 PDF、Word、Excel、PPT、图片等多种格式</li>
                <li>深度文档结构解析，保留语义完整性</li>
                <li>检索结果可追溯到原文，支持精准引用</li>
                <li>完整的知识库生命周期管理</li>
                <li>丰富的 API 接口，易于系统集成</li>
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
              满足私有化部署场景下的各类知识管理需求
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
              来自一线用户的真实反馈
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
            <h2>准备构建您的企业级知识库？</h2>
            <p>准确、可靠、可落地 —— 为私有化场景而生</p>
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

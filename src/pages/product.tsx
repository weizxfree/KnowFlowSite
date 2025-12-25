import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import styles from './product.module.css';

// 四大核心能力详情
const coreCapabilities = [
  {
    id: 'document-structure',
    number: '01',
    title: '文档结构理解 + 量身定制的分块能力',
    subtitle: '从"切文本"升级为"理解文档结构"',
    description: 'KnowFlow 不将文档视为纯文本，而是完整还原文档的结构、层级与语义关系，为高准确检索和问答打下基础。',
    features: [
      {
        title: '深度文档结构解析',
        desc: '识别标题层级、段落、表格、图片、caption 等结构元素',
      },
      {
        title: '多种分块策略',
        desc: 'Smart / Regex / Title / Parent-Child 等策略可选',
      },
      {
        title: '父子分块能力',
        desc: '保留上下文语义连续性，避免碎片化召回',
      },
      {
        title: '支持预览与调试',
        desc: '分块结果可追溯到原文位置，支持精准引用',
      },
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
      {
        title: '图文混排结构还原',
        desc: '完整保留文档中图文的位置关系与上下文',
      },
      {
        title: '图片语义理解',
        desc: '支持以文搜图，图片不再是检索盲区',
      },
      {
        title: '图片上下文联合理解',
        desc: '图片与周围标题、段落联合理解，避免语义孤立',
      },
      {
        title: '多模态视频解析',
        desc: '支持视频内容的结构化理解与检索',
      },
      {
        title: '离线环境适配',
        desc: '在算力受限或离线环境下仍可稳定运行',
      },
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
      {
        title: '知识库离线导入/导出',
        desc: '支持跨环境迁移，无需重新构建',
      },
      {
        title: '备份与恢复',
        desc: '完整的数据备份机制，保障业务连续性',
      },
      {
        title: '知识库评估体系',
        desc: '支持检索与问答效果评估，量化知识库质量',
      },
      {
        title: '持续优化支持',
        desc: '帮助持续优化分块与检索策略',
      },
      {
        title: '完整 API 能力',
        desc: '支持自动化与系统集成，适配长期运行的生产环境',
      },
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
      {
        title: 'RBAC 权限管理体系',
        desc: '基于角色的细粒度权限控制',
      },
      {
        title: '多级权限控制',
        desc: '用户 / 团队 / 知识库 / 配置多维度权限管理',
      },
      {
        title: '三方系统接入',
        desc: '支持企业内部系统、外部 Agent 平台对接',
      },
      {
        title: '私有化部署友好',
        desc: '支持完全离线部署，满足政企、内网、合规场景需求',
      },
    ],
    value: '知识库不仅要"好用"，更要"可控、可管、可审计"',
    icon: '🏢',
  },
];

// 产品对比（更新对比维度）
const comparisons = [
  {
    dimension: '文档理解',
    knowflow: '深度结构解析，理解文档层级与语义关系',
    others: '简单文本切分，丢失结构信息',
  },
  {
    dimension: '分块策略',
    knowflow: '多策略可选，支持父子分块，保留语义完整性',
    others: '固定分块方式，容易产生碎片化召回',
  },
  {
    dimension: '多模态支持',
    knowflow: '原生支持，图片、表格、视频纳入统一检索体系',
    others: '图片作为附件，无法参与检索与问答',
  },
  {
    dimension: '工程化能力',
    knowflow: '支持导入导出、备份恢复、效果评估',
    others: '缺乏运维能力，难以长期维护',
  },
  {
    dimension: '部署方式',
    knowflow: '私有化/离线部署，数据完全自主可控',
    others: '依赖云端，数据安全性受限',
  },
  {
    dimension: '权限管理',
    knowflow: 'RBAC 体系，多级细粒度控制',
    others: '权限能力薄弱，难以满足企业需求',
  },
];

// 技术规格
const techSpecs = [
  {
    category: '文档支持',
    items: ['PDF', 'Word', 'Excel', 'PPT', 'Markdown', '图片', '视频'],
  },
  {
    category: '解析引擎',
    items: ['MinerU 2.x', 'DOTS', '自定义引擎扩展'],
  },
  {
    category: '分块策略',
    items: ['Smart', 'Regex', 'Title', 'Parent-Child', '自定义规则'],
  },
  {
    category: '部署方式',
    items: ['Docker Compose', 'Kubernetes', '离线部署包'],
  },
  {
    category: '集成能力',
    items: ['RESTful API', 'SDK', '企业微信', 'Dify', 'Agent 平台'],
  },
];

// 应用场景
const scenarios = [
  {
    icon: '🏛️',
    title: '政企内网知识库',
    description: '满足政府、央企对数据安全与合规的严格要求，支持完全离线部署，数据不出内网',
    highlights: ['完全离线部署', '数据安全合规', '审计日志完备'],
  },
  {
    icon: '📚',
    title: '企业知识中台',
    description: '构建组织级知识资产，统一管理各类文档、FAQ、产品手册，沉淀企业知识',
    highlights: ['多类型知识统一管理', '知识资产沉淀', '持续迭代优化'],
  },
  {
    icon: '💬',
    title: '智能客服系统',
    description: '基于精准检索的智能问答，提供可追溯、可验证的答案，提升服务质量',
    highlights: ['答案可追溯', '精准检索', '多轮对话'],
  },
  {
    icon: '🤖',
    title: 'Agent 知识底座',
    description: '为 AI Agent 提供可靠的知识检索能力，支持多系统集成与自动化流程',
    highlights: ['API 接入', '多平台对接', '稳定可靠'],
  },
];

export default function Product(): ReactNode {
  return (
    <Layout
      title="产品介绍"
      description="KnowFlow - 以文档结构理解为核心，构建准确、可靠、可落地的私有化企业级知识库">

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>产品介绍</div>
          <h1 className={styles.heroTitle}>
            以「文档结构理解」为核心<br />
            构建准确、可靠、可落地的企业级知识库
          </h1>
          <p className={styles.heroSubtitle}>
            KnowFlow 从数据进入系统的第一步开始，通过深度文档结构解析、<br />
            量身定制的分块策略、原生多模态能力，构建高准确、可验证、可控的知识库系统
          </p>
          <div className={styles.heroHighlights}>
            <div className={styles.heroHighlight}>
              <span className={styles.highlightIcon}>🎯</span>
              <span>准确</span>
            </div>
            <div className={styles.heroHighlight}>
              <span className={styles.highlightIcon}>✅</span>
              <span>可靠</span>
            </div>
            <div className={styles.heroHighlight}>
              <span className={styles.highlightIcon}>🚀</span>
              <span>可落地</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className={styles.capabilities}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>核心能力</h2>
            <p className={styles.sectionSubtitle}>
              四大核心能力，构建完整的企业级知识库解决方案
            </p>
          </div>

          {coreCapabilities.map((capability, idx) => (
            <div key={capability.id} className={styles.capabilitySection}>
              <div className={styles.capabilityHeader}>
                <span className={styles.capabilityNumber}>{capability.number}</span>
                <div className={styles.capabilityTitleGroup}>
                  <h3 className={styles.capabilityTitle}>{capability.title}</h3>
                  <p className={styles.capabilitySubtitle}>{capability.subtitle}</p>
                </div>
                <span className={styles.capabilityIcon}>{capability.icon}</span>
              </div>
              <p className={styles.capabilityDescription}>{capability.description}</p>
              <div className={styles.capabilityFeatures}>
                {capability.features.map((feature, fidx) => (
                  <div key={fidx} className={styles.capabilityFeature}>
                    <div className={styles.featureCheck}>✓</div>
                    <div>
                      <strong>{feature.title}</strong>
                      <span>{feature.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.capabilityValue}>
                <span className={styles.valueIcon}>💡</span>
                <span className={styles.valueText}>{capability.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Specs Section */}
      <section className={styles.techSpecs}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>技术规格</h2>
            <p className={styles.sectionSubtitle}>
              全面的技术能力，满足各类企业场景需求
            </p>
          </div>
          <div className={styles.specsGrid}>
            {techSpecs.map((spec, idx) => (
              <div key={idx} className={styles.specCard}>
                <h4 className={styles.specCategory}>{spec.category}</h4>
                <div className={styles.specItems}>
                  {spec.items.map((item, iidx) => (
                    <span key={iidx} className={styles.specItem}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className={styles.comparison}>
        <div className={styles.comparisonContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>产品对比</h2>
            <p className={styles.sectionSubtitle}>
              KnowFlow vs 传统知识库方案
            </p>
          </div>
          <div className={styles.comparisonTable}>
            <table>
              <thead>
                <tr>
                  <th>对比维度</th>
                  <th className={styles.highlight}>KnowFlow</th>
                  <th>传统方案</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, idx) => (
                  <tr key={idx}>
                    <td className={styles.dimensionCol}>{item.dimension}</td>
                    <td className={styles.knowflowCol}>{item.knowflow}</td>
                    <td className={styles.othersCol}>{item.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <div className={styles.scenarioHighlights}>
                  {scenario.highlights.map((h, hidx) => (
                    <span key={hidx} className={styles.scenarioTag}>{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <h2>准备构建您的企业级知识库？</h2>
          <p>准确、可靠、可落地 —— 为私有化场景而生</p>
          <div className={styles.ctaButtons}>
            <a href="/contact" className={styles.primaryButton}>
              申请演示
            </a>
            <a href="/docs/intro" className={styles.secondaryButton}>
              查看文档
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

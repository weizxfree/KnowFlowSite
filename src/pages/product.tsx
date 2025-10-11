import React from 'react';
import Layout from '@theme/Layout';
import styles from './product.module.css';

const features = [
  {
    title: '文档解析引擎',
    description: '支持 MinerU/DOTS 等多种解析引擎，精准识别文档结构，支持 PDF、Word、Excel、PPT 等多种格式',
    icon: '📄',
  },
  {
    title: '智能分块策略',
    description: '自定义分块策略，支持按段落、按页、按字数等多种分割方式，确保语义完整性',
    icon: '🔍',
  },
  {
    title: '知识检索与问答',
    description: '基于 RAG 技术的智能问答系统，毫秒级检索响应，支持多轮对话和上下文理解',
    icon: '💡',
  },
  {
    title: '权限管理与安全',
    description: '企业级 RBAC 权限体系，细粒度权限控制，支持数据隔离和审计日志',
    icon: '🔐',
  },
  {
    title: '多种部署方案',
    description: '支持私有化部署、容器化部署、K8s 部署等多种方式，灵活适配企业基础设施',
    icon: '🚀',
  },
  {
    title: '开放 API 集成',
    description: '提供完整的 RESTful API，支持与企业现有系统无缝集成，快速实现业务场景落地',
    icon: '🔌',
  },
];

const comparisons = [
  {
    feature: '部署方式',
    ours: '私有化部署，数据完全自主可控',
    others: '依赖云端服务，数据安全性受限',
  },
  {
    feature: '定制能力',
    ours: '开源架构，可深度定制',
    others: '功能固定，定制成本高',
  },
  {
    feature: '性能表现',
    ours: '本地化部署，毫秒级响应',
    others: '网络延迟影响体验',
  },
  {
    feature: '成本控制',
    ours: '一次部署，长期使用',
    others: '按量付费，成本不可控',
  },
  {
    feature: '数据隐私',
    ours: '企业内网部署，数据不出门',
    others: '数据上传云端，存在泄露风险',
  },
];

export default function Product(): JSX.Element {
  return (
    <Layout
      title="产品介绍"
      description="KnowFlow - 企业级高精度私有化智能知识库平台">

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>企业级高精度私有化智能知识库平台</h1>
          <p className={styles.heroSubtitle}>
            让企业的知识真正可问、可信、可控
          </p>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>核心功能模块</h2>
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

      <section className={styles.architecture}>
        <div className="container">
          <h2 className={styles.sectionTitle}>系统架构</h2>
          <div className={styles.architectureContent}>
            <div className={styles.architectureText}>
              <h3>四层架构设计</h3>
              <ul className={styles.architectureList}>
                <li><strong>接入层：</strong>Web 界面、API 接口、SDK 集成</li>
                <li><strong>应用层：</strong>问答服务、检索服务、文档管理</li>
                <li><strong>引擎层：</strong>RAG 引擎、解析引擎、向量引擎</li>
                <li><strong>存储层：</strong>向量数据库、文档存储、缓存系统</li>
              </ul>
            </div>
            <div className={styles.architectureFeatures}>
              <h3>技术优势</h3>
              <ul className={styles.architectureList}>
                <li>高性能向量检索，支持亿级文档</li>
                <li>智能缓存机制，提升响应速度</li>
                <li>分布式架构，支持水平扩展</li>
                <li>容错机制完善，服务高可用</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.comparison}>
        <div className={styles.comparisonContainer}>
          <h2 className={styles.sectionTitle}>产品对比</h2>
          <div className={styles.comparisonTable}>
            <table>
              <colgroup>
                <col className={styles.featureCol} />
                <col className={styles.ourCol} />
                <col className={styles.otherCol} />
              </colgroup>
              <thead>
                <tr>
                  <th>对比维度</th>
                  <th className={styles.highlight}>KnowFlow</th>
                  <th>传统 SaaS 方案</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, idx) => (
                  <tr key={idx}>
                    <td className={styles.featureCol}>{item.feature}</td>
                    <td className={styles.ourCol}>{item.ours}</td>
                    <td className={styles.otherCol}>{item.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.scenarios}>
        <div className="container">
          <h2 className={styles.sectionTitle}>应用场景</h2>
          <div className={styles.scenarioGrid}>
            <div className={styles.scenarioCard}>
              <h3>🏢 企业知识库</h3>
              <p>构建企业内部知识中心，实现知识资产的统一管理和智能检索</p>
            </div>
            <div className={styles.scenarioCard}>
              <h3>🤝 客服助手</h3>
              <p>基于产品文档和 FAQ 的智能客服系统，提升服务效率和客户满意度</p>
            </div>
            <div className={styles.scenarioCard}>
              <h3>📚 研发文档</h3>
              <p>技术文档管理和检索，帮助研发团队快速找到所需技术资料</p>
            </div>
            <div className={styles.scenarioCard}>
              <h3>⚖️ 法务合规</h3>
              <p>法律法规和合同文档管理，支持快速检索和风险识别</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2>准备开始使用 KnowFlow？</h2>
          <p>联系我们获取专属部署方案和技术支持</p>
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

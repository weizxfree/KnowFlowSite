import React from 'react';
import Layout from '@theme/Layout';
import styles from './about.module.css';

const stats = [
  { number: '30+', label: '企业客户' },
  { number: '1M+', label: '文档处理量' },
  { number: '99.9%', label: '服务可用性' },
  { number: '24/7', label: '技术支持' },
];

const values = [
  {
    title: '技术创新',
    description: '持续探索 AI 和知识管理的前沿技术，为客户提供最先进的解决方案',
    icon: '🚀',
  },
  {
    title: '客户至上',
    description: '深度理解客户需求，提供定制化的产品和服务，确保客户成功',
    icon: '🤝',
  },
  {
    title: '安全可靠',
    description: '将数据安全和系统稳定性放在首位，为企业提供值得信赖的产品',
    icon: '🔒',
  },
  {
    title: '开放共赢',
    description: '拥抱开源生态，与合作伙伴共同成长，推动行业发展',
    icon: '🌟',
  },
];

const team = [
  {
    name: '技术团队',
    description: '来自知名互联网公司的技术专家，在 AI、NLP、分布式系统等领域有深厚积累',
  },
  {
    name: '产品团队',
    description: '深耕企业服务多年，对企业知识管理痛点有深刻理解',
  },
  {
    name: '服务团队',
    description: '专业的售前售后团队，为客户提供全生命周期的支持服务',
  },
];

export default function About(): JSX.Element {
  return (
    <Layout
      title="关于我们"
      description="了解 KnowFlow 团队和我们的使命">

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>关于 KnowFlow</h1>
          <p className={styles.heroSubtitle}>
            专注于企业知识库与 RAG 系统，让每个企业都能拥有智能化的知识管理能力
          </p>
        </div>
      </section>

      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <div key={idx} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.mission}>
        <div className="container">
          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <h2>我们的使命</h2>
              <p>
                KnowFlow 致力于为企业提供安全、高效、智能的知识管理解决方案。
                我们相信，通过 AI 技术赋能，可以让企业的知识资产真正发挥价值，
                提升组织效率，推动业务创新。
              </p>
              <p>
                基于开源的 RAGFlow 项目，我们进行了深度定制和优化，
                打造了适合中国企业的知识库系统。从文档解析到智能问答，
                从权限管理到私有化部署，我们为企业提供全方位的知识管理能力。
              </p>
            </div>
            <div className={styles.missionImage}>
              <div className={styles.imagePlaceholder}>
                <span>🎯</span>
                <p>让知识创造价值</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className="container">
          <h2 className={styles.sectionTitle}>核心价值观</h2>
          <div className={styles.valuesGrid}>
            {values.map((value, idx) => (
              <div key={idx} className={styles.valueCard}>
                <div className={styles.valueIcon}>{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.team}>
        <div className="container">
          <h2 className={styles.sectionTitle}>我们的团队</h2>
          <div className={styles.teamGrid}>
            {team.map((group, idx) => (
              <div key={idx} className={styles.teamCard}>
                <h3>{group.name}</h3>
                <p>{group.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.partners}>
        <div className="container">
          <h2 className={styles.sectionTitle}>合作伙伴</h2>
          <p className={styles.partnersDesc}>
            我们与业界领先的技术公司和服务商合作，共同为客户提供最优质的服务
          </p>
          <div className={styles.partnerLogos}>
            <div className={styles.partnerLogo}>
              <span>RAGFlow</span>
            </div>
            <div className={styles.partnerLogo}>
              <span>MinerU</span>
            </div>
            <div className={styles.partnerLogo}>
              <span>DOTS</span>
            </div>
            <div className={styles.partnerLogo}>
              <span>更多合作伙伴</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contact}>
        <div className="container">
          <h2 className={styles.sectionTitle}>联系我们</h2>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <h3>📧 商务合作</h3>
              <p>business@knowflowchat.cn</p>
            </div>
            <div className={styles.contactCard}>
              <h3>💬 技术支持</h3>
              <p>support@knowflowchat.cn</p>
            </div>
            <div className={styles.contactCard}>
              <h3>📱 微信咨询</h3>
              <p>knowflowchat</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2>与我们一起构建智能知识管理系统</h2>
          <p>无论您是想了解产品，还是寻求合作，我们都期待与您交流</p>
          <a href="/contact" className={styles.ctaButton}>
            立即联系我们
          </a>
        </div>
      </section>
    </Layout>
  );
}
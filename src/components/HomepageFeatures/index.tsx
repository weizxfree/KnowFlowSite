import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🔌 插件化架构',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        无缝兼容 RAGFlow 任意版本，所有增强均可热插拔，升级无忧。
        通过 Plugin & Patch 机制，增强 RAGFlow 而不破坏原生代码。
      </>
    ),
  },
  {
    title: '🏢 企业级特性',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        支持 MinerU2.x OCR 引擎、团队/用户/权限管理、企业微信集成、
        LDAP/SSO 等企业级功能，助力企业高效落地。
      </>
    ),
  },
  {
    title: '🧩 分块策略丰富',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        支持多种分块算法，检索更精准，适配多场景文档。
        图文混排输出，保持和官方 markdown 完全一致的分块规则。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

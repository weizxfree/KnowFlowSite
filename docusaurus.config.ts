import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'KnowFlow',
  tagline: '准确、可靠、可落地的私有化企业级知识库',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://www.knowflowchat.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For custom domain deployment, use root path
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'weizxfree', // Usually your GitHub org/user name.
  projectName: 'KnowFlowSite', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/weizxfree/KnowFlow/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/weizxfree/KnowFlow/tree/main/blog/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      {name: 'description', content: 'KnowFlow - 以文档结构理解为核心，构建准确、可靠、可落地的私有化企业级知识库。支持深度文档解析、多模态知识库、完整工程化能力与企业级权限管理。'},
      {name: 'keywords', content: 'KnowFlow, 企业知识库, 私有化知识库, RAG 系统, 文档结构理解, 多模态知识库, 知识库分块, RAGFlow, 企业 AI, 智能问答'},
      {name: 'baidu-site-verification', content: 'codeva-U93CBs1T3a'},
    ],
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'KnowFlow',
      logo: {
        alt: 'KnowFlow Logo',
        src: 'img/k-icon-3.svg',
      },
      items: [
        {
          to: '/',
          label: '首页',
          position: 'left',
        },
        {
          to: '/product',
          label: '产品',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        {
          to: '/about',
          label: '关于我们',
          position: 'left',
        },
        {
          to: '/contact',
          label: '联系我们',
          position: 'right',
          className: 'navbar__item--cta',
        },
        {
          href: 'https://github.com/weizxfree/KnowFlow',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '快速开始',
              to: '/docs/intro',
            },
            {
              label: '安装指南',
              to: '/docs/installation',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: '公众号：KnowFlow 企业知识库',
              href: '#',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '博客',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/weizxfree/KnowFlow',
            },
            {
              label: 'RAGFlow 官方',
              href: 'https://github.com/infiniflow/ragflow',
            },
          ],
        },
      ],
      copyright:
        'Copyright © 2025 KnowFlow Project. <img src="/img/icp-icon.png" alt="公安备案图标" width="18" height="20" style="vertical-align:middle;margin:0 4px;" /> <a href="https://beian.mps.gov.cn/#/query/webSearch?code=34019202002648" rel="noreferrer" target="_blank">皖公网安备34019202002648号</a> 皖ICP备2025099328号',
    },
    headTags: [
      {
        tagName: 'script',
        attributes: {type: 'text/javascript'},
        innerHTML:
          "(function(){var bp=document.createElement('script');var curProtocol=window.location.protocol.split(':')[0];if (curProtocol === 'https'){bp.src='https://zz.bdstatic.com/linksubmit/push.js'}else{bp.src='http://push.zhanzhang.baidu.com/push.js'}var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(bp,s);})();",
      },
    ],
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

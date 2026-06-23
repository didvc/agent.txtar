import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'agent.txtar',
  description: 'A portable, embeddable text block format for giving structured context to AI agents.',
  base: '/agent.txtar/',
  cleanUrls: true,
  lastUpdated: true,

  sitemap: {
    hostname: 'https://didvc.github.io/agent.txtar/'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/agent.txtar/favicon.svg' }],
  ],

  transformHead: async ({ pageData }) => {
    const head: any[] = []

    const title = pageData.frontmatter.title || pageData.title || 'agent.txtar'
    const description = pageData.frontmatter.description || 'A portable text block format for giving structured context to AI agents.'

    const baseUrl = 'https://didvc.github.io/agent.txtar'
    let cleanPath = pageData.relativePath.replace(/\.md$/, '').replace(/index$/, '')
    const pageUrl = `${baseUrl}/${cleanPath}`.replace(/\/$/, '')

    head.push(['link', { rel: 'canonical', href: pageUrl }])

    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:url', content: pageUrl }])
    head.push(['meta', { property: 'og:site_name', content: 'agent.txtar' }])
    head.push(['meta', { property: 'og:type', content: pageData.relativePath === 'index.md' ? 'website' : 'article' }])

    head.push(['meta', { name: 'twitter:card', content: 'summary' }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])

    const schema: any = {
      '@context': 'https://schema.org',
      '@type': pageData.relativePath === 'index.md' ? 'WebSite' : 'Article',
      name: title,
      description: description,
      url: pageUrl,
    }

    if (pageData.relativePath !== 'index.md') {
      schema.headline = title
      schema.author = { '@type': 'Person', name: 'didvc' }
    }

    head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(schema)
    ])

    return head
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/what-is-agent-txtar' },
      { text: 'Spec', link: '/architecture' },
      { text: 'Parsers', link: '/parsers' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'What is agent.txtar?', link: '/what-is-agent-txtar' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Examples', link: '/examples' },
          { text: 'Prompts', link: '/prompts' },
        ]
      },
      {
        text: 'Specification',
        items: [
          { text: 'Architecture', link: '/architecture' },
          { text: 'Philosophy', link: '/philosophy' },
          { text: 'Validator', link: '/validator' },
        ]
      },
      {
        text: 'Developers',
        items: [
          { text: 'Parsers', link: '/parsers' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/didvc/agent.txtar' },
    ],

    editLink: {
      pattern: 'https://github.com/didvc/agent.txtar/edit/main/docs/:path'
    },

    footer: {
      message: 'CC BY 4.0 -- Contributions welcome.',
      copyright: 'Docs: Creative Commons Attribution 4.0 | Code: MIT'
    },

    search: {
      provider: 'local'
    }
  },
})

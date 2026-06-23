---
layout: home
title: agent.txtar
titleTemplate: Portable context blocks for AI agents

hero:
  name: agent.txtar
  text: Structured context for AI agents, readable by humans
  tagline: A plain-text format built on Go's txtar. Embed it anywhere -- blogs, bios, READMEs, standalone files. Agents parse the data; humans read the top part and move on.
  actions:
    - theme: brand
      text: What is agent.txtar?
      link: /what-is-agent-txtar
    - theme: alt
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/didvc/agent.txtar

features:
  - title: Embed anywhere
    details: Paste it into a blog sidebar, GitHub bio, social media profile, or serve it as a file. No server, no build step. It's just text.
  - title: Human + machine readable
    details: The top part is plain-text context for humans. Below that, virtual files carry structured data for agents. Both audiences get what they need from the same block.
  - title: LLM-native
    details: LLMs already understand txtar from training data. They can parse it, generate it, and work with it out of the box. No special tooling required.
  - title: Extensible
    details: Bundle whatever files you want -- bio, rules, keys, custom data. The manifest at the bottom tells agents what each file is for. Add your own route keys freely.
---

export interface TxtarFile {
  name: string
  data: string
}

export interface AgentTxtarManifest {
  $schema: string
  agent_txtar: string
  name: string
  type?: 'person' | 'org' | 'bot' | 'project'
  routes?: Record<string, string>
}

export interface AgentTxtarBlock {
  preamble: string
  files: TxtarFile[]
  manifest: AgentTxtarManifest
}

const FILE_MARKER = /^-- (.+) --$/

function parseTxtar(text: string): { comment: string; files: TxtarFile[] } {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  let comment = ''
  const files: TxtarFile[] = []
  let current: TxtarFile | null = null

  for (const line of lines) {
    const m = line.match(FILE_MARKER)
    if (m) {
      if (current) files.push(current)
      current = { name: m[1], data: '' }
    } else if (current) {
      current.data += line + '\n'
    } else {
      comment += line + '\n'
    }
  }
  if (current) files.push(current)

  return { comment, files }
}

function extractBalancedJson(data: string): string | null {
  let depth = 0
  let start = -1

  for (let i = 0; i < data.length; i++) {
    const ch = data[i]
    if (ch === '"') {
      i++
      while (i < data.length && data[i] !== '"') {
        if (data[i] === '\\') i++
        i++
      }
      continue
    }
    if (ch === '{') {
      if (start === -1) start = i
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) return data.slice(start, i + 1)
    }
  }

  return null
}

export function parse(text: string): AgentTxtarBlock | null {
  if (new TextEncoder().encode(text).length > 100_000) return null

  const archive = parseTxtar(text)
  if (archive.files.length === 0) return null

  let manifestIdx = -1
  for (let i = archive.files.length - 1; i >= 0; i--) {
    if (archive.files[i].name === 'agent.txtar.json') {
      manifestIdx = i
      break
    }
  }
  if (manifestIdx === -1) return null

  const jsonStr = extractBalancedJson(archive.files[manifestIdx].data)
  if (!jsonStr) return null

  let manifest: AgentTxtarManifest
  try {
    manifest = JSON.parse(jsonStr)
  } catch {
    return null
  }

  if (!manifest.agent_txtar || !manifest.name) return null

  return {
    preamble: archive.comment,
    files: archive.files.slice(0, manifestIdx),
    manifest,
  }
}

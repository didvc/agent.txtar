# Validator

Paste your `agent.txtar` block below to check if it's valid.

<script setup>
import { ref, computed } from 'vue'

const input = ref('')
const result = computed(() => {
  if (!input.value.trim()) return null
  return validate(input.value)
})

function validate(text) {
  const checks = []
  const lines = text.replace(/\r\n/g, '\n').split('\n')

  // Parse txtar
  const files = []
  let preamble = ''
  let currentFile = null
  const filePattern = /^-- (.+) --$/

  for (const line of lines) {
    const match = line.match(filePattern)
    if (match) {
      if (currentFile) files.push(currentFile)
      currentFile = { name: match[1], data: '' }
    } else if (currentFile) {
      currentFile.data += line + '\n'
    } else {
      preamble += line + '\n'
    }
  }
  if (currentFile) files.push(currentFile)

  // Check: has files
  if (files.length === 0) {
    checks.push({ ok: false, msg: 'No file sections found. Need at least -- agent.txtar.json --' })
    return { checks, manifest: null, files: [] }
  }
  checks.push({ ok: true, msg: `Found ${files.length} file section(s)` })

  // Check: last file is agent.txtar.json
  const last = files[files.length - 1]
  if (last.name !== 'agent.txtar.json') {
    checks.push({ ok: false, msg: `Last file is "${last.name}" -- must be "agent.txtar.json"` })
    return { checks, manifest: null, files }
  }
  checks.push({ ok: true, msg: 'Manifest (agent.txtar.json) is last file' })

  // Bracket-balanced JSON extraction
  let json = null
  try {
    const data = last.data
    let depth = 0, start = -1, end = -1
    for (let i = 0; i < data.length; i++) {
      if (data[i] === '{') { if (start === -1) start = i; depth++ }
      else if (data[i] === '}') { depth--; if (depth === 0) { end = i + 1; break } }
    }
    if (start === -1 || end === -1) throw new Error('No balanced JSON object found')
    json = JSON.parse(data.slice(start, end))
    checks.push({ ok: true, msg: 'Manifest JSON is valid' })
  } catch (e) {
    checks.push({ ok: false, msg: `Invalid JSON in manifest: ${e.message}` })
    return { checks, manifest: null, files }
  }

  // Check required fields
  if (!json.agent_txtar) {
    checks.push({ ok: false, msg: 'Missing required field: agent_txtar' })
  } else {
    checks.push({ ok: true, msg: `Spec version: ${json.agent_txtar}` })
  }

  if (!json.name) {
    checks.push({ ok: false, msg: 'Missing required field: name' })
  } else {
    checks.push({ ok: true, msg: `Name: ${json.name}` })
  }

  // Check routes point to real files
  if (json.routes) {
    const fileNames = new Set(files.slice(0, -1).map(f => f.name))
    for (const [key, filename] of Object.entries(json.routes)) {
      if (fileNames.has(filename)) {
        checks.push({ ok: true, msg: `Route "${key}" -> "${filename}" (found)` })
      } else {
        checks.push({ ok: false, msg: `Route "${key}" -> "${filename}" (file not found in archive)` })
      }
    }
  }

  // Size check
  const size = new TextEncoder().encode(text).length
  if (size > 100000) {
    checks.push({ ok: false, msg: `Size: ${(size / 1000).toFixed(1)} KB (exceeds 100 KB limit)` })
  } else {
    checks.push({ ok: true, msg: `Size: ${(size / 1000).toFixed(1)} KB` })
  }

  return { checks, manifest: json, files }
}
</script>

<div style="margin-top: 1.5em;">
  <textarea
    v-model="input"
    placeholder="Paste your agent.txtar block here..."
    style="width: 100%; min-height: 300px; font-family: monospace; font-size: 13px; padding: 12px; border: 1px solid var(--vp-c-border); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); resize: vertical;"
  ></textarea>
</div>

<div v-if="result" style="margin-top: 1em;">
  <div v-for="check in result.checks" :key="check.msg" style="padding: 4px 0; font-family: monospace; font-size: 13px;">
    <span :style="{ color: check.ok ? 'var(--vp-c-green-1)' : 'var(--vp-c-red-1)' }">{{ check.ok ? '[ OK ]' : '[FAIL]' }}</span>
    {{ check.msg }}
  </div>
</div>

## What it checks

- txtar structure (file sections present)
- Manifest is the last file section and named `agent.txtar.json`
- Manifest JSON is parseable (with bracket-balancing for trailing text)
- Required fields: `agent_txtar`, `name`
- Routes point to files that actually exist in the archive
- Total size is under 100 KB

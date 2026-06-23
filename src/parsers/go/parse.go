package agenttxtar

import (
	"encoding/json"
	"strings"

	"golang.org/x/tools/txtar"
)

type Manifest struct {
	Schema    string            `json:"$schema"`
	AgentTxtar string           `json:"agent_txtar"`
	Name      string            `json:"name"`
	Type      string            `json:"type,omitempty"`
	Routes    map[string]string `json:"routes,omitempty"`
}

type Block struct {
	Preamble string
	Files    []txtar.File
	Manifest Manifest
}

func Parse(text string) (*Block, error) {
	if len(text) > 100_000 {
		return nil, nil
	}

	text = strings.ReplaceAll(text, "\r\n", "\n")
	ar := txtar.Parse([]byte(text))

	idx := -1
	for i := len(ar.Files) - 1; i >= 0; i-- {
		if ar.Files[i].Name == "agent.txtar.json" {
			idx = i
			break
		}
	}
	if idx == -1 {
		return nil, nil
	}

	jsonStr := extractBalancedJSON(string(ar.Files[idx].Data))
	if jsonStr == "" {
		return nil, nil
	}

	var m Manifest
	if err := json.Unmarshal([]byte(jsonStr), &m); err != nil {
		return nil, err
	}

	if m.AgentTxtar == "" || m.Name == "" {
		return nil, nil
	}

	return &Block{
		Preamble: string(ar.Comment),
		Files:    ar.Files[:idx],
		Manifest: m,
	}, nil
}

func extractBalancedJSON(data string) string {
	depth := 0
	start := -1
	inStr := false

	for i := 0; i < len(data); i++ {
		ch := data[i]
		if inStr {
			if ch == '\\' {
				i++
			} else if ch == '"' {
				inStr = false
			}
			continue
		}
		switch ch {
		case '"':
			inStr = true
		case '{':
			if start == -1 {
				start = i
			}
			depth++
		case '}':
			depth--
			if depth == 0 {
				return data[start : i+1]
			}
		}
	}
	return ""
}

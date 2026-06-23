"""agent.txtar parser -- zero-dependency reference implementation."""

import json
import re
from dataclasses import dataclass, field

FILE_MARKER = re.compile(r"^-- (.+) --$", re.MULTILINE)
MAX_SIZE = 100_000


@dataclass
class TxtarFile:
    name: str
    data: str


@dataclass
class AgentTxtarBlock:
    preamble: str
    files: list[TxtarFile]
    manifest: dict = field(default_factory=dict)


def _parse_txtar(text: str) -> tuple[str, list[TxtarFile]]:
    files: list[TxtarFile] = []
    parts = FILE_MARKER.split(text)

    comment = parts[0]
    i = 1
    while i < len(parts) - 1:
        files.append(TxtarFile(name=parts[i], data=parts[i + 1]))
        i += 2

    return comment, files


def _extract_balanced_json(data: str) -> str | None:
    depth = 0
    start = -1
    in_str = False

    i = 0
    while i < len(data):
        ch = data[i]
        if in_str:
            if ch == "\\":
                i += 1
            elif ch == '"':
                in_str = False
            i += 1
            continue

        if ch == '"':
            in_str = True
        elif ch == "{":
            if start == -1:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return data[start : i + 1]
        i += 1

    return None


def parse(text: str) -> AgentTxtarBlock | None:
    if len(text.encode("utf-8")) > MAX_SIZE:
        return None

    text = text.replace("\r\n", "\n")
    comment, files = _parse_txtar(text)

    if not files:
        return None

    manifest_idx = None
    for i in range(len(files) - 1, -1, -1):
        if files[i].name == "agent.txtar.json":
            manifest_idx = i
            break

    if manifest_idx is None:
        return None

    json_str = _extract_balanced_json(files[manifest_idx].data)
    if json_str is None:
        return None

    try:
        manifest = json.loads(json_str)
    except json.JSONDecodeError:
        return None

    if "agent_txtar" not in manifest or "name" not in manifest:
        return None

    return AgentTxtarBlock(
        preamble=comment,
        files=files[:manifest_idx],
        manifest=manifest,
    )

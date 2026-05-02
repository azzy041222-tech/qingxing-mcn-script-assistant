import argparse
import json
import os
from pathlib import Path
from typing import Any

import requests


ROOT = Path(__file__).resolve().parents[1]
FEISHU_API = "https://open.feishu.cn/open-apis"


class FeishuError(RuntimeError):
    pass


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def read_markdown() -> str:
    sections = [
        "# 轻醒小红书短视频商单脚本",
        "## 最终脚本",
        (ROOT / "output" / "final_script.md").read_text(encoding="utf-8"),
        "---",
        "## 分镜设计",
        (ROOT / "output" / "storyboard.md").read_text(encoding="utf-8"),
        "---",
        "## 合规质检",
        (ROOT / "output" / "risk_check.md").read_text(encoding="utf-8"),
    ]
    return "\n\n".join(sections)


def feishu_request(method: str, path: str, token: str | None = None, **kwargs: Any) -> dict[str, Any]:
    headers = kwargs.pop("headers", {})
    headers.setdefault("Content-Type", "application/json; charset=utf-8")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    response = requests.request(
        method,
        f"{FEISHU_API}{path}",
        headers=headers,
        timeout=30,
        **kwargs,
    )
    response.raise_for_status()
    data = response.json()
    if data.get("code") not in (0, None):
        raise FeishuError(json.dumps(data, ensure_ascii=False, indent=2))
    return data


def get_tenant_access_token(app_id: str, app_secret: str) -> str:
    data = feishu_request(
        "POST",
        "/auth/v3/tenant_access_token/internal",
        json={"app_id": app_id, "app_secret": app_secret},
    )
    token = data.get("tenant_access_token")
    if not token:
        raise FeishuError(f"tenant_access_token missing: {data}")
    return token


def create_document(token: str, folder_token: str, title: str) -> str:
    data = feishu_request(
        "POST",
        "/docx/v1/documents",
        token,
        json={"folder_token": folder_token, "title": title},
    )
    document = data.get("data", {}).get("document", {})
    document_id = document.get("document_id") or document.get("revision_id")
    if not document_id:
        raise FeishuError(f"document_id missing after create document: {data}")
    return document_id


def markdown_to_blocks(token: str, markdown: str) -> list[dict[str, Any]]:
    data = feishu_request(
        "POST",
        "/docx/v1/documents/blocks/convert",
        token,
        json={"content_type": "markdown", "content": markdown},
    )
    blocks = data.get("data", {}).get("blocks", [])
    if not blocks:
        raise FeishuError(f"no blocks returned by markdown convert API: {data}")
    return blocks


def append_blocks(
    token: str,
    document_id: str,
    parent_block_id: str,
    blocks: list[dict[str, Any]],
    index: int,
) -> None:
    batch_size = 50
    current_index = index
    for start in range(0, len(blocks), batch_size):
        batch = blocks[start : start + batch_size]
        feishu_request(
            "POST",
            f"/docx/v1/documents/{document_id}/blocks/{parent_block_id}/children",
            token,
            json={"children": batch, "index": current_index},
        )
        current_index += len(batch)


def validate_config() -> dict[str, str]:
    load_env_file(ROOT / "feishu" / ".env")
    config = {
        "app_id": os.getenv("FEISHU_APP_ID", ""),
        "app_secret": os.getenv("FEISHU_APP_SECRET", ""),
        "document_id": os.getenv("FEISHU_DOCUMENT_ID", ""),
        "parent_block_id": os.getenv("FEISHU_PARENT_BLOCK_ID", ""),
        "folder_token": os.getenv("FEISHU_FOLDER_TOKEN", ""),
        "title": os.getenv("FEISHU_DOCUMENT_TITLE", "轻醒小红书短视频商单脚本"),
        "insert_index": os.getenv("FEISHU_INSERT_INDEX", "0"),
    }

    missing = [key for key in ("app_id", "app_secret") if not config[key]]
    if missing:
        raise SystemExit(f"Missing required env: {', '.join(missing)}")
    if not config["document_id"] and not config["folder_token"]:
        raise SystemExit("Set FEISHU_DOCUMENT_ID to update an existing doc, or FEISHU_FOLDER_TOKEN to create one.")
    return config


def main() -> None:
    parser = argparse.ArgumentParser(description="Write the final MCN script package to a Feishu docx document.")
    parser.add_argument("--dry-run", action="store_true", help="Validate local content and config without calling Feishu write APIs.")
    args = parser.parse_args()

    config = validate_config()
    markdown = read_markdown()

    print(f"Local content length: {len(markdown)} chars")
    print(f"Target mode: {'update existing document' if config['document_id'] else 'create new document'}")

    if args.dry_run:
        print("Dry run passed. Remove --dry-run to write to Feishu.")
        return

    token = get_tenant_access_token(config["app_id"], config["app_secret"])
    document_id = config["document_id"] or create_document(token, config["folder_token"], config["title"])
    parent_block_id = config["parent_block_id"] or document_id
    blocks = markdown_to_blocks(token, markdown)
    append_blocks(token, document_id, parent_block_id, blocks, int(config["insert_index"]))

    print("Feishu write completed.")
    print(f"Document ID: {document_id}")


if __name__ == "__main__":
    main()

# 轻醒 x 凌二七短视频脚本：飞书自动化接入说明

## 1. 交付结果

本仓库已沉淀一套可复现的飞书自动化写入方案，用于把以下内容写入飞书 Docx 文档：

- `output/final_script.md`
- `output/storyboard.md`
- `output/risk_check.md`

最终飞书文档：

<https://feishu.cn/docx/PAAId8BK4oeSJxxCGnscZqQrnlb>

## 2. 推荐方案：Python Open API 直连

推荐使用仓库内脚本：

```text
feishu/write_to_feishu.py
```

脚本执行链路：

```text
读取 output/final_script.md + output/storyboard.md + output/risk_check.md
  -> 获取 tenant_access_token
  -> 写入已有 Docx 或创建新 Docx
  -> 调用 Markdown 转 block API
  -> 批量写入飞书文档 blocks
  -> 输出 Document ID
```

## 3. 环境变量

复制 `feishu/.env.example` 为 `feishu/.env`，或在 PowerShell 中临时注入：

```powershell
$env:FEISHU_APP_ID="cli_xxx"
$env:FEISHU_APP_SECRET="your_app_secret"
```

写入已有文档：

```powershell
$env:FEISHU_DOCUMENT_ID="your_docx_document_id"
```

创建新文档：

```powershell
$env:FEISHU_FOLDER_TOKEN="your_folder_token"
$env:FEISHU_DOCUMENT_TITLE="轻醒小红书短视频商单脚本"
```

凭证安全要求：

- 不要把真实 `FEISHU_APP_SECRET` 写入 README、脚本或 Git。
- `.env` 已被 `.gitignore` 忽略，但仍建议只在本机保存。
- 如果 Secret 曾经外泄，应在飞书开放平台重置。

## 4. 运行命令

安装依赖：

```bash
pip install -r feishu/requirements.txt
```

先做本地配置检查：

```bash
python feishu/write_to_feishu.py --dry-run
```

确认无误后执行真实写入：

```bash
python feishu/write_to_feishu.py
```

## 5. 备用方案：lark-cli

如果已经完成 lark-cli 登录授权，也可以使用：

```powershell
.\feishu\write_with_lark_cli.ps1
```

该脚本会先合并最终脚本、分镜和质检内容到 `output/feishu_document.md`，再调用 `lark-cli docs +create` 创建飞书文档。

如授权过期，先重新登录：

```bash
lark-cli auth login --recommend
```

## 6. 飞书权限要求

飞书应用至少需要具备以下能力：

- 获取 `tenant_access_token`
- 创建 Docx 文档，或访问指定 Docx 文档
- 将 Markdown 转换为 Docx blocks
- 写入 Docx blocks

如果写入失败，优先检查：

- `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 是否属于同一应用
- 应用是否已开通云文档相关权限
- 目标文档或文件夹是否授权给该应用
- `FEISHU_DOCUMENT_ID` 是否为新版 Docx 文档 token

## 7. 中文编码建议

仓库文件均按 UTF-8 保存。若 PowerShell 或 cmd 出现中文乱码，优先用支持 UTF-8 的编辑器查看文件；脚本内部接口请求会按 `utf-8` 读取 Markdown 正文。

## 8. 本次任务结论

本项目已经完成：

- 基于凌二七产出 60-90 秒小红书短视频脚本。
- 输出标题、开头钩子、完整口播、产品植入点、结尾 CTA 和拍摄提示。
- 输出 6 个以上分镜，包含画面、口播/字幕、道具/场景、时长建议。
- 输出食品类商单合规风险质检。
- 提供 Python Open API 直连和 lark-cli 两种飞书自动化写入路径。

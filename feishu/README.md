# 飞书文档接入说明

## 目标

将 `output/final_script.md`、`output/storyboard.md` 和 `output/risk_check.md` 的内容通过自动化方式写入飞书文档，避免只手动复制粘贴。

## 推荐接入方案：larksuite/cli

可以接 `https://github.com/larksuite/cli`。这条路线更适合测试题里的“自动化写入飞书文档”要求，因为它可以通过命令行把本地 Markdown 内容创建为飞书文档，也便于在 README 里说明可复现流程。

注意：App Secret 等同于应用密码。不要写入 GitHub 仓库，不要提交 `.env`，如果已经暴露过，建议在飞书开放平台重置一次。

### 1. 安装 CLI

```bash
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g
```

### 2. 初始化应用配置

```bash
lark-cli config init --new
```

按提示填写飞书开放平台应用的：

- App ID
- App Secret

CLI 会把凭证保存到本机配置中，不需要把真实密钥写进仓库。

### 3. 登录授权

```bash
lark-cli auth login --recommend
```

如果 CLI 提示选择权限，优先选择 Docs / Drive 相关权限。

### 4. 写入飞书文档

```powershell
.\feishu\write_with_lark_cli.ps1
```

脚本会合并以下文件：

- `output/final_script.md`
- `output/storyboard.md`
- `output/risk_check.md`

并调用 `lark-cli docs +create` 创建飞书文档。

## 备选接入方案：Python API

使用飞书开放平台新版云文档 API：

1. 创建飞书自建应用。
2. 获取 `APP_ID` 和 `APP_SECRET`。
3. 给应用开通云文档相关权限，并将目标文档或目标文件夹授权给该应用。
4. 选择一种写入方式：
   - 写入已有文档：配置 `FEISHU_DOCUMENT_ID`。
   - 创建新文档：配置 `FEISHU_FOLDER_TOKEN`。
5. 运行 `write_to_feishu.py`，脚本会读取本地 Markdown 文件，调用飞书 API 转成文档 block，再写入飞书文档。

## 环境变量

复制 `.env.example` 为 `.env`：

```text
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
FEISHU_DOCUMENT_ID=xxx
FEISHU_PARENT_BLOCK_ID=
FEISHU_INSERT_INDEX=0
FEISHU_FOLDER_TOKEN=
FEISHU_DOCUMENT_TITLE=轻醒小红书短视频商单脚本
```

说明：

- `FEISHU_DOCUMENT_ID`：已有新版飞书文档的 document_id。
- `FEISHU_PARENT_BLOCK_ID`：可选。默认使用 `document_id` 作为父 block；如果 API 报父 block 不存在，再填写具体 block_id。
- `FEISHU_INSERT_INDEX`：可选。默认 `0`，表示插入文档开头。
- `FEISHU_FOLDER_TOKEN`：可选。未配置 `FEISHU_DOCUMENT_ID` 时，用它创建新文档。

## 运行方式

### 方式 A：larksuite/cli

```powershell
.\feishu\write_with_lark_cli.ps1
```

### 方式 B：Python API

```bash
pip install requests

# 先做本地配置检查，不调用写入 API
python feishu/write_to_feishu.py --dry-run

# 确认配置无误后执行真实写入
python feishu/write_to_feishu.py
```

## 脚本执行链路

```text
读取 output/final_script.md + storyboard.md + risk_check.md
  -> 获取 tenant_access_token
  -> 如无 FEISHU_DOCUMENT_ID，则创建新 docx 文档
  -> 调用 Markdown 转 block API
  -> 调用文档 block children API 写入
  -> 输出 Document ID
```

## 权限限制记录

如果无法完成真实写入，请补充：

- 是否创建了飞书应用：
- 是否拿到 API 权限：
- 报错信息：
- 排查过程：
- 最终降级方案：
- 飞书文档截图路径：

## 常见问题

### 1. token 获取失败

检查 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 是否属于同一个自建应用。

### 2. 文档写入失败

检查目标文档是否已授权给应用。飞书文档通常需要在文档侧添加应用权限，或把文档放到应用可访问的文件夹中。

### 3. document_id 不确定

从飞书文档链接中提取文档 token。新版 docx 文档链接通常包含一段文档 token，需要填入 `FEISHU_DOCUMENT_ID`。

## 最终飞书文档

- 文档链接：
- 截图路径：

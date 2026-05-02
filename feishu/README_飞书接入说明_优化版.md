# 轻醒 x 凌二七短视频脚本：飞书自动化接入说明

## 1. 交付结果

本次已完成两类交付：

- 小红书短视频脚本：`script.md`
- 飞书文档自动化写入：已通过飞书开放平台 API 创建并写入文档

当前可访问的飞书文档：

- 最新 API 直连写入版：<https://feishu.cn/docx/PAAId8BK4oeSJxxCGnscZqQrnlb>
- 早前 lark-cli 写入版：<https://www.feishu.cn/docx/A2N7dhhWdohftDx0Ncjc7HxWnCh>

本次自动化写入不是手动复制粘贴，而是通过脚本读取 Markdown 内容后调用飞书接口创建文档并写入正文。

## 2. 本地文件清单

当前工作目录：

```text
C:\Users\31963\Documents\Codex\2026-05-02\1-2-3-4-0-22
```

核心文件：

| 文件 | 用途 |
|---|---|
| `script.md` | 最终 60-90 秒小红书短视频脚本，可直接给博主推进录制 |
| `feishu_write_direct.js` | 本次实际成功使用的飞书 Open API 直连写入脚本 |
| `write_feishu.ps1` | 基于本机 `feishu-doc` skill 的封装脚本，目前因依赖缺失作为备用 |
| `README.md` | 原始交付说明 |
| `README_飞书接入说明_优化版.md` | 当前这份整理后的接入说明 |
| `ling_profile.png` | 凌二七主页实时截图证据 |
| `wenjing_profile.png` | 文静不pang 主页实时截图证据 |

## 3. 推荐接入方案：Open API 直连写入

推荐使用 `feishu_write_direct.js`。它不依赖本地缺失的 `feishu-common` 模块，流程更短、更可控。

### 3.1 执行流程

1. 从环境变量读取 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET`。
2. 调用飞书接口获取 `tenant_access_token`。
3. 调用 `docx/v1/documents` 创建飞书 Docx 文档。
4. 读取本地 `script.md`。
5. 将 Markdown 转换为飞书文档 blocks。
6. 批量写入飞书文档。
7. 输出 `doc_token`、文档链接和写入 block 数。

### 3.2 运行命令

在 PowerShell 中进入工作目录：

```powershell
cd "C:\Users\31963\Documents\Codex\2026-05-02\1-2-3-4-0-22"
```

临时注入飞书应用凭证：

```powershell
$env:FEISHU_APP_ID="cli_xxx"
$env:FEISHU_APP_SECRET="你的 App Secret"
```

执行写入：

```powershell
& "C:\Users\31963\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\feishu_write_direct.js"
```

成功输出示例：

```json
{
  "title": "Qingxing x Ling Erqi XHS Video Script",
  "doc_token": "PAAId8BK4oeSJxxCGnscZqQrnlb",
  "url": "https://feishu.cn/docx/PAAId8BK4oeSJxxCGnscZqQrnlb",
  "blocks_added": 65
}
```

### 3.3 凭证安全说明

- 不建议把 `App Secret` 写入 README、脚本或配置文件。
- 推荐只通过环境变量临时注入。
- 运行完成后，如需清理当前 PowerShell 会话中的变量：

```powershell
Remove-Item Env:\FEISHU_APP_ID
Remove-Item Env:\FEISHU_APP_SECRET
```

## 4. 备用接入方案：lark-cli 用户授权写入

桌面原 README 中记录的是 `lark-cli` 路线，适合已经完成用户扫码授权、并希望以用户身份创建文档的场景。

### 4.1 典型命令

```bash
cmd.exe /c "cd /d C:\Users\31963\Desktop && lark-cli docs +create --title \"轻醒x凌二七短视频脚本\" --markdown @轻醒_凌二七短视频脚本.md"
```

### 4.2 执行逻辑

1. 本地生成 Markdown 脚本文件。
2. 使用 `cmd.exe /c` 进入 Markdown 文件所在目录。
3. 调用 `lark-cli docs +create`。
4. 通过 `--markdown @文件名.md` 自动读取 Markdown 内容。
5. 飞书返回文档 ID 和 URL。

### 4.3 注意事项

- 如果在 WSL2 或混合终端中运行，建议用 `cmd.exe /c` 调用 Windows 侧的 `lark-cli`。
- `--markdown @file` 对相对路径敏感，最好先 `cd` 到文件所在目录。
- 用户授权 token 可能过期，过期后需重新执行：

```bash
lark-cli auth login --recommend
```

## 5. 备用接入方案：feishu-doc Skill

本机存在 `feishu-doc-1.2.7` skill，理论上支持：

```powershell
node C:\Users\31963\.agents\skills\feishu-doc-1.2.7\index.js --action create --title "Qingxing x Ling Erqi XHS Video Script"
node C:\Users\31963\.agents\skills\feishu-doc-1.2.7\index.js --action write --token <doc_token> --content "<script.md 内容>"
```

也已封装为：

```powershell
.\write_feishu.ps1
```

但当前环境实测存在阻塞：

- `C:\Users\31963\.agents\skills\feishu-doc-1.2.7\config.json` 中 `app_id` / `app_secret` 为空。
- `FEISHU_APP_ID` / `FEISHU_APP_SECRET` 默认未配置。
- 运行时报错：`Cannot find module '../feishu-common/index.js'`。

因此当前推荐使用第 3 节的 `feishu_write_direct.js`。

## 6. 飞书应用权限要求

飞书应用至少需要具备以下能力：

- 获取 tenant access token
- 创建 Docx 文档
- 写入 Docx blocks

建议在飞书开放平台为应用开通与云文档相关的权限，例如：

- `docx:document:create`
- `docx:document:write_only`
- 必要时加入文档读取/编辑相关权限，视租户配置而定

如果文档创建成功但其他人打不开，需要检查：

- 文档空间是否允许该应用创建文档
- 文档是否需要额外共享权限
- 应用是否只在某个租户或空间内可用

## 7. 排错清单

### 7.1 获取 token 失败

可能原因：

- `FEISHU_APP_ID` 或 `FEISHU_APP_SECRET` 错误
- 应用未启用
- 应用不属于当前租户

处理方式：

- 重新确认 App ID / Secret
- 确认应用已发布或在测试企业内可用
- 不要在 README 中明文保存 Secret

### 7.2 创建文档失败

可能原因：

- 应用没有云文档创建权限
- 租户未授权该应用访问云文档
- 接口权限未审批

处理方式：

- 在飞书开放平台补齐 Docx 权限
- 重新发布/安装应用
- 再运行 `feishu_write_direct.js`

### 7.3 lark-cli 找不到文件

可能原因：

- `--markdown @file` 使用了错误的相对路径
- 当前目录不是 Markdown 文件所在目录

处理方式：

```bash
cmd.exe /c "cd /d C:\Users\31963\Desktop && lark-cli docs +create --title \"标题\" --markdown @文件名.md"
```

### 7.4 中文乱码

可能原因：

- PowerShell / cmd 编码与文件编码不一致
- 中文标题被错误解释

处理方式：

- 脚本内部标题尽量使用 ASCII，例如 `Qingxing x Ling Erqi XHS Video Script`
- Markdown 正文保留 UTF-8
- 必要时使用 VS Code 或支持 UTF-8 的编辑器查看

## 8. 推荐长期方案

短期推荐：

- 使用 `feishu_write_direct.js`
- Secret 通过环境变量临时注入
- 文档链接写回 README

长期推荐：

- 修复或安装 `feishu-common`
- 将 `write_feishu.ps1` 与 `feishu-doc` skill 标准化
- 把 `script.md -> 飞书文档` 做成固定命令
- Secret 存放到安全的本地密钥管理器或环境变量，不进入 Git/README

## 9. 本次任务结论

本次已经完成：

- 基于凌二七产出 60-90 秒小红书短视频脚本。
- 脚本包含标题、开头钩子、完整口播、产品植入点、结尾 CTA、合规风险提醒。
- 分镜超过 6 个镜头，包含画面、口播/字幕、道具/场景、时长建议。
- 通过自动化脚本写入飞书文档。
- README 中说明了两种接入方式：Open API 直连与 lark-cli 用户授权。

最终建议使用链接：

<https://feishu.cn/docx/PAAId8BK4oeSJxxCGnscZqQrnlb>

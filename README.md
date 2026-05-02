# 轻醒小红书 MCN 商单脚本生成助手

本项目用于完成「AI Agent 解决方案实习生 - MCN AI 业务方向」实操测试题，围绕轻食酸奶品牌「轻醒」完成达人调研、内容拆解、AI 工作流设计、可复用 Skill、商单脚本生成、分镜设计与飞书文档自动化写入说明。

## 项目目标

- 基于小红书真实内容生态，筛选适合「轻醒」品牌的达人。
- 将达人内容风格拆解为可复用的脚本生成方法。
- 设计一个从 brief 拆解到飞书写入的 AI Agent 工作流。
- 沉淀一个可复用的 MCN 商单脚本助手 Skill。
- 输出一条适合真实达人拍摄的 60-90 秒小红书短视频脚本与分镜。

## 仓库结构

```text
/
├── README.md
├── report.md
├── prompts/
│   ├── 01-brief-analysis.md
│   ├── 02-influencer-style-analysis.md
│   ├── 03-script-generation.md
│   ├── 04-risk-check.md
│   └── 05-feishu-write-format.md
├── references/
│   ├── influencer-research-template.md
│   └── content-breakdown-template.md
├── skills/
│   └── mcn-script-assistant/
│       └── SKILL.md
├── feishu/
│   ├── README.md
│   ├── write_to_feishu.py
│   └── .env.example
└── output/
    ├── final_script.md
    ├── storyboard.md
    └── risk_check.md
```

## 使用的 AI 工具

- AI 对话工具：用于 brief 拆解、脚本初稿生成、合规质检与 Skill 沉淀。
- 小红书：用于达人调研、内容风格观察与参考素材记录。
- 飞书开放平台：用于将最终脚本以自动化方式写入飞书文档。
- lark-cli：作为飞书用户授权写入的备用方案。
- Node.js 脚本：用于通过飞书 Open API 直连创建并写入 Docx 文档。

## 工作流概览

1. Brief 拆解：提取品牌、产品、卖点、人群、平台、限制与禁用表达。
2. 达人调研：筛选 2-3 位小红书博主，记录主页、内容方向、代表内容与适配理由。
3. 风格分析：拆解博主的人设、场景、开头钩子、镜头语言和表达方式。
4. 脚本生成：生成适合指定博主拍摄的 60-90 秒短视频脚本。
5. 风险质检：检查是否存在减肥、治疗、降糖、夸大功效等违规表述。
6. 飞书写入：通过脚本或自动化流程将最终脚本写入飞书文档。

## 如何运行

### 1. 查看调研与报告

```text
report.md
references/轻醒酸奶_博主调研报告.md
references/blogger-shortlist.md
```

### 2. 查看 Prompt 与 Skill

```text
prompts/
skills/mcn-script-assistant/SKILL.md
```

### 3. 查看最终脚本、分镜和质检

```text
output/final_script.md
output/storyboard.md
output/risk_check.md
```

### 4. 运行飞书自动化写入

本次实际成功使用的是飞书 Open API 直连写入方案。运行时不把密钥写进仓库，而是通过环境变量临时注入：

```powershell
$env:FEISHU_APP_ID="cli_xxx"
$env:FEISHU_APP_SECRET="your_app_secret"
node .\feishu_write_direct.js
```

如果使用仓库中的备用 Python 脚本，可参考：

```bash
pip install requests
python feishu/write_to_feishu.py --dry-run
python feishu/write_to_feishu.py
```

如果使用 lark-cli 备用方案，可参考：

```powershell
lark-cli auth login --recommend
lark-cli docs +create --title "轻醒x凌二七短视频脚本" --markdown @script.md
```

## 最终交付

- 调研报告：`report.md`
- Prompt 与工作流：`prompts/`
- 可复用 Skill：`skills/mcn-script-assistant/SKILL.md`
- 最终脚本：`output/final_script.md`
- 分镜设计：`output/storyboard.md`
- 质检结果：`output/risk_check.md`
- 飞书接入说明：`feishu/README.md`
- 最终飞书文档：<https://feishu.cn/docx/PAAId8BK4oeSJxxCGnscZqQrnlb>

## 当前状态

- [x] 完成小红书达人调研
- [x] 完成内容拆解
- [x] 完成 AI 工作流与 Prompt 设计
- [x] 完成可复用 Skill
- [x] 完成最终脚本
- [x] 完成分镜设计
- [x] 完成飞书自动化写入
- [ ] 提交 GitHub 仓库链接

## 飞书自动化接入结果

本项目已完成飞书文档自动化写入，不是手动复制粘贴。实际流程为：本地生成 Markdown 脚本文件，脚本读取脚本/分镜/质检结果，通过飞书开放平台 API 获取 `tenant_access_token`，创建 Docx 文档，并将内容转换为飞书 blocks 写入。

最终飞书文档：

<https://feishu.cn/docx/PAAId8BK4oeSJxxCGnscZqQrnlb>

凭证安全说明：真实 `App Secret` 不写入仓库，也不提交到 GitHub。实际运行时通过环境变量临时注入。

## 权限、登录与 API 限制排查记录

本次确实遇到过权限、登录和本地依赖相关限制，处理过程如下：

| 问题 | 表现 | 排查 | 最终处理 |
| --- | --- | --- | --- |
| lark-cli 用户授权依赖登录态 | 需要用户扫码授权，token 可能过期 | 查看 `lark-cli auth login --recommend` 路线，确认其适合用户身份创建文档 | 保留为备用方案，不作为最终主链路 |
| 本机 feishu-doc skill 依赖缺失 | 运行时报错 `Cannot find module '../feishu-common/index.js'` | 检查本地 skill 配置，发现 `app_id` / `app_secret` 为空且依赖模块缺失 | 放弃该路线，改用更可控的 Open API 直连脚本 |
| 飞书 Open API 权限要求 | 创建/写入 Docx 需要应用具备云文档权限 | 确认需要获取 `tenant_access_token`、创建 Docx 文档、写入 Docx blocks | 使用 `feishu_write_direct.js` 直连飞书 Open API，成功创建并写入文档 |
| 凭证安全风险 | App Secret 不应出现在 README 或 GitHub | 检查仓库未提交 `.env`，并用 `.gitignore` 忽略密钥文件 | 运行时通过环境变量注入，README 只写占位符 |
| 中文编码问题 | PowerShell / cmd 下中文标题可能乱码 | 观察到混合终端对中文路径和标题较敏感 | 脚本内部标题可使用 ASCII，Markdown 正文保持 UTF-8 |

最终处理结果：采用 Open API 直连方案完成自动化写入，并保留 lark-cli 和 Python API 作为备选说明。最终文档链接已写入 README 和 `feishu/README_飞书接入说明_优化版.md`。

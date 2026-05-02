# Prompt 说明

本目录用于提交 B 部分「AI 工作流与 Skill 设计」的核心 Prompt。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `00-agent-workflow.md` | 5 步流程 Agent 设计 |
| `01-brief-analysis.md` | Brief 拆解 Prompt |
| `02-influencer-style-analysis.md` | 达人风格分析 Prompt |
| `03-script-generation.md` | 商单脚本生成 Prompt |
| `04-risk-check.md` | 合规风险质检 Prompt |
| `05-feishu-write-format.md` | 飞书写入格式整理 Prompt |

## 输入输出关系

```text
客户 brief
  -> 01 Brief 拆解
  -> 02 达人风格分析
  -> 03 脚本生成
  -> 04 风险质检
  -> 05 飞书写入格式
```

## 核心约束

- 不虚构博主数据。
- 不照搬博主原文。
- 不使用减肥、治疗、降糖等功效承诺。
- 输出必须适合真实达人低成本拍摄。
- 飞书写入需要说明自动化方式，不能只写“手动复制”。

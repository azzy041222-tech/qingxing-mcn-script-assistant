$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$finalScript = Join-Path $root "output\final_script.md"
$storyboard = Join-Path $root "output\storyboard.md"
$riskCheck = Join-Path $root "output\risk_check.md"
$merged = Join-Path $root "output\feishu_document.md"

$content = @(
    "# 轻醒小红书短视频商单脚本"
    ""
    "## 1. 最终脚本"
    ""
    (Get-Content -Raw -Encoding UTF8 $finalScript)
    ""
    "---"
    ""
    "## 2. 分镜设计"
    ""
    (Get-Content -Raw -Encoding UTF8 $storyboard)
    ""
    "---"
    ""
    "## 3. 合规质检"
    ""
    (Get-Content -Raw -Encoding UTF8 $riskCheck)
) -join "`n"

Set-Content -Path $merged -Value $content -Encoding UTF8

lark-cli docs +create --title "轻醒小红书短视频商单脚本" --markdown "@$merged"

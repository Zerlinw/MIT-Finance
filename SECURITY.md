# 安全策略

## 支持范围

OpenCourseAtlas 是纯静态站点，没有后端、数据库或用户账户系统。我们仍会认真处理以下安全问题：

| 版本 | 支持状态 |
| --- | --- |
| `1.x` | ✅ 接受安全修复 |
| `< 1.0` | ❌ 不再维护 |

## 报告漏洞

**请勿通过公开 Issue 报告安全漏洞。**

优先方式：

1. 使用 GitHub 的 [私密漏洞报告](https://github.com/Zerlinw/OpenCourseAtlas/security/advisories/new)（Security → Report a vulnerability）。
2. 如无法使用上述入口，发送邮件至 `623035054@qq.com`，标题注明 `[SECURITY]`。

请在报告中提供：

- 受影响的页面 / 文件与版本（tag 或 commit）。
- 复现步骤或最小复现样例。
- 影响评估（例如 XSS、内容注入、供应链风险）。
- 可行的修复建议（如有）。
- 是否希望公开致谢，以及希望使用的署名。

## 响应流程

| 阶段 | 目标时间 |
| --- | --- |
| 确认收到 | 48 小时内 |
| 初步评估与分级 | 7 天内 |
| 修复或缓解 | 视严重程度，通常 30 天内 |
| 公开披露 | 修复发布后，与报告者协商 |

我们会通过私密渠道同步进展；在修复发布前，请勿公开细节。

## 安全边界

重点关注：

- **内容注入 / XSS**：`catalog-data.js`、`catalog-figures.js` 中的数据会进入 `innerHTML` 与 SVG 字符串。新增内容必须经过转义或使用受控字段。
- **链接注入**：`source`、`deepLink` 等字段不得包含 `javascript:` 等危险协议。
- **供应链**：GitHub Actions 使用固定主版本；依赖机器人负责提示更新。项目本身没有 npm 运行时依赖。
- **密钥泄露**：仓库不应包含任何 token、私钥或 `.env` 文件；如误提交，请立即轮换密钥并报告。

不属于安全问题的示例：

- 公开课程内容的事实性错误（请走内容 Issue）。
- 第三方高校网站自身的漏洞。
- 静态托管平台的可用性问题。

## 安全开发建议

- 渲染用户/数据字段时优先使用 `textContent` 或现有 `esc()` 转义函数。
- 不在 SVG 中拼接未转义的 HTML。
- 新增外部链接时添加 `rel="noopener noreferrer"`。
- 不引入来源不明的脚本、字体或图片。
- PR 评审时关注 `innerHTML`、`eval`、`new Function`、`document.write` 的使用。

## 致谢

感谢所有以负责任方式报告问题的安全研究者。经同意后，我们会在 Release Notes 或 `SECURITY.md` 中致谢。

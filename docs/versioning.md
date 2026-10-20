# 版本管理

## 版本号格式

项目遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/)：

```text
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

| 部分 | 含义 | 示例 |
| --- | --- | --- |
| MAJOR | 不兼容的变更 | `2.0.0` |
| MINOR | 向后兼容的新功能 / 新内容 | `1.3.0` |
| PATCH | 向后兼容的修复 | `1.3.1` |
| PRERELEASE | 预发布标识 | `1.4.0-beta.1` |

当前版本：**1.0.0**。

## 唯一事实来源

版本号只在一个地方手工维护：

```text
package.json → version
```

其它位置必须与它保持一致：

| 位置 | 形式 | 由谁保证 |
| --- | --- | --- |
| `package.json` | `"version": "1.2.3"` | 人工 / `npm version` |
| Git tag | `v1.2.3` | 发布流程 |
| GitHub Release | 标题含 `v1.2.3` | `release.yml` |
| `CHANGELOG.md` | `## [1.2.3] - YYYY-MM-DD` | 发布 PR |
| README 徽章 | 动态读取 `package.json` | shields.io |

`scripts/check-release.mjs` 会校验 tag、`package.json` 与 CHANGELOG 三者一致，不一致则阻止发布。

## 变更类型映射

本项目是内容站点，版本语义在代码之外还要覆盖内容：

| 变更 | 版本 | 示例 |
| --- | --- | --- |
| 破坏性 URL / 数据 Schema 变更 | **MAJOR** | 移除 `course.html`，重命名 `COURSES` 必填字段 |
| 删除页面或公开数据字段 | **MAJOR** | 删除 `deepPath` 且不提供兼容 |
| 新页面、新交互、新筛选 | **MINOR** | 新增课程对比页 |
| 新增学校 / 课程 / 学科 | **MINOR** | 新增剑桥数学课程 |
| 新增图解类型 | **MINOR** | 新增 `radar` 渲染器 |
| 新增可选字段 | **MINOR** | 课程增加 `cover` 字段 |
| 内容纠错、文案修订 | **PATCH** | 修正年份、错别字、图解数值 |
| 样式修复、可访问性修复 | **PATCH** | 修复移动端横向滚动 |
| CI / 依赖 / 文档修正 | **PATCH** | 升级 Actions、修正文档链接 |

> 纯内容新增也算 MINOR，因为它扩展了站点能力与可访问内容；纯纠错算 PATCH。这样版本号能反映内容规模变化。

## 兼容性承诺

在同一个 MAJOR 版本内：

- **URL 保持稳定**：`index.html`、`courses.html`、`course.html?id=...`、`gallery.html?course=...&fig=...` 不改变含义。
- **数据字段向后兼容**：不删除必填字段；新增字段优先可选。
- **图解类型不删除**：已发布的类型至少保留一个 MINOR 周期。
- **构建命令稳定**：`npm run dev/build/validate` 保持可用。
- **静态部署方式稳定**：`dist/` 仍为发布目录。

不保证：

- 视觉设计、CSS 类名、内部函数名。
- 非公开的 `scripts/` 内部实现。
- 第三方课程内容的持续可用性。

## 弃用流程

需要移除字段、页面或类型时：

1. **标记弃用**（MINOR）：在文档与代码注释中标注，保留旧行为；如可能，输出控制台警告。
2. **提供迁移**（MINOR）：新增替代字段 / 页面，并在 CHANGELOG 说明迁移方式。
3. **移除**（MAJOR）：至少经过一个 MINOR 周期后移除，更新 Schema 与校验器。
4. **记录**：在 CHANGELOG 的 `Deprecated` / `Removed` 中说明。

## 预发布版本

用于较大改动或需要提前验证的版本：

```text
1.4.0-alpha.1
1.4.0-beta.1
1.4.0-rc.1
```

规则：

- 预发布 tag 形如 `v1.4.0-beta.1`，`package.json` 同步为 `1.4.0-beta.1`。
- 预发布不保证兼容，不部署到正式 Pages（除非手动触发预览环境）。
- 正式发布时移除预发布后缀，CHANGELOG 合并到 `1.4.0`。

## 发布版本示例

```text
v1.0.0   首个标准化版本：目录、文档、CI、84 张图解
v1.1.0   新增 UCL / Caltech 课程
v1.1.1   修正课程年份与图解数值
v1.2.0   新增课程对比页与 2 种图解类型
v2.0.0   重构数据 Schema（破坏性）
```

## 版本发布节奏

- **内容版本**：按需，建议每 2–4 周积累一批课程/图解后发布 MINOR。
- **修复版本**：随时发布 PATCH。
- **大版本**：仅在确有破坏性变更时发布，并提前在 Issue 中讨论。

不强制固定发版日；但每个版本必须有 CHANGELOG 与 Release Notes。

## 常见问题

**Q：只改了一个错别字，需要发版吗？**
A：可以合并到下一次 PATCH；不必为每个提交单独发版。发布时汇总同类修复。

**Q：新增一所学校的 0 门课程，算 MINOR 吗？**
A：算内容扩展，但建议同时提供至少 1 门课程，避免空学校卡片。

**Q：可以删除已发布的 tag 吗？**
A：不建议。tag 是公共契约；如必须删除，先确认没有下游依赖，并在 Issue 中记录原因。

**Q：为什么 README 不写死版本号？**
A：避免多处维护导致不一致；README 使用动态徽章，版本以 `package.json` 与 Release 为准。

## 相关文档

- [提交规范](commit-convention.md)
- [发布流程](release-process.md)
- [分支策略](branch-strategy.md)

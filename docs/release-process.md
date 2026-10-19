# 发布流程

## 发布模型

- 版本从 `main` 发布，使用 **annotated Git tag**（`vX.Y.Z`）。
- `package.json` 是版本唯一事实来源。
- `CHANGELOG.md` 必须包含对应版本条目。
- 推送 tag 后，`.github/workflows/release.yml` 自动校验、构建、打包并创建 GitHub Release。
- GitHub Pages 的部署由 `main` 推送触发，与 Release 相互独立。

## 发布前条件

- [ ] `main` 上 CI 全绿，Pages 部署成功。
- [ ] 所有计划合并的 PR 已合并，没有进行中的大改动。
- [ ] `CHANGELOG.md` 的 `[Unreleased]` 已整理。
- [ ] 安全漏洞已处理或有明确说明。
- [ ] 版本号已按 [版本管理](versioning.md) 确定。
- [ ] 维护者确认发布时间与范围。

## 标准发布流程

### 1. 准备版本分支

```bash
git switch main
git pull --ff-only
git switch -c chore/release-1.1.0
```

分支名使用目标版本：`chore/release-<version>`。

### 2. 更新版本号

推荐使用 npm 自动更新（不创建 commit / tag）：

```bash
npm version 1.1.0 --no-git-tag-version
```

或手动修改 `package.json` 的 `version`。不要同时修改多个地方的版本号。

### 3. 更新 CHANGELOG

把 `[Unreleased]` 中的内容整理到新版本标题下：

```markdown
## [Unreleased]

## [1.1.0] - 2026-11-15

### Added
- 新增 UCL 神经科学课程与 6 张图解。
- 新增课程对比页。

### Changed
- 课程筛选状态同步到 URL。

### Fixed
- 修复图解页在 360px 宽度下的横向滚动。

[Unreleased]: https://github.com/Zerlinw/OpenCourseAtlas/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Zerlinw/OpenCourseAtlas/releases/tag/v1.1.0
```

要求：

- 日期使用 `YYYY-MM-DD`。
- 分类使用 Keep a Changelog 的 `Added` / `Changed` / `Deprecated` / `Removed` / `Fixed` / `Security`。
- 面向使用者描述影响，不逐条罗列 commit。
- 破坏性变更单独加 `### Breaking Changes` 与迁移说明。

### 4. 本地验证

```bash
npm run validate
npm run build
npm run release:check -- v1.1.0
```

`release:check` 需要 `package.json`、`CHANGELOG.md` 与传入 tag 一致；此时还没有 tag，传入目标 tag 即可预检。

可选：`npm run preview` 检查 `dist/`。

### 5. 提交版本变更

```bash
git add package.json CHANGELOG.md
git commit -m "chore(release): 1.1.0"
git push -u origin chore/release-1.1.0
```

### 6. PR 与合并

- 创建 PR，标题：`chore(release): 1.1.0`。
- 描述中附发布范围、验证结果与 CHANGELOG 摘要。
- CI 通过、评审通过后 **Squash and merge**。
- 删除分支。

### 7. 打 tag 并推送

```bash
git switch main
git pull --ff-only
git tag -a v1.1.0 -m "OpenCourseAtlas v1.1.0"
git push origin v1.1.0
```

要求：

- 使用 annotated tag（`-a`），不要 lightweight tag。
- tag 必须指向 `main` 上的版本提交。
- 不要重复使用或移动已发布的 tag。

### 8. 自动化发布

推送 tag 后 `release.yml` 会：

1. 校验 tag 格式与 `package.json` 版本一致。
2. 校验 `CHANGELOG.md` 含该版本。
3. 运行 `npm run validate` 与 `npm run build`。
4. 打包 `dist/` 为 `opencourseatlas-v1.1.0.zip`。
5. 使用 `gh release create` 创建 GitHub Release，自动生成 Release Notes，并上传 zip。

如果工作流失败：

- 修复问题后，删除远端 tag 与 Release，重新打 tag；或发布一个 PATCH 版本。
- 不要在失败后强行移动公共 tag。

### 9. 发布后检查

- [ ] GitHub Release 已创建，包含 zip 与变更说明。
- [ ] Actions 中 `Release` 与 `Deploy to GitHub Pages` 均成功。
- [ ] 线上首页、课程页、图解页、404 正常。
- [ ] 资源无 404，控制台无报错。
- [ ] README 徽章显示的版本已更新（shields.io 可能有缓存）。
- [ ] 如有 Breaking Change，已在 Release Notes 与 CHANGELOG 中说明迁移方式。
- [ ] 通知团队 / 社区（如适用）。

## 发布后补充 Release Notes

自动生成的 notes 以 PR 标题为主。建议手动补充：

```markdown
## 亮点

- 新增 UCL 神经科学课程，含 6 张图解。
- 课程列表支持按难度筛选并同步 URL。

## 内容

- 新增 1 所学校、1 门课程、6 张图解。
- 修正 3 处课程年份与 2 处图解数值。

## 修复

- 修复移动端横向滚动。
- 修复图解页键盘切换边界。

## 升级注意

- 无破坏性变更，可直接升级。

## 贡献者

感谢 @contributor1、@contributor2。
```

## 热修复发布

适用于线上严重问题（资源 404、页面白屏、安全漏洞）：

```bash
git switch main
git pull --ff-only
git switch -c hotfix/<slug>
# 修复
npm run validate
npm run build
git commit -m "fix(<scope>): ..."
```

然后：

1. 开 PR 到 `main`，走正常评审与 CI。
2. 合并后，按标准流程发布 **PATCH** 版本（如 `v1.1.1`）。
3. 在 CHANGELOG 中说明问题影响、修复方式与是否需要用户操作。

如果 `main` 已包含未发布的新功能，不希望随热修复一起发布：

1. 从上一个 tag 创建维护分支：`git switch -c release/1.x v1.1.0`。
2. 在维护分支修复并发布 `v1.1.1`。
3. 将修复 cherry-pick 回 `main`，避免下次发布回归。

## 回滚

### 回滚代码

```bash
git switch main
git revert <bad-commit>
git push origin main
```

Pages 会自动重新部署。随后发布一个 PATCH 版本记录回滚。

### 回滚 Release

- 不建议删除公共 Release / tag；优先发布新版本修复。
- 如 Release 资产损坏，可删除该 Release 并重新创建，但保留 tag 指向。
- 如需撤销整个版本，发布 `vX.Y.(Z+1)`，在 notes 中说明回滚原因。

### 回滚 Pages

在 Actions 中重新运行上一个成功的 `Deploy to GitHub Pages`，或 revert 后重新部署。

## 检查清单

### 发布前

- [ ] 版本号符合 SemVer，且只在 `package.json` 维护。
- [ ] CHANGELOG 有日期、分类、迁移说明。
- [ ] `npm run validate` 通过。
- [ ] `npm run build` 通过。
- [ ] 浏览器冒烟检查通过。
- [ ] 安全与版权检查通过。
- [ ] PR 已合并，分支已删除。

### 发布中

- [ ] tag 为 annotated，格式 `vX.Y.Z`。
- [ ] tag 指向 `main` 的版本提交。
- [ ] Release 工作流成功。
- [ ] Release 包含 zip 与说明。

### 发布后

- [ ] Pages 部署成功。
- [ ] 线上页面正常。
- [ ] 版本徽章更新。
- [ ] 社区通知完成。

## 相关文档

- [版本管理](versioning.md)
- [分支策略](branch-strategy.md)
- [提交规范](commit-convention.md)
- [部署指南](deployment.md)
- [仓库设置](repository-settings.md)

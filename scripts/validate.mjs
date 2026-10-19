#!/usr/bin/env node
/**
 * 仓库自检：目录、文档、页面引用、数据模型与前端脚本语法。
 *
 * 零依赖，仅使用 Node.js 内置模块；CI 与本地共用同一套规则。
 *
 * 用法：
 *   node scripts/validate.mjs
 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const ASSETS = path.join(ROOT, 'assets');

const errors = [];
const warnings = [];
const checks = [];

const pass = (message) => checks.push(message);
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const rel = (file) => path.relative(ROOT, file).split(path.sep).join('/');

async function readUtf8(file) {
  const buffer = await readFile(file);
  const text = buffer.toString('utf8');
  if (text.includes('\uFFFD')) fail(`文件不是有效的 UTF-8：${rel(file)}`);
  return text;
}

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

/* ------------------------------------------------------------------ */
/* 1. 仓库必需文件                                                     */
/* ------------------------------------------------------------------ */
const REQUIRED_FILES = [
  'README.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'LICENSE',
  'LICENSE-CONTENT',
  'CHANGELOG.md',
  'package.json',
  '.gitignore',
  '.gitattributes',
  '.editorconfig',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/CODEOWNERS',
  '.github/dependabot.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/ISSUE_TEMPLATE/content_update.yml',
  '.github/workflows/ci.yml',
  '.github/workflows/deploy-pages.yml',
  '.github/workflows/release.yml',
  'docs/README.md',
  'docs/architecture.md',
  'docs/data-model.md',
  'docs/content-guide.md',
  'docs/development.md',
  'docs/deployment.md',
  'docs/branch-strategy.md',
  'docs/versioning.md',
  'docs/commit-convention.md',
  'docs/release-process.md',
  'docs/repository-settings.md',
];

const missing = REQUIRED_FILES.filter((file) => !existsSync(path.join(ROOT, file)));
if (missing.length) {
  for (const file of missing) fail(`缺少仓库文件：${file}`);
} else {
  pass(`仓库必需文件齐全（${REQUIRED_FILES.length} 项）`);
}

/* ------------------------------------------------------------------ */
/* 2. 忽略规则                                                         */
/* ------------------------------------------------------------------ */
try {
  const ignore = await readUtf8(path.join(ROOT, '.gitignore'));
  for (const pattern of ['.idea/', '.playwright-cli/', 'node_modules/', 'dist/']) {
    if (!ignore.includes(pattern)) fail(`.gitignore 缺少规则：${pattern}`);
  }
  pass('忽略规则覆盖 IDE、依赖、构建与本地产物');
} catch {
  // 缺失文件已在上一节报告
}

/* ------------------------------------------------------------------ */
/* 3. 页面与资源引用                                                   */
/* ------------------------------------------------------------------ */
const pageFiles = (await readdir(SRC))
  .filter((file) => file.endsWith('.html'))
  .sort();
const pageSet = new Set(pageFiles);

if (!pageSet.has('index.html')) fail('src/index.html 不存在');
if (!pageSet.has('404.html')) warn('建议保留 src/404.html 以支持静态托管的自定义 404 页面');

const isExternal = (ref) => /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref);

for (const page of pageFiles) {
  const file = path.join(SRC, page);
  const html = await readUtf8(file);

  if (!/<html[^>]*\blang=["']zh-CN["']/i.test(html)) warn(`${page} 未声明 lang="zh-CN"`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${page} 缺少非空 <title>`);
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) warn(`${page} 缺少 viewport meta`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) {
    fail(`${page} 存在重复 id：${[...new Set(duplicateIds)].join(', ')}`);
  }

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const ref = match[1].trim();
    if (!ref || isExternal(ref)) continue;

    const target = ref.split('#')[0].split('?')[0];
    if (!target) continue;

    let resolved;
    if (target.startsWith('/')) resolved = path.join(ROOT, target);
    else if (target.startsWith('assets/')) resolved = path.join(ROOT, target);
    else resolved = path.join(SRC, target);

    if (!existsSync(resolved)) {
      fail(`${page} 引用了不存在的文件：${ref}`);
    }

    if (target.endsWith('.html') && !pageSet.has(path.basename(target))) {
      warn(`${page} 指向未知页面：${ref}`);
    }
  }

  if (/\b(?:href|src)=["'](?:css|js)\//.test(html)) {
    fail(`${page} 仍在使用旧的 css/ 或 js/ 路径`);
  }
}

pass(`页面检查完成（${pageFiles.length} 个页面）`);

/* ------------------------------------------------------------------ */
/* 4. JavaScript 语法                                                  */
/* ------------------------------------------------------------------ */
const jsFiles = (await walk(ASSETS)).filter((file) => file.endsWith('.js'));
for (const file of jsFiles) {
  const source = await readUtf8(file);
  try {
    new vm.Script(source, { filename: rel(file) });
  } catch (error) {
    fail(`JavaScript 语法错误：${rel(file)}：${error.message}`);
  }
}
pass(`JavaScript 语法检查通过（${jsFiles.length} 个文件）`);

/* ------------------------------------------------------------------ */
/* 5. 数据模型                                                         */
/* ------------------------------------------------------------------ */
const dataPath = path.join(ASSETS, 'js/data/catalog-data.js');
const figuresPath = path.join(ASSETS, 'js/data/catalog-figures.js');
const libraryPath = path.join(ASSETS, 'js/lib/diagram-lib.js');

const dataCode = await readUtf8(dataPath);
const figuresCode = await readUtf8(figuresPath);
const sandbox = vm.createContext({ console });
try {
  new vm.Script(
    `${dataCode}\n${figuresCode}\n;globalThis.__atlas = { DISCIPLINES, SCHOOLS, LEVELS, COURSES, FIGURES };`,
    { filename: 'catalog-data + catalog-figures' },
  ).runInContext(sandbox);
} catch (error) {
  fail(`数据文件无法执行：${error.message}`);
}

const atlas = sandbox.__atlas;
if (!atlas) {
  fail('数据文件未导出预期变量，跳过后续数据校验');
} else {
  const { DISCIPLINES, SCHOOLS, LEVELS, COURSES, FIGURES } = atlas;

  const requireFields = (item, fields, label) => {
    for (const field of fields) {
      const value = item?.[field];
      if (value === undefined || value === null || value === '') {
        fail(`${label} 缺少字段：${field}`);
      }
    }
  };

  const uniqueIds = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      if (!item?.id) {
        fail(`${label} 存在缺少 id 的条目`);
        continue;
      }
      if (seen.has(item.id)) fail(`${label} 存在重复 id：${item.id}`);
      seen.add(item.id);
    }
    return seen;
  };

  const disciplineIds = uniqueIds(DISCIPLINES, 'DISCIPLINES');
  const schoolIds = uniqueIds(SCHOOLS, 'SCHOOLS');
  const levelIds = uniqueIds(LEVELS, 'LEVELS');
  const courseIds = uniqueIds(COURSES, 'COURSES');

  for (const discipline of DISCIPLINES) {
    requireFields(discipline, ['id', 'name', 'icon', 'color'], `学科 ${discipline?.id ?? '?'}`);
  }

  for (const school of SCHOOLS) {
    requireFields(
      school,
      ['id', 'name', 'en', 'short', 'qs', 'country', 'city', 'founded', 'color', 'intro'],
      `学校 ${school?.id ?? '?'}`,
    );
    if (typeof school.qs !== 'number' || school.qs <= 0) {
      fail(`学校 ${school.id} 的 qs 应为正数`);
    }
  }

  for (const level of LEVELS) {
    requireFields(level, ['id', 'name', 'desc'], `难度 ${level?.id ?? '?'}`);
  }

  for (const course of COURSES) {
    requireFields(
      course,
      [
        'id',
        'school',
        'discipline',
        'code',
        'title',
        'en',
        'instructor',
        'level',
        'levelKey',
        'tags',
        'source',
        'minutes',
        'updated',
        'overview',
        'takeaways',
        'prereq',
        'chapters',
      ],
      `课程 ${course?.id ?? '?'}`,
    );

    if (!schoolIds.has(course.school)) fail(`课程 ${course.id} 关联了不存在的学校：${course.school}`);
    if (!disciplineIds.has(course.discipline)) {
      fail(`课程 ${course.id} 关联了不存在的学科：${course.discipline}`);
    }
    if (!levelIds.has(course.levelKey)) fail(`课程 ${course.id} 关联了不存在的难度：${course.levelKey}`);
    if (!Array.isArray(course.tags) || course.tags.length === 0) fail(`课程 ${course.id} 的 tags 不能为空`);
    if (!Array.isArray(course.takeaways) || course.takeaways.length === 0) {
      fail(`课程 ${course.id} 的 takeaways 不能为空`);
    }
    if (!Number.isFinite(course.minutes) || course.minutes <= 0) {
      fail(`课程 ${course.id} 的 minutes 应为正数`);
    }
    if (!/^\d{4}-\d{2}$/.test(String(course.updated))) {
      fail(`课程 ${course.id} 的 updated 应使用 YYYY-MM 格式`);
    }
    if (!Array.isArray(course.chapters) || course.chapters.length === 0) {
      fail(`课程 ${course.id} 至少需要一个章节`);
      continue;
    }

    const chapterIds = new Set();
    for (const chapter of course.chapters) {
      requireFields(chapter, ['id', 'title', 'summary'], `课程 ${course.id} 的章节`);
      if (chapterIds.has(chapter.id)) fail(`课程 ${course.id} 的章节 id 重复：${chapter.id}`);
      chapterIds.add(chapter.id);
    }

    if (course.deepLink) {
      const target = course.deepLink.split('#')[0].split('?')[0];
      if (target && !existsSync(path.join(SRC, target))) {
        fail(`课程 ${course.id} 的 deepLink 指向不存在的页面：${course.deepLink}`);
      }
    }

    const figures = FIGURES[course.id];
    if (!Array.isArray(figures) || figures.length === 0) {
      fail(`课程 ${course.id} 没有关联图解`);
    }
  }

  const libCode = await readUtf8(libraryPath);
  const rendererTypes = new Set(
    [...libCode.matchAll(/(?:R|RENDERERS)\[["']([a-z][a-z0-9-]*)["']\]\s*=/g)].map((match) => match[1]),
  );
  if (rendererTypes.size === 0) fail('未能在 diagram-lib.js 中识别图解类型注册表');

  let figureTotal = 0;
  for (const [courseId, figures] of Object.entries(FIGURES)) {
    if (!courseIds.has(courseId)) {
      fail(`FIGURES 中存在未知课程：${courseId}`);
      continue;
    }
    if (!Array.isArray(figures)) {
      fail(`FIGURES["${courseId}"] 应为数组`);
      continue;
    }

    const course = COURSES.find((item) => item.id === courseId);
    const chapterIds = new Set((course?.chapters ?? []).map((chapter) => chapter.id));
    const figureIds = new Set();

    for (const figure of figures) {
      figureTotal += 1;
      requireFields(
        figure,
        ['id', 'ch', 'title', 'type', 'caption', 'explain', 'data'],
        `课程 ${courseId} 的图解`,
      );
      if (figureIds.has(figure.id)) fail(`课程 ${courseId} 的图解 id 重复：${figure.id}`);
      figureIds.add(figure.id);
      if (!chapterIds.has(figure.ch)) {
        fail(`课程 ${courseId} 的图解 ${figure.id} 指向不存在的章节：${figure.ch}`);
      }
      if (!rendererTypes.has(figure.type)) {
        fail(`课程 ${courseId} 的图解 ${figure.id} 使用了未注册的类型：${figure.type}`);
      }
      if (typeof figure.data !== 'object' || figure.data === null || Array.isArray(figure.data)) {
        fail(`课程 ${courseId} 的图解 ${figure.id} 的 data 应为对象`);
      }
    }
  }

  pass(
    `数据模型完整：${SCHOOLS.length} 所学校 / ${COURSES.length} 门课程 / ` +
      `${figureTotal} 张图解 / ${DISCIPLINES.length} 个学科 / ${rendererTypes.size} 种图解`,
  );
}

/* ------------------------------------------------------------------ */
/* 6. package.json                                                     */
/* ------------------------------------------------------------------ */
try {
  const pkg = JSON.parse(await readUtf8(path.join(ROOT, 'package.json')));
  if (!pkg.name) fail('package.json 缺少 name');
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(String(pkg.version))) {
    fail('package.json 的 version 必须符合 SemVer');
  }
  for (const script of ['dev', 'build', 'validate', 'test', 'release:check']) {
    if (!pkg.scripts?.[script]) fail(`package.json 缺少 npm script：${script}`);
  }
  pass(`package.json 校验通过（${pkg.name}@${pkg.version}）`);
} catch (error) {
  fail(`package.json 无法解析：${error.message}`);
}

/* ------------------------------------------------------------------ */
/* 结果                                                               */
/* ------------------------------------------------------------------ */
console.log('\nOpenCourseAtlas · 仓库校验\n');
for (const message of checks) console.log(`  ✓ ${message}`);
for (const message of warnings) console.log(`  ! ${message}`);

if (errors.length) {
  console.error(`\n发现 ${errors.length} 个问题：`);
  for (const message of errors) console.error(`  ✗ ${message}`);
  process.exitCode = 1;
} else {
  console.log('\n全部校验通过。');
}

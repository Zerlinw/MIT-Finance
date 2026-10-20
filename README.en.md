# OpenCourseAtlas · Illustrated Open Courses from Leading Universities

English · [中文](README.md)

[![CI](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/ci.yml)
[![Deploy](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/deploy-pages.yml/badge.svg?branch=main)](https://github.com/Zerlinw/OpenCourseAtlas/actions/workflows/deploy-pages.yml)
[![Version](https://img.shields.io/github/package-json/v/Zerlinw/OpenCourseAtlas?label=version)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Content: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE-CONTENT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

An illustrated, diagram-first library of **open courses from QS-ranked universities**. Content is organized on three levels — **School → Discipline → Course** — and every course is presented as a **course overview + knowledge diagrams + chapter structure**. **Diagrams only; video is explicitly excluded.**

The project is a pure static site: **no runtime dependencies, no bundler, no transpilation**. Deploy it to GitHub Pages or any static host as-is.

## Features

- **Three-level content model**: schools, disciplines, and courses cross-reference one another, with filtering, search, sorting, and related-course recommendations.
- **Content separated from code**: adding a course, chapter, or diagram only means extending data files — rendering logic stays untouched.
- **14 SVG diagram types**: concept map, process, comparison, layers, pyramid, timeline, cycle, matrix, line chart, tree, scale, bar chart, Venn, and cards.
- **Structured course descriptions**: every diagram carries a guided intro, 3–5 knowledge points tagged by depth, common pitfalls, and advanced notes.
- **Interactive markers**: numbered markers overlay each diagram; click or use the keyboard to open a detail card, and share deep links with `?mark=k`.
- **3D mental models**: each course has a rotatable, zoomable 3D scene (a custom zero-dependency software renderer) that stays in sync with the diagram camera.
- **Four depth levels**: L1 Concept → L2 Mechanism → L3 Relationships & Quantification → L4 Systems & Frontier, navigable from both course and diagram pages.
- **Course-level interactive lab**: Financial Theory I ships with a compound-interest engine, Kelly-criterion calculator, self-check quiz, and action checklist (data-driven by the `lab` field).
- **Complete reading experience**: diagrams support zoom, pan, keyboard navigation, fullscreen, and reading progress.
- **Zero build dependencies**: no framework, no npm runtime dependencies; `dist/` is only a static-file collection.
- **Repository engineering conventions**: CI checks, issue/PR templates, semantic versioning, automated releases, and Pages deployment.

## Quick start

Requirements: **Node.js >= 20** (used only for local preview and validation; the site itself does not need Node).

```bash
# Start local preview (builds to dist/ automatically, default http://localhost:8899)
npm run dev

# Build the release directory only
npm run build

# Preview an existing dist/
npm run preview

# Run repository checks (page references, data model, JS syntax, required files)
npm run validate
```

> `npm install` is not needed: the project has no third-party dependencies.
> You can also run `npm run build` and serve `dist/` with any static server, e.g.
> `cd dist && python -m http.server 8899`.

## Directory structure

```text
OpenCourseAtlas/
├── .github/                     # Issue / PR templates, CODEOWNERS, CI and release workflows
├── assets/                      # Static assets
│   ├── css/
│   │   └── platform.css         # Platform theme and components (including course-level lab)
│   ├── img/
│   │   └── favicon.svg          # Site icon
│   └── js/
│       ├── data/                # Data layer: schools / disciplines / courses / figures / 3D models
│       ├── lib/                 # Diagram renderer (SVG) and 3D engine (Canvas software rendering)
│       ├── finance-lab.js       # Finance course interactive lab (loaded on demand via the lab field)
│       └── platform.js          # Page rendering and interactions
├── docs/                        # Architecture, data, content, development, collaboration, and release docs
├── scripts/                     # Zero-dependency dev scripts: build / preview / validate / release check
├── src/                         # Page sources (copied to the site root on build)
│   ├── index.html               # Home
│   ├── universities.html        # School list
│   ├── university.html          # School detail (?id=school id)
│   ├── courses.html             # Course list
│   ├── course.html              # Course detail (?id=course id)
│   ├── gallery.html             # Diagram browser (?course=course id&fig=index)
│   └── 404.html                 # Custom 404
├── .editorconfig                # Shared encoding / indentation / line endings
├── .gitattributes               # Text line-ending and binary rules
├── .gitignore                   # Ignores IDE files, dist/, dependencies, logs
├── CHANGELOG.md                 # Version history
├── CODE_OF_CONDUCT.md           # Community code of conduct
├── CONTRIBUTING.md              # Contribution guide
├── LICENSE                      # Code license (MIT)
├── LICENSE-CONTENT              # Original content license (CC BY-NC-SA 4.0)
├── README.md                    # Chinese README (default)
├── README.en.md                 # English README (this file)
├── SECURITY.md                  # Security policy
└── package.json                 # Project metadata, version, and scripts
```

> `dist/` is generated by `npm run build` and ignored by `.gitignore`; it is not committed.

## Pages

| Page | Path | Content and interactions |
| --- | --- | --- |
| Home | `index.html` | Platform stats, three-step guide, discipline entry points, editor's picks, featured lab, university showcase, latest diagrams |
| School list | `universities.html` | Keyword / discipline / country filters; school cards with QS rank, course count, and diagram count |
| School detail | `university.html?id=<school>` | School overview, courses filtered by discipline, course card grid |
| Course list | `courses.html` | School / discipline / level filters + search + sorting; filter state synced to the URL |
| Course detail | `course.html?id=<course>` | Course guide, depth progression path, 3D mental model, chapter structure, diagram list, interactive lab (lab-enabled courses), related courses |
| Diagram browser | `gallery.html?course=<id>&fig=<n>` | Zoom in / out / reset, drag to pan, keyboard navigation, fullscreen, reading progress, markers, 3D stage, depth filters, and advanced mode |

Page scripts load in a fixed order:

```text
data/catalog-data.js → data/catalog-figures.js → data/catalog-models.js
  → lib/diagram-lib.js → lib/scene3d-lib.js → platform.js
```

> Only `gallery.html` and `course.html` need the 3D scripts; other pages omit them and degrade safely through platform.js.

## Data model

```text
SCHOOLS      School   { id, name, en, short, qs, country, city, founded, color, intro }
DISCIPLINES  Discipline { id, name, icon, color }
LEVELS       Level    { id, name, desc }
COURSES      Course   { id, school, discipline, code, title, en, instructor,
                        level, levelKey, tags, source, minutes, updated,
                        overview, takeaways, prereq, chapters[],
                        audience?, deepPath?, featured?, lab? }
FIGURES      Diagrams { course id: [{ id, ch, title, type, caption, explain, data,
                                      detail?, marks? }] }
MODELS       3D       { course id: { title, camera, parts[], marks[] } }
```

Courses reference schools and disciplines through `school` / `discipline`; each diagram belongs to a chapter through `ch`. A diagram may carry a structured description `detail` (guided intro + knowledge points + pitfalls + advanced notes + 3D camera link) and interactive `marks`. Each course has one 3D mental model in `MODELS`. For field constraints, relationships, and diagram types, see the [data model](docs/data-model.md) (Chinese).

Current coverage: **10 schools, 14 courses, 93 diagrams, 280 interactive markers, 14 3D mental models, 8 disciplines, 14 diagram types**.

## Extending content

- **Add a school**: append one entry to `SCHOOLS` in `assets/js/data/catalog-data.js`.
- **Add a course**: append a course (including `chapters`) to `COURSES`, then append its diagram array to `FIGURES` in `catalog-figures.js`.
- **Add a diagram**: append one entry to the course's array and pick a registered `type`; no rendering code changes needed.
- **Enrich a diagram**: add `detail` (guided intro / knowledge points / pitfalls / advanced notes) and `marks`, and wire `detail.model` / `view` / `focus` to the 3D scene.
- **Add a 3D model**: append a scene to `MODELS` in `assets/js/data/catalog-models.js` (primitive assembly); diagrams highlight parts through `detail.focus`.
- **Add a diagram type**: register a renderer in the `R` table of `assets/js/lib/diagram-lib.js` and document its data shape in `docs/data-model.md`.

See the [content guide](docs/content-guide.md) (Chinese) for full field descriptions, naming conventions, quality standards, and the review checklist.

## Development and validation

```bash
npm run dev        # Build and start the local server
npm run validate   # Check page references, data relationships, JS syntax, and repository files
npm run build      # Generate the dist/ release directory
npm run preview    # Serve an existing dist/
```

CI runs `npm run validate` and `npm run build` on every push to `main` and every pull request. See the [development guide](docs/development.md) (Chinese) for conventions, debugging, and directory details.

## Collaboration

- **Branching**: trunk-based development; `main` is always releasable, feature branches are short-lived and merged via PRs.
- **Commit messages**: follow [Conventional Commits](https://www.conventionalcommits.org/), e.g. `feat(data): add Cambridge mathematics course`.
- **Versioning**: follow [SemVer](https://semver.org/); `package.json` is the single source of truth, and Git tags look like `v1.2.0`.
- **Release flow**: update CHANGELOG → merge the version PR → push a tag → GitHub Actions creates the release automatically.

See [CHANGELOG.md](CHANGELOG.md) for the full history.

| Document | Description |
| --- | --- |
| [Contributing](CONTRIBUTING.md) | Setup, branch naming, commit conventions, PR checklist |
| [Branch strategy](docs/branch-strategy.md) | Branch types, protection rules, merge methods, hotfixes |
| [Commit convention](docs/commit-convention.md) | Types, scopes, examples, breaking changes |
| [Versioning](docs/versioning.md) | SemVer mapping, compatibility promises, prereleases |
| [Release process](docs/release-process.md) | Releases, hotfixes, rollbacks, checklists |
| [Repository settings](docs/repository-settings.md) | Branch protection, tag protection, Pages, Actions |
| [Architecture](docs/architecture.md) | Layers, rendering pipeline, extension points, non-goals |
| [Data model](docs/data-model.md) | Fields, relationships, diagram types, validation rules |
| [Content guide](docs/content-guide.md) | Standard workflow for adding schools / courses / diagrams |
| [Development](docs/development.md) | Local development, scripts, debugging, verification |
| [Deployment](docs/deployment.md) | GitHub Pages and other static hosts |
| [Docs index](docs/README.md) | All documents and reading paths |

> The documents linked above are currently written in Chinese.

## Deployment

The recommended path is the built-in GitHub Actions workflow:

1. In **Settings → Pages → Source**, choose **GitHub Actions**.
2. Pushes to `main` make `deploy-pages.yml` validate, build, and publish `dist/` automatically.
3. For a custom domain, place a `CNAME` file at the repository root; it is copied into `dist/` during the build.

Netlify, Vercel, Cloudflare Pages, and similar platforms also work: build command `npm run build`, publish directory `dist`. See the [deployment guide](docs/deployment.md) (Chinese) for details.

## License

- **Code** (HTML structure, CSS, JavaScript, build and validation scripts): [MIT](LICENSE).
- **Original content** (documentation, diagrams, curated data): [CC BY-NC-SA 4.0](LICENSE-CONTENT).

Third-party course names, syllabi, trademarks, and textbook content remain the property of their respective owners. This project only organizes and visualizes knowledge for learning and exchange, and does not constitute investment or professional advice. If a rights holder believes any content is inappropriate, please contact us via an issue or email for removal.

## Acknowledgements

Thanks to MIT OpenCourseWare, Harvard CS50, Stanford Online, Oxford, Cambridge, ETH Zürich, NUS, and other universities whose open courses and lecture notes provide both the knowledge sources and structural references for this project.

# RevisionedPortfolioTemplate

Reusable static portfolio base for a personal site. This repository contains presentation code, build tooling, content schemas and safe placeholder data. It is not the maintained website for any individual.

## Repository roles

- **Template**: reusable source and content contract. Keep identity data, domain, certificates, uploaded assets and private writeups out of this repository.
- **Production instance**: a separately initialized repository created from this template. It owns its own content, public assets, domain, history and deployment.
- **Editor**: a local-only CMS that reads this repository for compatibility, but writes, commits and pushes only to the configured production instance.

The template is not the editor's publishing target.

## Stack

Next.js App Router with static export · React · TypeScript · Tailwind CSS · GSAP · Lenis · Markdown/JSON · Shiki · Vitest · Playwright.

## Start locally

```sh
pnpm install
pnpm dev
pnpm verify:content
pnpm build
pnpm verify:output
pnpm start
```

Development preview is available on port 3007. The static preview server serves `out/` on loopback port 3100.

## Content files

The file contract is versioned independently of the app:

| File | Purpose |
| --- | --- |
| `portfolio.repo.json` | Repository role and template contract version |
| `content/site.json` | Canonical URL, title, language and trailing-slash policy |
| `content/profile.json` | Owner identity, contact details, biography, skills, journey and SEO |
| `content/appearance.json` | Theme, typography, radius and color tokens |
| `content/projects.json` | Project cards |
| `content/achievements.json` | Achievements and evidence links |
| `content/writeups/*.md` | Markdown articles with JSON-compatible frontmatter |
| `public/assets/uploads/` | Production instance uploads; intentionally empty in this template |

The repository contains one **published example article** because Next.js static export needs at least one parameter for its dynamic article and article-image routes. Replace it or change it to a draft before deploying your production instance. Projects and achievements may start empty.

See [docs/content-contract.md](docs/content-contract.md) for field formats.

## Create a production instance

1. Create a new repository from this template (or clone it and preserve its history according to your project policy).
2. Change `portfolio.repo.json` from `role: template` to `role: production`; retain the supported `contractVersion`.
3. Set the canonical origin in `content/site.json`; configure DNS and hosting separately.
4. Replace all placeholder identity/profile data in `content/profile.json`.
5. Add a real profile image, projects, achievements and reviewed articles. Never put operational credentials or private records in public content.
6. For GitHub Pages custom domains, add `public/CNAME` only after domain ownership and Pages settings are confirmed.
7. Run `pnpm check`, `pnpm verify:content`, `pnpm build`, `pnpm verify:output` and `pnpm e2e`.
8. Configure the local editor with `PORTFOLIO_REPO_PATH` pointing at this production clone and `PORTFOLIO_TEMPLATE_PATH` pointing at the template clone.

## Static hosting

The public website is built into `out/`. Next.js Server Components execute during `next build`; visitors receive generated static HTML, assets and client-side bundles. There is no request-time Next.js server, database, admin login, API, or contact inbox in this template.

The template's GitHub Actions workflow is CI-only: it validates and builds but does not deploy. A production instance receives its own Pages deployment workflow; it does not inherit a live deployment target from the template.

## Migration policy

When migrating from an existing CMS, prefer an authorized database/export snapshot over scraping the public site. Preserve public entity metadata and media references; exclude private messages, access logs, sessions, credentials and secrets. Always preview field mappings and conflicts before writing into a production instance. The migration adapter plan currently lives in the editor repository.

## Design

The base intentionally preserves the current visual language: expressive Archivo typography, Inter Tight body copy, Geist Mono metadata, a restrained accent color, editorial layouts and motion that respects reduced-motion preferences. Instance identity and content belong in the data files, not in reusable components.

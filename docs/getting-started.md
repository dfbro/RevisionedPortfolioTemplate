# Template getting started

## Purpose

Use `RevisionedPortfolioTemplate` as the reusable starting point for a new portfolio instance. It contains presentation components, styles, scripts and contract-v1 placeholder data. It is not the active Claritys production site and it is not the editor's publishing target.

## Local preview

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3007`. For a static preview:

```sh
pnpm verify:content
pnpm build
pnpm verify:output
pnpm start
```

The static preview server binds to `127.0.0.1:3100`.

## Create a production instance

1. Create a new repository from the template or clone it into a new production directory.
2. Keep the template repository unchanged.
3. Edit `portfolio.repo.json`: set `role` to `production`, choose an `instanceName`, keep `templateName: RevisionedPortfolioTemplate`, and pin `templateContractVersion: 1`.
4. Edit `content/site.json` with the new absolute canonical site URL, title, description, language and trailing-slash policy.
5. Edit `content/profile.json` with the owner's display name, alias, brand, contact details, biography, links, skills, journey, education and SEO settings. Set `githubActivityUsername` if the GitHub contribution heatmap should use a different login from `githubUrl`.
6. Edit `content/appearance.json` to configure fonts, theme, colors and radius.
7. Replace `public/profile.svg` with a suitable profile image and update `profileImageUrl`.
8. Add projects to `content/projects.json`, achievements to `content/achievements.json`, and Markdown articles under `content/writeups/`.
9. Review the example article. It is published to satisfy Next.js static generation of dynamic article routes. Replace it or rewrite it before deployment. Keep at least one published article.
10. Run all checks before creating the production repository's first deployment workflow.

## GitHub Pages project sites

A project site such as `https://OWNER.github.io/REPOSITORY/` lives under a path prefix. The current Revisioned production site demonstrates this arrangement:
- `next.config.ts` sets `basePath: "/RevisionedPortfolio"`.
- `scripts/postprocess-pages-paths.mjs` rewrites remaining root-relative references in generated HTML/CSS.
- `pnpm build` runs that postprocessor after `next build`.

The generic template does not hard-code a repository base path or include a Pages deployment workflow. When creating a GitHub Pages project site, add the correct base-path configuration and validate every nested route, stylesheet, image, font, sitemap and robots URL before publishing. Do not copy the Revisioned path verbatim for a differently named repository.

For a user/organization site served at `https://OWNER.github.io/`, a project base path is not required. A custom domain should only be configured if the repository owner controls that domain and its DNS.

## Template versus production changes

The template CI validates and builds the starter; it never deploys Pages. Improvements to reusable components belong in this repository. Apply template upgrades to a production instance deliberately:
1. Compare the template and production source.
2. Review changes to components, styles, configuration and content readers.
3. Apply only the intended source changes.
4. Preserve production content, assets, canonical URL, base path and deployment workflow.
5. Run production tests and build before committing.

The editor checks the template/production contract version, but does not synchronize source code automatically.

## Related documentation

- [Content contract v1](content-contract.md)
- [Revisioned workspace guide](../../docs/WORKSPACE-GUIDE.md)

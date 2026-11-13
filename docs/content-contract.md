# Content contract v1

The template and local editor use a file-backed schema. JSON files are UTF-8 JSON; articles are Markdown files with YAML-style frontmatter whose scalar values are JSON literals. Keep each article filename equal to its `slug`.

For production bootstrap and deployment setup, start with [Getting started](getting-started.md).

## Repository manifest

`portfolio.repo.json` identifies the repository role:

- `schemaVersion`: manifest format version.
- `role`: `template` or `production`.
- `contractVersion`: content contract version consumed by the editor.
- `templateName` and `templateVersion`: present on the template.
- `templateContractVersion`: present on production instances to state the compatible base contract.

The editor treats the template as read-only. The configured content repository must not be marked as a template.

## Site and profile

`content/site.json` contains `schemaVersion`, `url` (absolute HTTP(S) URL), `title`, `description`, `language` and `trailingSlash`.

`content/profile.json` contains `displayName`, optional `heroNameLines`, `alias`, `brand`, nullable `email`, `websiteUrl`, `githubUrl`, optional `githubActivityUsername`, `instagramUrl`, `profileImageUrl`, `aboutText`, `philosophyText`, `skills[]`, `journey[]`, `education[]` and `seo`. `heroNameLines` is an optional array of visible line groups; all groups joined with spaces must equal `displayName`. Leave it unset to use first-name plus remainder as the default grouping. Set `githubActivityUsername` when the account used for contribution snapshots differs from the account in `githubUrl`; leave it `null` to derive the login from the GitHub profile URL.

Skills use `{name, level}`, where level is 0–100. Journey items use `{role, company, period, desc}`. Education items use `{level, school, period}`. SEO settings include job title, title/description, locale, keywords and same-as URLs.

## Collection records

Projects use:

`{id, title, description, imageUrl, projectUrl, category, tags[]}`

Achievements use:

`{id, title, issuer, platform, description, imageUrl, date, proofScore, documentUrl}`

Array order is the presentation order. Stable string IDs are required.

## Article frontmatter

Required fields:

- `slug`: lowercase words separated by hyphens; must equal the filename without `.md`.
- `title`: non-empty.
- `status`: `draft` or `published`.
- `tags`: array of strings.
- `attachments`: array of `{url, name, contentType}`.

Optional fields include `competition`, `category`, `difficulty`, `date`, `updated`, `summary`, `flag` and `source`.

A published article and every referenced asset are included in the static public output. The current static dynamic-route build requires at least one published article; the template includes a generic published example for this reason. Replace it or convert it to a draft before deploying a new instance. Treat flags, attachments, PDFs and source files as public disclosure. Visual masking in the UI is not access control.

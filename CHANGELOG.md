# Changelog

- Add an all-rights-reserved notice and UNLICENSED project metadata.
- Display reserved rights in the footer and document reuse conditions in French.

## 0.3.0 - 2026-10-30

- Display the package version in the footer, including prerendered HTML.

- Clarify the needs described in the Crin Serein case study.

- Add detailed French comments across sources, styles, configuration, and public assets.
- Add a file-by-file guide explaining application flows, dependencies, and generated files.

- Explain App composition, accessibility, prerendering, and component responsibilities in French.

- Document Windows pnpm junction permissions behind misleading Motion TypeScript errors.

- Update Vite to 8.3.5 to address development server vulnerabilities.
- Exclude private key files and local credentials, and document repository publication checks.

- Switch contact emails from Resend to Brevo with API key configuration, UUID deduplication,
  and simulated tests.
- Explain the contact request flow, deployment configuration, tests, and HTML prerendering in French.

- Remove the hero action buttons and their unused styles and press animation.
- Add PostgreSQL and Docker to the backend stack note.

- Refresh the recruitment-focused hero and stack section, and document both projects
  with STAR case studies and AI workflows.
- Improve section separation and add reduced-motion-aware interactions, including
  a 45° logo rotation and contact submission feedback.
- Enable stricter TypeScript checks and organize shared components and project/contact features.
- Prerender portfolio content and add canonical metadata, structured data, robots.txt and a sitemap.

## 0.2.0 - 2026-10-28

- Add an accessible contact form with Vercel and Resend email delivery and submission feedback.
- Keep the recipient address on the server and validate messages with honeypot checks,
  size limits, and email deduplication.
- Add simulated contact tests and document email setup and Vercel rate limiting configuration.
- Add Crin Serein to the portfolio with a local preview and updated project metadata.
- Simplify the hero by removing the personal portfolio label and project and GitHub buttons.
- Expand the about section with development experience, React, React Native, FastAPI, Hugo,
  and AI-assisted development.

## 0.1.0 - 2026-10-05

- Document the release workflow with dated changelog sections and manifest versioning.
- Add the responsive Etoiline portfolio featuring Mouv’Air, with accessible navigation,
  configurable project content, and about and contact sections.
- Add local project previews, site metadata and favicon, and document portfolio customization.
- Connect the project to the `etoiline-dev` GitHub repository and reconcile its existing
  history for subsequent pushes.
- Add a pnpm dependency lockfile alongside the npm lockfile.
- Add repository-wide agent instructions for French documentation and application checks.
- Define the validation workflow: update the changelog in English and immediately create an
  English Gitmoji commit without automatically pushing.
- Initialize the project with Vite, React, and TypeScript.
- Configure strict TypeScript checks and code linting with Oxlint.
- Add the React entry point, main component, and base styles.
- Add a starter page to verify that Vite and React work.
- Add development, build, and preview commands.
- Install dependencies and lock their versions with npm.
- Document local setup in the README.
- Exclude dependencies, build output, and local files from Git tracking.

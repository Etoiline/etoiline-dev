# Changelog

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

# Contributing to EduAi

Thank you for helping improve EduAi. Contributions can include bug fixes,
documentation, accessibility improvements, tests, and focused feature work.

## Before starting

1. Search the open issues and pull requests for existing work.
2. Open an issue before a large feature, dependency migration, or architectural
   change so maintainers and contributors can agree on scope.
3. Keep each pull request focused on one independently reviewable change.

The `moodle-backend/` directory is a vendored Moodle distribution. Avoid broad
formatting or unrelated changes there. Moodle upgrades and Moodle-specific
security fixes should be isolated from first-party application changes.

## Development setup

Follow the setup in [README.md](README.md). Copy `.env.example` to `.env` and
keep API keys, passwords, student data, audio, and other private material out of
Git. Use synthetic data in tests and screenshots.

## Checks

Before opening a pull request, run the checks relevant to your change:

```sh
npm ci --prefix frontend
npm run check --prefix frontend
python3 -m compileall -q flask_server
cp .env.example .env
docker compose config --quiet
```

If a check cannot run in your environment, explain why in the pull request and
describe the validation you did perform.

## Pull requests

- Link the issue the pull request addresses, when one exists.
- Explain the user-visible outcome and any migration or deployment impact.
- Include screenshots for interface changes.
- Add or update tests when behavior changes.
- Do not commit generated secrets, credentials, personal information, student
  records, or recordings.
- Confirm that your contribution is compatible with this repository's
  GPL-3.0 license.

Dependency updates are proposed automatically by Dependabot. Maintainers still
review release notes, compatibility, and test results before merging them.

Maintainers may ask for changes to keep the project secure, reviewable, and
consistent with its educational purpose.

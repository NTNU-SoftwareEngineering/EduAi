# Security policy

## Supported versions

EduAi does not currently publish versioned releases. Security fixes are made on
the `main` branch. Deployments should follow `main` and apply security updates
promptly.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or include real API
keys, credentials, student data, audio, or other sensitive information in a
report.

If GitHub shows a **Report a vulnerability** option on the repository Security
page, use it to send maintainers a private report. If that option is not
available, open a minimal public issue asking a maintainer to establish a
private contact channel. Do not include vulnerability details in that issue.

In the private report, include:

- the affected component and commit or version;
- reproducible steps or a minimal proof of concept;
- the possible impact;
- any suggested mitigation; and
- a safe way to contact you for follow-up.

Maintainers will acknowledge a complete report, investigate it, and coordinate
disclosure based on severity and available project capacity. Please allow time
for a fix before publishing details.

## Deployment considerations

EduAi integrates Moodle, a database, speech processing, and third-party LLM
services. Operators are responsible for replacing example credentials,
restricting network exposure, protecting API keys, obtaining appropriate data
consent, and following the security guidance of each upstream service.

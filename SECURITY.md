# Security Policy

## Architecture

This site is fully static: HTML, CSS, JavaScript and images served directly by
GitHub Pages. There is no server-side code, no database, no form backend, no
cookies and no third-party request (the typeface is embedded in the
stylesheet, not loaded from a font service). The only data stored on a
visitor's device is the light/dark theme and the language preference, kept in
the browser's localStorage on the visitor's own device.

Consequences of this architecture:

- There is no runtime that an attacker could inject server-side code into.
- Visitors can only ever read files; nothing on the site can modify the site.
- The website cannot be defaced without write access to the GitHub repository.

## Who can edit the site

Only repository collaborators with write access, or the account owner. To keep
it that way:

1. Enable two-factor authentication on the GitHub account
   (Settings → Password and authentication).
2. Protect the main branch (Settings → Branches → Add branch protection rule)
   and require a pull request before merging if more collaborators are added.
3. Review the collaborator list periodically
   (Settings → Collaborators and teams).
4. Never commit credentials, tokens or private keys. This repository should
   never contain secrets.

## Reporting a vulnerability

If you find a security issue, please report it through GitHub's private
vulnerability reporting on the Security tab of this repository, or by email
to the address listed on the site's contact page. Please do not open a public
issue for security matters.

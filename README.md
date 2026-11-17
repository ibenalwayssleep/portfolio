# Portfolio · Iben Guldbæk

Minimalist photography portfolio built as a static site and published with GitHub Pages.

Live site: `https://ibenalwayssleep.github.io/portfolio/`

## Structure

```
index.html            SPA shell: Start, About, Projects, Collections, Contact
assets/css/style.css  Japandi-inspired theme, light/dark mode, responsive layout
assets/js/data.js     Collections configuration and all text strings (DA/EN)
assets/js/app.js      Router, i18n, theme, collection rendering, lightbox
favicon.svg           Site icon
404.html              Redirect to the start page
.nojekyll             Disables Jekyll processing on GitHub Pages
.github/workflows/deploy.yml  Automatic deployment on push to main
```

## How to edit

- **Real text:** all visible strings live in `assets/js/data.js` in the `i18n`
  object (`da` and `en` keys). Replace the lorem ipsum text there.
- **Real photos:** replace the generated placeholder art in `assets/js/app.js`
  (`slotSVG`) with actual `<img>` elements pointing at files under
  `assets/photos/`. Keep the `aria-label` pattern so screen readers continue
  to announce image position and total count.
- **Collections:** the four collections are configured in `collections` in
  `assets/js/data.js`. Adjust `count` (currently 12, 9, 16, 20) when real
  image counts are known.
- **Colours and spacing:** design tokens are CSS custom properties at the top
  of `assets/css/style.css` (`--bg`, `--ink`, accents, radii).

## Deployment

The repository deploys automatically through the GitHub Actions workflow in
`.github/workflows/deploy.yml` on every push to `main`. No server, database
or build step is involved: the site is served straight from the repository.
If Pages is not yet enabled, the workflow enables it automatically
(`enablement: true`). Manual fallback: Settings → Pages → Source: deploy from
branch `main`, folder `/ (root)`.

## Security

The site is fully static. There is no backend, no database, no form submission
and no third-party request, so there is nothing to break into. Visitors can
only ever read files. Editing the site requires write access to the GitHub
repository, which is controlled entirely by the repository collaborator list.
See `SECURITY.md` for recommended account hardening (2FA, branch protection).

## Accessibility

- Semantic HTML: landmarks, one `h1` per view, list-based navigation.
- Skip link, visible focus styles, `aria-current` on the active nav item.
- All interactive art announces itself in words (image X of Y).
- Lightbox uses the native `dialog` element: focus trapping and Escape
  handling are built in.
- Theme follows the operating system preference and can be toggled; the
  choice is remembered locally.
- Danish and English interface with a language toggle; Danish is default.
- `prefers-reduced-motion` disables all reveal animations.
- Responsive from small phones to wide desktops.

Portfolio · Iben Guldbæk

Minimalist photography portfolio built as a static site and published with GitHub Pages.

Live site: https://ibenalwayssleep.github.io/portfolio/

Design: editorial Japandi. EB Garamond serif throughout (embedded in
style.css as base64, so the site makes no external requests). The colour
palette is the "Japandi Colors" reference set (#F3F0E8 #E6E4E0 #B9B99D
#E0CFC3 #D5CABA #DCB482 #C09E85 #8F837A #858480 #B0B9A8 #606C5A #5E5E5E)
with a light theme and a custom warm dark theme. Straight edges with thin
borders; no rounded corners except the small control buttons.

Structure

index.html            SPA shell: Start, About, Projects, Collections, Contact
assets/css/style.css  Theme, fonts, light/dark mode, responsive layout
assets/js/data.js     Collections configuration and all text strings (DA/EN)
assets/js/app.js      Router, i18n, theme, collection rendering, lightbox
favicon.svg           Site icon
404.html              Redirect to the start page
.nojekyll             Disables Jekyll processing on GitHub Pages

Deployment

GitHub Pages publishes directly from the main branch (Settings → Pages →
Deploy from a branch, main, / (root)). Every push to main updates the site
automatically, usually within a minute. There is no Actions workflow and no
build step: the site is served exactly as it is in the repository.

How to edit

- Real text: all visible strings live in assets/js/data.js in the i18n
  object (da and en keys). Replace the lorem ipsum text there.
- Real photos: replace the generated placeholder art in assets/js/app.js
  (slotSVG) with actual img elements pointing at files under assets/photos/.
  Keep the aria-label pattern so screen readers continue to announce image
  position and total count.
- Collections: the four collections are configured in the collections array
  in assets/js/data.js. Adjust count (currently 12, 9, 16, 20) when real
  image counts are known.
- Colours and spacing: design tokens are the CSS custom properties at the
  top of assets/css/style.css. The font files are embedded near the top of
  the same file; replacing the typeface means replacing those @font-face
  blocks.

Security

The site is fully static. There is no backend, no database, no form
submission and no third-party request, so there is nothing to break into.
Visitors can only ever read files. Editing the site requires write access to
the GitHub repository, which is controlled by the repository collaborator
list. See SECURITY.md for recommended account hardening (2FA, branch
protection).

Accessibility

- Semantic HTML: landmarks, one h1 per view, list-based navigation.
- Skip link, visible focus styles, aria-current on the active nav item.
- All interactive art announces itself in words (image X of Y).
- Lightbox uses the native dialog element: focus trapping and Escape
  handling are built in.
- Theme follows the operating system preference and can be toggled; the
  choice is remembered locally.
- Danish and English interface with a language toggle; Danish is default.
- prefers-reduced-motion disables all reveal animations.
- Responsive from small phones to wide desktops.

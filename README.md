# Toolbar Season

An interactive Internet Explorer 6 window from October 2005 (Windows XP SP2), so full of bundled toolbars that the web page barely fits.

**Live:** https://oddurs.github.io/toolbar-season/

Things to try:

- Close a toolbar with its **×**, then wait. Most of them come back.
- Drag toolbars around by their grips.
- **Tools › SpyScrub SE Scan** removes every toolbar. For a while.
- **Tools › Manage Add-ons** shows how you "agreed" to each one.
- Click an ad, punch the monkey, or say "Don't Install" to a security prompt.
- Try changing your home page in **Tools › Internet Options**.
- **File › Close**.

## Development

Svelte 5 + Vite. Requires Node 20+.

```sh
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # static build in dist/
npm run preview   # serve the build
```

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Layout

- `src/lib/toolbars.js`: every toolbar, as data. Add one here.
- `src/lib/state.svelte.js`: the one reactive state object.
- `src/lib/actions.js`: everything that changes it (navigation, installs, pop-ups, timers).
- `src/lib/pages.js` and `src/components/pages/`: the fake 2005 web.
- `src/components/dialogs/`: pop-ups and XP dialogs.

Toolbar names are parodies.

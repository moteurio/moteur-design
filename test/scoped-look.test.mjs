// Folio on a part of a page: data-look="folio" on any element gives it Folio's values whatever the
// page's look, in the page's theme unless it has a data-theme of its own. Run: pnpm test.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright-core';
import { serve } from './fixture/serve.mjs';

const CANVAS = { light: '#f5f6f8', dark: '#111418' }; // Folio's --paper
const PAPER = { light: '#f7ebd0', dark: '#1c110a' }; // Discothèque's

let server;
let browser;
before(async () => {
  server = await serve();
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  await server?.close();
});

/**
 * --paper on the page and on three parts of it (Folio, Folio forced light, Folio forced dark),
 * with the page in a look and theme and the system in a colour scheme.
 */
async function papers({ look, theme, scheme = 'light' }) {
  const page = await browser.newPage({ colorScheme: scheme });
  try {
    await page.goto(server.url);
    return await page.evaluate(
      ({ look, theme }) => {
        const root = document.documentElement;
        if (look) root.dataset.look = look;
        else delete root.dataset.look;
        if (theme) root.dataset.theme = theme;
        else delete root.dataset.theme;
        const part = (attrs) => {
          const el = document.createElement('div');
          Object.assign(el.dataset, attrs);
          document.body.append(el);
          return el;
        };
        const paper = (el) => getComputedStyle(el).getPropertyValue('--paper').trim();
        return {
          page: paper(root),
          part: paper(part({ look: 'folio' })),
          light: paper(part({ look: 'folio', theme: 'light' })),
          dark: paper(part({ look: 'folio', theme: 'dark' })),
        };
      },
      { look, theme },
    );
  } finally {
    await page.close();
  }
}

test('a Folio part of a Discothèque page follows the page’s theme, or its own', async () => {
  for (const [opts, theme] of [
    [{}, 'light'],
    [{ scheme: 'dark' }, 'dark'],
    [{ theme: 'light', scheme: 'dark' }, 'light'],
    [{ theme: 'dark' }, 'dark'],
  ]) {
    assert.deepEqual(await papers(opts), {
      page: PAPER[theme],
      part: CANVAS[theme],
      light: CANVAS.light,
      dark: CANVAS.dark,
    });
  }
});

test('a Folio part of a Folio page is just Folio', async () => {
  assert.deepEqual(await papers({ look: 'folio', theme: 'dark' }), {
    page: CANVAS.dark,
    part: CANVAS.dark,
    light: CANVAS.light,
    dark: CANVAS.dark,
  });
});

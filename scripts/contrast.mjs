// Contrast for the pairs in tokens/contrast.json, in every look and theme. build.mjs passes in
// the variables each generated stylesheet declares, so a pair is measured on exactly what a page
// gets, Folio's mapping and look variables included, not on the token JSON.

import fs from 'node:fs';

const token = (file) =>
  JSON.parse(fs.readFileSync(new URL(`../tokens/${file}`, import.meta.url), 'utf8'));

/** Each look with its theme ids and names ("Lights on"), Discothèque first. */
export const LOOKS = [
  ['discotheque', token('discotheque.json')],
  ['folio', token('folio.json')],
].map(([id, look]) => ({
  id,
  name: look.name,
  themes: look.color.themes.map((t) => t.id),
  themeName: Object.fromEntries(look.color.themes.map((t) => [t.id, t.name])),
}));

/**
 * The variables in force for one look and theme, cascaded the way looks.css applies them:
 * Discothèque's :root first, its dark block over it, then Folio's blocks, which only apply under
 * data-look="folio" and win there. declared[look][theme] holds what that look's file sets for that
 * theme; its light entry also holds the values that don't change with the theme.
 */
export function variablesIn(declared, look, theme) {
  const layers = [declared.discotheque.light];
  if (theme === 'dark') layers.push(declared.discotheque.dark);
  if (look === 'folio') {
    layers.push(declared.folio.light);
    if (theme === 'dark') layers.push(declared.folio.dark);
  }
  return Object.assign({}, ...layers);
}

/** Replaces var(--x) and var(--x, fallback) until none are left. */
export function resolve(vars, value, seen = []) {
  const start = value.indexOf('var(');
  if (start < 0) return value;
  // Find the closing bracket by counting, since a fallback can hold brackets of its own.
  let depth = 0;
  let end = start + 3;
  for (; end < value.length; end++) {
    if (value[end] === '(') depth++;
    else if (value[end] === ')' && --depth === 0) break;
  }
  const inner = value.slice(start + 4, end);
  const comma = inner.indexOf(',');
  const name = (comma < 0 ? inner : inner.slice(0, comma)).trim().replace(/^--/, '');
  const fallback = comma < 0 ? undefined : inner.slice(comma + 1).trim();
  if (seen.includes(name)) throw new Error(`--${name} refers to itself`);
  let got;
  if (name in vars) got = resolve(vars, vars[name], [...seen, name]);
  else if (fallback !== undefined) got = resolve(vars, fallback, seen);
  else throw new Error(`--${name} is not set`);
  return resolve(vars, value.slice(0, start) + got + value.slice(end + 1), seen);
}

/** A colour as [r, g, b, alpha], channels 0 to 255. Hex and rgb()/rgba() are all the tokens use. */
function parseColor(text) {
  const t = text.trim().toLowerCase();
  if (t === 'transparent') return [0, 0, 0, 0];
  const hex = t.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const rgb = t.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const [r, g, b, a = '1'] = rgb[1].split(/[\s,/]+/).filter(Boolean);
    return [+r, +g, +b, a.endsWith('%') ? parseFloat(a) / 100 : +a];
  }
  throw new Error(`Can't measure the colour "${text}"`);
}

const luminance = ([r, g, b]) => {
  const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

/** WCAG contrast of fg on bg. A see-through fg is laid over bg first, as a browser paints it. */
export function ratio(fgText, bgText) {
  const bg = parseColor(bgText);
  if (bg[3] < 1) throw new Error(`A background must be opaque: "${bgText}"`);
  const fg = parseColor(fgText);
  const over = fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]));
  const [hi, lo] = [luminance(over), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/** Rounded down, so a ratio shown as 4.5 is never really 4.49. */
export const shown = (r) => (Math.floor(r * 10) / 10).toFixed(1);

/** Every pair measured in every look and theme it applies to. */
export function measure(declared, pairs) {
  const rows = [];
  for (const pair of pairs)
    for (const look of LOOKS) {
      if (pair.looks && !pair.looks.includes(look.id)) continue;
      for (const theme of look.themes) {
        const vars = variablesIn(declared, look.id, theme);
        const value = (name) => resolve(vars, `var(--${name})`);
        const bg = value(pair.bg);
        // A mark drawn in several colours reads as well as its clearest one.
        const best = [pair.fg]
          .flat()
          .map((name) => ({ fg: value(name), ratio: ratio(value(name), bg) }))
          .sort((a, b) => b.ratio - a.ratio)[0];
        rows.push({ pair, look, theme, bg, ...best });
      }
    }
  return rows;
}

const names = (fg) =>
  [fg]
    .flat()
    .map((n) => `--${n}`)
    .join(' or ');

const table = (head, rows) => {
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (cells) => `| ${cells.map((c, i) => String(c).padEnd(widths[i])).join(' | ')} |`;
  return [line(head), line(widths.map((w) => '-'.repeat(w))), ...rows.map(line)].join('\n');
};

/** The failures, as a table for the terminal. Empty when every pair passes. */
export function failures(declared, pairs) {
  const failed = measure(declared, pairs).filter((r) => r.ratio < r.pair.min);
  if (!failed.length) return '';
  return table(
    ['Look', 'Theme', 'Text or mark', 'On', 'Values', 'Ratio', 'Needs', 'For'],
    failed.map((r) => [
      r.look.name,
      r.look.themeName[r.theme],
      names(r.pair.fg),
      `--${r.pair.bg}`,
      `${r.fg} on ${r.bg}`,
      shown(r.ratio),
      r.pair.min,
      r.pair.for,
    ]),
  );
}

/** Light then dark ratios per look, for the tables in docs/foundations.md. */
function byLook(declared, pair) {
  const rows = measure(declared, [pair]);
  return LOOKS.map((look) => {
    const mine = rows.filter((r) => r.look.id === look.id);
    return mine.length ? mine.map((r) => shown(r.ratio)).join(' / ') : 'n/a';
  });
}

/** The two tables in docs/foundations.md: pairs that pass and pairs to avoid. */
export function docTables(declared, list) {
  const code = (fg) =>
    [fg]
      .flat()
      .map((n) => `\`--${n}\``)
      .join(' or ');
  const safe = table(
    ['Text or mark', 'On', 'Needs', ...LOOKS.map((l) => l.name), 'Safe for'],
    list.pairs.map((p) => [code(p.fg), code(p.bg), `${p.min}:1`, ...byLook(declared, p), p.for]),
  );
  const avoid = table(
    ['Text or mark', 'On', ...LOOKS.map((l) => l.name), 'Why'],
    list.avoid.map((p) => [code(p.fg), code(p.bg), ...byLook(declared, p), p.why]),
  );
  return { safe, avoid };
}

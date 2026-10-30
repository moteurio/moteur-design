// The shared stylelint config for CSS written on @moteurio/design. Extend it:
//
//   export default { extends: ['@moteurio/design/stylelint'] };
//
// It turns on nothing about style or formatting, only the rules that keep colour and motion on
// the tokens. Colour values belong in token files; an app that keeps its own turns these rules off
// for those files with an override (see the README).
import plugins from './plugin.js';

const colour = 'Use a colour variable from @moteurio/design, such as var(--ink) or var(--paper)';

export default {
  plugins,
  rules: {
    // Raw colours: hex, named and colour functions. transparent and currentColor aren't flagged.
    'color-no-hex': [true, { message: `Raw hex colour: ${colour.toLowerCase()}` }],
    'color-named': ['never', { message: `Named colour: ${colour.toLowerCase()}` }],
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color'],
      { message: (fn) => `Raw colour ${fn}(…): ${colour.toLowerCase()}` },
    ],
    'moteur/motion-tokens': true,
    'moteur/no-motion-kill': true,
    'moteur/keyframes-travel': true,
  },
};

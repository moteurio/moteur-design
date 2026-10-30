// Three rules for CSS written on @moteurio/design, so motion keeps to docs/motion.md:
//
// - moteur/motion-tokens: transition and animation take their durations and curves from the
//   tokens. A raw "300ms" or "cubic-bezier(…)" is a value the looks and reduced motion can't reach.
// - moteur/no-motion-kill: no "animation-duration: 0.01ms" or "animation: none" for reduced
//   motion. Ending animations at once fires timers at once and closes toasts before anyone sees
//   them; moments.css reduces motion with --travel, --loop and --motion-cap instead.
// - moteur/keyframes-travel: keyframes that move something multiply the move by --travel, which
//   is 0 under reduced motion, so the same keyframes just fade.
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint;

const MOTION_PROPS = /^(transition|animation)(-duration|-delay|-timing-function)?$/i;
// A time: 120ms, .3s, 1.5s. The lookbehind keeps it from matching inside names like "x2s".
const TIME = /(?<![\w.-])(\d*\.?\d+)(ms|s)\b/gi;
const ms = (n, unit) => (unit.toLowerCase() === 's' ? n * 1000 : n);

/** The value with every var(…) taken out, fallbacks included, since those come from tokens. */
function withoutVars(value) {
  let out = '';
  for (let i = 0; i < value.length;) {
    if (value.slice(i, i + 4).toLowerCase() !== 'var(') {
      out += value[i++];
      continue;
    }
    let depth = 0;
    for (; i < value.length; i++) {
      if (value[i] === '(') depth++;
      else if (value[i] === ')' && --depth === 0) break;
    }
    out += 'var';
    i++;
  }
  return out;
}

const motionTokens = 'moteur/motion-tokens';
const motionTokensMessages = ruleMessages(motionTokens, {
  time: (t) =>
    `Raw duration "${t}": use a token, such as var(--duration-pop) or var(--spring-pop-duration)`,
  curve: (c) => `Raw curve "${c}(…)": use a token, such as var(--ease-glide) or var(--spring-pop)`,
});

const motionTokensRule = (on) => (root, result) => {
  if (!on) return;
  root.walkDecls(MOTION_PROPS, (decl) => {
    const value = withoutVars(decl.value);
    if (/^\s*inherit\s*$/i.test(value)) return;
    for (const [t, n, unit] of value.matchAll(TIME))
      if (ms(+n, unit) !== 0)
        report({
          result,
          ruleName: motionTokens,
          node: decl,
          word: t,
          message: motionTokensMessages.time(t),
        });
    for (const [, fn] of value.matchAll(/\b(cubic-bezier|linear)\(/gi))
      report({
        result,
        ruleName: motionTokens,
        node: decl,
        word: fn,
        message: motionTokensMessages.curve(fn),
      });
  });
};

const noMotionKill = 'moteur/no-motion-kill';
const noMotionKillMessages = ruleMessages(noMotionKill, {
  tiny: (t) =>
    `"${t}" ends the motion at once, timers and toasts included: reduce it with var(--travel), var(--loop) and var(--motion-cap)`,
  skip: (prop) =>
    `"${prop}: none" for reduced motion skips the moment: reduce it with var(--travel), var(--loop) and var(--motion-cap)`,
  important: (prop) =>
    `"${prop} … !important" for reduced motion overrides every moment: reduce it with var(--travel), var(--loop) and var(--motion-cap)`,
});

/** Inside @media (prefers-reduced-motion: reduce), or a rule for data-motion="reduce". */
function forReducedMotion(node) {
  for (let n = node.parent; n; n = n.parent) {
    if (n.type === 'atrule' && /prefers-reduced-motion\s*:\s*reduce/i.test(n.params)) return true;
    if (n.type === 'rule' && /data-motion=['"]?reduce/i.test(n.selector)) return true;
  }
  return false;
}

const noMotionKillRule = (on) => (root, result) => {
  if (!on) return;
  root.walkDecls(/^(transition|animation)/i, (decl) => {
    // Anything above zero and under 10ms is there to end the motion, not to time it. Fallbacks
    // count too: var(--x, 0.01ms) is the same trick.
    for (const [t, n, unit] of decl.value.matchAll(TIME)) {
      const v = ms(+n, unit);
      if (v > 0 && v < 10)
        report({
          result,
          ruleName: noMotionKill,
          node: decl,
          word: t,
          message: noMotionKillMessages.tiny(t),
        });
    }
    if (!forReducedMotion(decl)) return;
    if (
      /^(animation|animation-name|transition|transition-property)$/i.test(decl.prop) &&
      /^\s*none\s*$/i.test(decl.value)
    )
      report({
        result,
        ruleName: noMotionKill,
        node: decl,
        message: noMotionKillMessages.skip(decl.prop),
      });
    else if (decl.important)
      report({
        result,
        ruleName: noMotionKill,
        node: decl,
        message: noMotionKillMessages.important(decl.prop),
      });
  });
};

const keyframesTravel = 'moteur/keyframes-travel';
const keyframesTravelMessages = ruleMessages(keyframesTravel, {
  moves: (name, props) =>
    `@keyframes ${name} moves (${props}) without --travel: multiply the distance, scale or turn by it, as in translate: 0 calc(16px * var(--travel))`,
});

// Values that move nothing, so they need no --travel: an identity, or a reset.
const STILL =
  /^(none|0|0px|0deg|0turn|1|1 1|0 0|0px 0px|translate\(0(px)?(, ?0(px)?)?\)|scale\(1\)|rotate\(0(deg|turn)?\))$/i;

// Reported once per @keyframes, on its first line, so one comment above it can explain an
// exception (a timer bar, a line drawing itself) for the whole animation.
const keyframesTravelRule = (on) => (root, result) => {
  if (!on) return;
  root.walkAtRules(/^(-webkit-)?keyframes$/i, (keyframes) => {
    const moving = new Set();
    keyframes.walkDecls(/^(transform|translate|scale|rotate)$/i, (decl) => {
      const value = decl.value.trim();
      if (STILL.test(value) || /calc\([^;]*var\(\s*--travel\s*\)/i.test(value)) return;
      moving.add(decl.prop);
    });
    if (moving.size)
      report({
        result,
        ruleName: keyframesTravel,
        node: keyframes,
        word: keyframes.params,
        message: keyframesTravelMessages.moves(keyframes.params, [...moving].join(', ')),
      });
  });
};

const rule = (name, fn, messages) => {
  fn.ruleName = name;
  fn.messages = messages;
  return createPlugin(name, fn);
};

export default [
  rule(motionTokens, motionTokensRule, motionTokensMessages),
  rule(noMotionKill, noMotionKillRule, noMotionKillMessages),
  rule(keyframesTravel, keyframesTravelRule, keyframesTravelMessages),
];

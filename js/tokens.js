// Generated from tokens/*.json by scripts/build.mjs. Do not edit.
/** Discothèque durations, in ms. */
export const duration = {
  snap: 120,
  pop: 320,
  glide: 360,
  drift: 600,
};

/** Discothèque cubic-bezier curves. */
export const easing = {
  spring: [0.3, 1.6, 0.5, 1],
  glide: [0.2, 0.9, 0.3, 1],
  drift: [0.45, 0, 0.55, 1],
  shake: [0.36, 0.07, 0.19, 0.97],
};

/** Discothèque's themes. */
export const themes = [
  {
    id: 'light',
    name: 'Lights on',
  },
  {
    id: 'dark',
    name: 'Lights off',
  },
];

/** Springs and the pen, per look: duration in ms and a CSS easing (springs as linear()). */
export const motion = {
  discotheque: {
    pop: {
      stiffness: 400,
      damping: 22,
      duration: 550,
      easing:
        'linear(0, 0.063, 0.195, 0.363, 0.538, 0.701, 0.841, 0.952, 1.031, 1.083, 1.11, 1.118, 1.112, 1.097, 1.078, 1.057, 1.038, 1.021, 1.007, 0.997, 0.991, 0.987, 0.986, 0.987, 0.988, 0.991, 0.993, 0.995, 0.997, 0.999, 1, 1.001, 1.001, 1)',
    },
    settle: {
      stiffness: 420,
      damping: 20,
      duration: 650,
      easing:
        'linear(0, 0.066, 0.208, 0.389, 0.579, 0.756, 0.906, 1.021, 1.101, 1.146, 1.164, 1.159, 1.14, 1.112, 1.081, 1.051, 1.024, 1.003, 0.988, 0.978, 0.974, 0.973, 0.976, 0.98, 0.985, 0.99, 0.994, 0.998, 1.001, 1.003, 1.004, 1.004, 1.004, 1.004, 1.003, 1.002, 1.001, 1, 1, 1)',
    },
    pen: {
      duration: 340,
      easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
  folio: {
    pop: {
      stiffness: 380,
      damping: 36,
      duration: 417,
      easing:
        'linear(0, 0.056, 0.164, 0.29, 0.415, 0.529, 0.628, 0.71, 0.778, 0.831, 0.873, 0.906, 0.931, 0.949, 0.963, 0.974, 0.981, 0.987, 0.991, 0.994, 0.996, 0.997, 0.998, 0.999, 0.999, 1)',
    },
    settle: {
      stiffness: 520,
      damping: 42,
      duration: 367,
      easing:
        'linear(0, 0.075, 0.211, 0.36, 0.499, 0.618, 0.715, 0.791, 0.85, 0.893, 0.925, 0.948, 0.964, 0.976, 0.984, 0.989, 0.993, 0.995, 0.997, 0.998, 0.999, 0.999, 1)',
    },
    pen: {
      duration: 420,
      easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
};

/** Folio's motion: tweens only, no overshoot. */
export const folioMotion = {
  duration: {
    fast: 100,
    base: 150,
    slow: 250,
    ambient: 400,
  },
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
};

/** Every look, with its themes. The first is the default. */
export const looks = [
  {
    id: 'discotheque',
    name: 'Discothèque',
    themes: [
      {
        id: 'light',
        name: 'Lights on',
      },
      {
        id: 'dark',
        name: 'Lights off',
      },
    ],
  },
  {
    id: 'folio',
    name: 'Folio',
    themes: [
      {
        id: 'light',
        name: 'Light',
      },
      {
        id: 'dark',
        name: 'Dark',
      },
    ],
  },
];

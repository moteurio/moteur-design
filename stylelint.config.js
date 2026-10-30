// The package lints its own hand-written CSS with the config it ships. The generated files
// (css/discotheque.css, css/folio.css) are the token files, so they aren't linted.
export default { extends: ['./stylelint/index.js'] };

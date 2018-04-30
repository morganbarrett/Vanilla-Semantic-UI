/*******************************
             Vanilla-Semantic-UI-Docs
*******************************/

/* Paths used for "serve-Vanilla-Semantic-UI-Docs" and "build-Vanilla-Semantic-UI-Docs" tasks */
module.exports = {
  base: '',
  globs: {
    eco: '**/*.html.eco'
  },
  paths: {
    clean: '../Vanilla-Semantic-UI-Docs/out/dist/',
    source: {
      config      : 'src/theme.config',
      definitions : 'src/definitions/',
      site        : 'src/site/',
      themes      : 'src/themes/'
    },
    output: {
      examples     : '../Vanilla-Semantic-UI-Docs/out/examples/',
      less         : '../Vanilla-Semantic-UI-Docs/out/src/',
      metadata     : '../Vanilla-Semantic-UI-Docs/out/',
      packaged     : '../Vanilla-Semantic-UI-Docs/out/dist/',
      uncompressed : '../Vanilla-Semantic-UI-Docs/out/dist/components/',
      compressed   : '../Vanilla-Semantic-UI-Docs/out/dist/components/',
      themes       : '../Vanilla-Semantic-UI-Docs/out/dist/themes/'
    },
    template: {
      eco: '../Vanilla-Semantic-UI-Docs/server/documents/'
    },
  }
};

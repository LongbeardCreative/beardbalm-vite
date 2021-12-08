const cssnano = require('cssnano');

module.exports = {
  plugins: [
    cssnano({
      preset: 'advanced',
    }),
  ],
};

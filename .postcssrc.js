const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    postcssFlexbugsFixes,
    postcssPresetEnv({
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    }),
  ],
};

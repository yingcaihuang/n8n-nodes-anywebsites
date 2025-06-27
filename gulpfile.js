const { src, dest } = require('gulp');

function buildIcons() {
  return src('nodes/**/*.{png,svg}', { base: '.' })
    .pipe(dest('dist/'));
}

exports['build:icons'] = buildIcons;
exports.default = buildIcons;

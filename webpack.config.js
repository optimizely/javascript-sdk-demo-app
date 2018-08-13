const path = require('path');

const DIST_DIR = path.join(__dirname, '/dist');
const CLIENT_DIR = path.join(__dirname, '/src');

module.exports = {
  context: CLIENT_DIR,

  entry: './js/index',

  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  target: 'web',
};

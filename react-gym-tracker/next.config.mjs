const withTM = require('next-transpile-modules')(['react-calendar', 'react-dropdown']);

module.exports = withTM({
  output: 'export',
  distDir: './dist',
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
      ],
      include: /node_modules/,
    });

    return config;
  },
});
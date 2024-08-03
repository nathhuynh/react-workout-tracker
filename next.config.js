const withTM = require('next-transpile-modules')(['react-calendar', 'react-dropdown', 'react-select']);

module.exports = withTM({
  output: 'export',
  distDir: './dist',
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: false,
          },
        },
        'postcss-loader',
      ],
      include: [
        /node_modules/,
        /styles/,
      ],
    });

    return config;
  },
});
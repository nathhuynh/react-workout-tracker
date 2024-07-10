import withTM from 'next-transpile-modules';

export default withTM({
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
})(['react-calendar', 'react-dropdown', 'react-select']);

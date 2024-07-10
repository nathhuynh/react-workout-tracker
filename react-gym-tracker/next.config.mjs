import withTM from 'next-transpile-modules';

const withTranspileModules = withTM(['react-calendar', 'react-dropdown']);

export default withTranspileModules({
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
      include: /node_modules/,
    });

    return config;
  },
});
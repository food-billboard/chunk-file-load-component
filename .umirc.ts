import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'chunk-file-load-component',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirector: 'es',
        style: true,
      },
    ],
  ],
  history: { type: 'hash' },
  publicPath: './',
  dynamicImport: {},
  exportStatic: {},
  proxy: {
    '/api': {
      target: 'http://localhost:4000/',
      changeOrigin: true,
    },
  },
  // more config: https://d.umijs.org/config
});

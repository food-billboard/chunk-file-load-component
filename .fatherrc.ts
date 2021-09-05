const type = process.env.BUILD_TYPE;

let config = {};

if (type === 'lib') {
  config = {
    extractCSS: true,
    esm: false,
    cjs: 'babel',
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        {
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: false,
        },
        'antd',
      ],
      [
        'babel-plugin-import',
        {
          libraryName: 'lodash',
          libraryDirectory: '',
          camel2DashComponentName: false, // default: true
        },
        'lodash',
      ],
    ],
  };
} else {
  config = {
    extractCSS: true,
    esm: 'babel',
    cjs: false,
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: false,
        },
        'antd',
      ],
      [
        'babel-plugin-import',
        {
          libraryName: 'lodash',
          libraryDirectory: '',
          camel2DashComponentName: false, // default: true
        },
        'lodash',
      ],
    ],
  };
}

export default config;

const type = process.env.BUILD_TYPE;

let config = {};

if (type === 'lib') {
  config = {
    extractCSS: true,
    esm: false,
    cjs: 'babel',
    lessInBabelMode: true,
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        {
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: true,
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
    esm: {
      type: 'babel',
      importLibToEs: true,
    },
    lessInBabelMode: true,
    cjs: false,
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
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

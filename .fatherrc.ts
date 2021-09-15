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
      [
        'babel-plugin-import',
        {
          libraryName: '@ant-design/icons',
          libraryDirectory: 'lib',
          style: true,
        },
        '@ant-design/icons',
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
      [
        'babel-plugin-import',
        {
          libraryName: '@ant-design/icons',
          libraryDirectory: 'es',
          style: true,
        },
        '@ant-design/icons',
      ],
    ],
  };
}

export default config;

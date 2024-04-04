// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import routes from './routes';
// @ts-ignore
import NpmImportPlugin from 'less-plugin-npm-import';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: false,
  mfsu: false,
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    baseSeparator: '-',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  styles: [
    {
      src: '//at.alicdn.com/t/c/font_4037533_z48em7x4j4.css',
    },
  ],
  request: {
    dataField: 'data',
  },
  mock:{} ,
  define: {
    REACT_APP_ENV: process.env.REACT_APP_ENV,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  npmClient: 'pnpm',
  model: {},
  initialState: {},
  // access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'default',
  },
  title: 'InsightMon',
  ignoreMomentLocale: true,
  proxy: proxy[(REACT_APP_ENV || 'dev') as keyof typeof proxy],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: true,
  plugins: ['@umijs/max-plugin-openapi'],
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'http://app.insightmontest.com/doc/api',
      mock: true,
      projectName: 'insightMon',
    },
  ],
  // nodeModulesTransform: {
  //   type: 'none',
  // },
  lessLoader: {
    javascriptEnabled: true,
    math: 'always',
    // plugins: [new NpmImportPlugin({ prefix: '~' })],
  },
  // exportStatic: {},
  extraBabelPlugins: ['babel-plugin-styled-components'],
  esbuildMinifyIIFE: true,
});

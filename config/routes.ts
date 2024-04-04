export default [
  {
    path: '/user',
    hideInNavMenu: true,
    routes: [
      {
        path: '/user/login',
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    name: '概览',
    path: '/overview',
    icon: 'HomeOutlined',
    component: './overview/index',
  },
  {
    name: '冲煮记录',
    path: '/brew',
    icon: 'AreaChartOutlined',
    hideChildrenInNavMenu: true,
    routes: [
      {
        path: '/brew',
        component: './brew/index',
      },
      {
        path: '/brew/:id',
        hideInNavMenu: true,
        component: './brew/brewDetails',
      },
      {
        component: '404',
      }
    ],
  },
  {
    name: '冲煮分析',
    path: '/analysis',
    icon: 'BarChartOutlined',
    component: './analysis/index',
  },
  {
    name: 'account',
    icon: 'UserOutlined',
    path: '/account',
    hideInNavMenu: true,
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: 'center',
        path: '/account/center',
        component: './account/center',
      },
      {
        name: 'settings',
        path: '/account/settings',
        component: './account/settings',
      },
      {
        name: '用量统计',
        path: '/account/usage-info',
        component: './account/usage-info',
      },
    ],
  },
  {
    path: '/',
    redirect: '/overview/index',
  },
  {
    component: '404',
  },
];

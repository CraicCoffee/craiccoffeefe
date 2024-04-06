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
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register', // 确保组件名正确
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result', // 确保组件名正确
      },
      {
        path: '/user',
        exact: true,
        redirect: '/user/login',
      },
      {
        component: '404',
      },
    ],
  },
  {
    name: '概览',
    path: '/overview/index',
    icon: 'HomeOutlined',
    component: './overview/index',
  },

  {
    // 出品星球相关页面
    name: '出品星球',
    icon: 'RocketOutlined',
    path: '/product-planet',
    routes: [
      {
        path: '/product-planet',
        exact: true,
        component: './product-planet/index', // 假设有一个出品星球的总览页面组件
      },
      {
        name: '冲煮记录',
        icon: 'AreaChartOutlined',
        path: '/product-planet/brew',
        hideChildrenInNavMenu: true,
        routes: [
          {
            path: '/product-planet/brew',
            exact: true,
            component: './product-planet/brew/index',
          },
          {
            path: '/product-planet/brew/:id',
            component: './product-planet/brew/brewDetails',
          },
          // {
          //   component: './product-planet/brew/404',
          // },
        ],
      },
      {
        name: '冲煮分析',
        icon: 'BarChartOutlined',
        path: '/product-planet/analysis',
        component: './product-planet/analysis/index',
      },
      {
        name: '出品社区',
        icon: 'TeamOutlined',
        path: '/product-planet/community',
        // component: './product-planet/community/index',
        component: './overview/index',

      },
    ],
  },
  {
    // 寻豆星球页面
    name: '寻豆星球',
    icon: 'SearchOutlined',
    path: '/bean-planet',
    component: './overview/index',
  },
  {
    // 品鉴星球相关页面
    name: '品鉴星球',
    icon: 'CoffeeOutlined',
    path: '/sensory-planet',
    routes: [
      {
        path: '/sensory-planet',
        redirect: './overview/index',
      },
      {
        name: '杯测大陆',
        icon: 'SafetyCertificateOutlined',
        path: '/sensory-planet/cupping-land',
        component: './overview/index',
      },
      {
        name: '活动社区',
        icon: 'BulbOutlined',
        path: '/sensory-planet/events',
        component: './overview/index',
      },
    ],
  },
  {
    // 锅炉星球相关页面
    name: '锅炉星球',
    icon: 'FireOutlined',
    path: '/roaster-planet',
    routes: [
      {
        name: '烘焙曲线管理',
        icon: 'LineChartOutlined',
        path: '/roaster-planet/roast-curve',
        component: './overview/index',
      },
      {
        name: '烘焙设备管理',
        icon: 'ToolOutlined',
        path: '/roaster-planet/equipment',
        component: './overview/index',
      },
      {
        name: '生豆库存管理',
        icon: 'DatabaseOutlined',
        path: '/roaster-planet/bean-stock',
        component: './overview/index',
      },
    ],
  },
  {
    // 炼金星球页面
    name: '炼金星球',
    icon: 'ExperimentOutlined',
    path: '/alchemy-planet',
    component: './overview/index',
  },
  {
    // PVP专场相关页面
    name: 'PVP专场',
    icon: 'TrophyOutlined',
    path: '/pvp-arena',
    routes: [
      {
        name: '公开赛',
        icon: 'FlagOutlined',
        path: '/pvp-arena/open-competition',
        component: './overview/index',
      },
      {
        name: '等级赛',
        icon: 'DashboardOutlined',
        path: '/pvp-arena/ranked-match',
        component: './overview/index',
      },
    ],
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

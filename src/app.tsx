import '@/global.less';
import { dataflowProvider } from '@@/plugin-model/runtime';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { HoxRoot } from 'hox';
import type { ReactElement } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';
import { currentUser as queryCurrentUser } from '@/services/craicCoffee/authController';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';


export const request: RequestConfig = {
  responseInterceptors: [
    (response) => {
      if (response.status === 403) {
        message.warn('当前登录已超时，请您重新登录');
        history.push(loginPath);
      }
      return response;
    },
  ],
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg?.data;
    } catch (error) {
      // 处理错误，例如通过设置状态或者记录日志
    }
    return undefined;
  };

  // 公开页面的路径列表
  const publicPaths = ['/user/login', '/user/register'];

  // 获取当前路径
  const currentPath = history.location.pathname;

  // 如果当前路径不在公开页面列表中，尝试获取用户信息
  if (!publicPaths.includes(currentPath)) {
    const currentUser = await fetchUserInfo();
    if (!currentUser) {
      // 如果没有获取到用户信息，且当前页面不是公开页面，重定向到登录页面
      history.push('/user/login');
      return { loading: false }; // 重定向后可以提早返回，不需要设置其他状态
    }

    // 返回获取到的用户信息
    return {
      fetchUserInfo,
      currentUser,
      loading: false,
    };
  }

  // 如果是公开页面，只需返回 fetchUserInfo 函数
  return {
    fetchUserInfo,
    loading: false,
  };
}

const ContentInner = styled.div`
  //padding-bottom: 40px;
`;

export function rootContainer(container: ReactElement) {
  const isTestDomain = window.location.hostname?.endsWith('insightmontest.com');
  const icp = isTestDomain ? '粤ICP备2023008093号-2' : '粤ICP备2023008093号-1';
  const beian = isTestDomain ? '44030502010142' : '44030502009954';

  return (
    // TODO: 后面需要有一个地方统一控制各种国际化切换，例如 moment、antd 组件、i18next
    <ConfigProvider locale={zhCN}>
      {dataflowProvider(
        <HoxRoot>
          <Layout>
            <Layout.Content style={{ position: 'relative' }}>
              <ContentInner>{container}</ContentInner>
            </Layout.Content>
          </Layout>
        </HoxRoot>,
        {},
      )}
    </ConfigProvider>
  );
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
//   return {
//     },
//     menuHeaderRender: undefined,
//     // 自定义 403 页面
//     // unAccessible: <div>unAccessible</div>,
//     // 增加一个 loading 的状态
//     childrenRender: (children, props) => {
//       // if (initialState?.loading) return <PageLoading />;
//       return <>{children}</>;
//     },
//     ...initialState?.settings,
//   };
// };

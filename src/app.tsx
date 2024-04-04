import '@/global.less';
import { dataflowProvider } from '@@/plugin-model/runtime';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { HoxRoot } from 'hox';
import type { FC } from 'react';
import { useLayoutEffect, useState } from 'react';
import type { ReactElement } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';
import MenuExtra from './components/MenuExtra';
import { NavMenu } from './components/nav-menu';
import { currentUser as queryCurrentUser } from './services/insightMon/authController';

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
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  // if (history.location.pathname !== loginPath) {
  //   const currentUser = await fetchUserInfo();
  //   return {
  //     fetchUserInfo,
  //     currentUser,
  //   };
  // }
  return {
    fetchUserInfo,
  };
}

const ScrollPart = styled.div`
  overflow-y: auto;
`;

const SideContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  > * {
    flex: none;
  }
  > ${ScrollPart} {
    flex: auto;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  > span {
    display: block;
    margin-left: 8px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }
`;

const ContentInner = styled.div`
  padding-bottom: 40px;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #d0d4d7;
  a {
    color: inherit;
  }
`;

const Sider: FC = () => {
  const [visible, setVisible] = useState(history.location.pathname !== loginPath);
  useLayoutEffect(() => {
    const unlisten = history.listen(({ location }) => {
      setVisible(location.pathname !== loginPath);
    });
    return () => {
      unlisten();
    };
  }, []);
  if (!visible) return null;
  return (
    <Layout.Sider
      trigger={null}
      className="side-nav side-nav-dark"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <SideContainer>
        <Logo>
          <img src="/logo-with-name-white.svg" height="36px" />
        </Logo>
        <ScrollPart>
          <NavMenu />
        </ScrollPart>
        <MenuExtra />
      </SideContainer>
    </Layout.Sider>
  );
};

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
            <Sider />
            <Layout.Content style={{ position: 'relative' }}>
              <ContentInner>{container}</ContentInner>
              <Footer>
                <a
                  target="_blank"
                  href={`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${beian}`}
                  rel="noopener noreferrer"
                >
                  粤公网安备{beian}号 &nbsp; &nbsp;
                </a>
                <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
                  {icp}
                </a>
              </Footer>
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

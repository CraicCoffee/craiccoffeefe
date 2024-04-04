import { Link, useLocation, useMatch } from '@umijs/max';
import { Breadcrumb, PageHeader, Tabs } from 'antd';
import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { matchRoutes } from 'react-router-dom';
import styled from 'styled-components';
import routes from '../../config/routes';
import { Lazy } from './lazy';
import {HomeOutlined} from "@ant-design/icons";
import { useContext } from 'react';
import {PageTabsContext} from "@/components/PageContainerContext";

type RouteNode = {
  path?: string;
  name: string;
  parent?: RouteNode;
};

const routeRecord: Record<string, RouteNode> = {};

function traverse(currentRoutes: any, parent?: RouteNode) {
  for (const route of currentRoutes) {
    let routeNode: RouteNode | undefined = undefined;
    if (route.name) {
      routeNode = {
        path: route.path,
        name: route.name,
        parent,
      };
      routeRecord[route.path] = routeNode;
    }
    if (route.routes) {
      traverse(route.routes, routeNode);
    }
  }
}
traverse(routes);

const Container = styled.div<{ width?: string }>`
  height: 100%;
  background: #fafafb;
  width: ${({ width }) => width};
`;

const Content = styled.div`
  padding: 0 24px 24px;
`;

const PageHeaderWrapper = styled.div`
  border-bottom: 1px solid #e6ebf1;
  margin-bottom: 16px;
  padding: 24px 0 12px;
  background: #ffffff;
`;

const TabsWrapper = styled.div`
  padding: 0 24px;
  margin-top: -12px;
  margin-bottom: -12px;
  .ant-tabs-nav {
    margin-bottom: 0 !important;
    &::before {
      display: none;
    }
  }
`;

type Props = PropsWithChildren<{
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  tags?: React.ReactNode;
  extra?: React.ReactNode | React.ReactNode[];
  content?: React.ReactNode;
  hideBreadcrumb?: boolean;
  tabs?: {
    key: string;
    label: string;
    element: ReactElement;
  }[];
  width?: string;
}>;

export const PageContainer: FC<Props> = (props) => {
  const location = useLocation();
  const { tabs: contextTabs } = useContext(PageTabsContext);
  const tabs = props.tabs || contextTabs; // 使用 props.tabs 如果存在，否则使用 context 中的 tabs

  // 如果当前没有传入 tabs 并且 context 中也没有 tabs，则默认选中第一个 tab
  const [currentTab, setCurrentTab] = useState('');

  useEffect(() => {
    if (tabs && tabs.length > 0 && !currentTab) {
      // 如果 tabs 存在并且还没有设置当前 tab，则默认设置为第一个 tab 的 key
      setCurrentTab(tabs[0].key);
    }
  }, [tabs, currentTab]);

  const [item] =
    matchRoutes(
      Object.keys(routeRecord).map((key) => ({
        path: key,
      })),
      location,
    ) ?? [];

  const breadcrumbItems = useBreadcrumbItems(location);

  function useBreadcrumbItems(location) {
    // 这里的逻辑取决于你的应用路由结构
    // 以下是一个简化的示例，您需要根据实际情况调整
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{_}</Link>
        </Breadcrumb.Item>
      );
    });

    const breadcrumbItems = [
      <Breadcrumb.Item key="home">
        <Link to="/overview"><HomeOutlined /></Link>
      </Breadcrumb.Item>
    ].concat(extraBreadcrumbItems);

    return breadcrumbItems;
  }

  return (
    <Container width={props.width}>
      <PageHeaderWrapper>
        <PageHeader
          extra={props.extra}
          // title={props.title ?? targetRouteNode?.name}
          subTitle={props.subTitle}
          tags={props.tags}
          breadcrumb={props.hideBreadcrumb ? undefined : <Breadcrumb>{breadcrumbItems}</Breadcrumb>}
        >
          {props.content}
        </PageHeader>
        {tabs && tabs.length > 0 && (
          <TabsWrapper>
            <Tabs
              activeKey={currentTab}
              onChange={(key) => setCurrentTab(key)}
              items={tabs.map(tab => ({
                label: tab.label,
                key: tab.key,
                children: <Lazy key={tab.key} active={tab.key === currentTab}>
                  {/*{tab.element}*/}
                </Lazy>
              }))}
            />
          </TabsWrapper>
        )}
      </PageHeaderWrapper>
      <Content>
        {tabs?.map((item) => (
          <Lazy key={item.key} active={item.key === currentTab}>
            {item.element}
          </Lazy>
        ))}
        {props.children}
      </Content>
    </Container>
  );
};

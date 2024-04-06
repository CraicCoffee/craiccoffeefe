import React from 'react';
import { Outlet } from 'umi';
import { PageTabsProvider } from "@/components/PageContainerContext";
import SiderMenu from '@/components/sider';
import { Layout } from 'antd';
import { PageContainer } from "@/components/page-container";
import { useLocation } from "@@/exports";
import styled from "styled-components";

const { Content } = Layout;

const loginPath = '/user/login';
const registerPath = '/user/register';

const isTestDomain = window.location.hostname?.endsWith('insightmontest.com');
const icp = isTestDomain ? '粤ICP备2023008093号-2' : '粤ICP备2023008093号-1';
const beian = isTestDomain ? '44030502010142' : '44030502009954';

const Footer = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #d0d4d7;
  padding-bottom: 8px; /* 如果您想要在 Footer 下方有一些空间 */
  a {
    color: inherit;
  }
`;

export default function BasicLayout() {
  const location = useLocation();
  const isPrivate = location.pathname !== loginPath && location.pathname !== registerPath;

  // 内容区域，可能会被包裹在 PageContainer 中
  const content = (
    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
      <Outlet /> {/* 这里是内容区域 */}
    </Content>
  );

  return (
    <PageTabsProvider>
      <Layout style={{ minHeight: '100vh' }}>
        {isPrivate && <SiderMenu />} {/* 条件渲染 SiderMenu */}
        <Layout>
          {/* 使用 isPrivate 条件来决定是否渲染 PageContainer */}
          {isPrivate ? (
            <PageContainer>
              {content}
            </PageContainer>
          ) : content}
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
          {/* 如果有 Footer，可以在这里添加 */}
          {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
      </Layout>
    </PageTabsProvider>
  );
}

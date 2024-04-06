import { FC } from "react";
import { Layout } from "antd";
import { NavMenu } from "@/components/nav-menu";
import MenuExtra from "@/components/MenuExtra";
import styled from "styled-components";

const ScrollPart = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const SideContainer = styled.div`
  height: calc(100vh); // 假设页头高度为60px
  display: flex;
  flex-direction: column;
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

const Sider: FC = () => {
  return (
    <Layout.Sider
      trigger={null}
      className="side-nav side-nav-dark"
      style={{
        overflow: 'auto', // 让 Sider 自己处理滚动
        height: '100vh', // 设置 Sider 的高度为视口高度
        position: 'sticky', // 使 Sider 固定在顶部
        top: 0,
      }}
    >
      <SideContainer>
        <Logo>
          <img src="/logo-with-name-white.svg" height="36px" alt="Logo" />
        </Logo>
        <ScrollPart>
          <NavMenu />
        </ScrollPart>
        <MenuExtra />
      </SideContainer>
    </Layout.Sider>
  );
};

export default Sider;

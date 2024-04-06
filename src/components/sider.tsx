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
  //padding: 12px 24px;
  > span {
    display: block;
    margin-left: 8px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }
  img {
    filter: invert(100%);
    height: auto; /* 或者使用 '200px' 来设置高度 */
    width: 100%; /* 设置宽度为容器的100% */
    max-width: 300px; /* 设置最大宽度，以避免变得过大 */
    display: block; /* 块级显示，有助于去除周围空白 */
    margin: 0 auto; /* 水平居中 */
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
            <img src="/CraicCoffee.svg" height="200px" alt="Logo" />
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

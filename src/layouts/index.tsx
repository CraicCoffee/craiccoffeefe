import React, { useContext, useEffect } from 'react';
import { Outlet } from 'umi';
import { Tabs } from 'antd';
import { PageTabsProvider, PageTabsContext } from "@/components/PageContainerContext";
import { PageContainer } from "@/components/page-container";

export default function Layout() {
  const { tabs, currentTab, setCurrentTab } = useContext(PageTabsContext);

  // 如果需要，此处可以设置默认的 tabs
  // 例如，可以在这里发起一个API调用来获取tabs，然后使用setTabs更新它们

  return (
    <PageTabsProvider>
      {/* 将 Tabs 组件放在 PageContainer 的上方 */}
      {/*{tabs && (*/}
      {/*  <Tabs*/}
      {/*    activeKey={currentTab}*/}
      {/*    onChange={(key) => setCurrentTab(key)}*/}
      {/*    items={tabs.map(tab => ({*/}
      {/*      label: tab.label,*/}
      {/*      key: tab.key*/}
      {/*    }))}*/}
      {/*  />*/}
      {/*)}*/}
      <PageContainer>
        {/* 内容区域 */}
        <Outlet/>
      </PageContainer>
      {/* 在 PageContainer 外部渲染当前选中 tab 的内容 */}
      {/*{tabs?.map((tab) => {*/}
      {/*  // 只渲染活动的 tab 内容*/}
      {/*  if (tab.key === currentTab) {*/}
      {/*    return <div key={tab.key}>{tab.element}</div>;*/}
      {/*  }*/}
      {/*  return null;*/}
      {/*})}*/}
    </PageTabsProvider>
  );
}

import { Menu } from 'antd';
import React, { useLayoutEffect, useRef, useState } from 'react';
import BaseView from './components/base';
import GiftCardView from './components/GiftCard';
import NotificationView from './components/notification';
import ThirdPartyKeyView from './components/ThirdPartyKey';
import WebhookView from './components/webhook';
// import BindingView from './components/binding';
// import SecurityView from './components/security';
import queryString from 'query-string';
import styles from './style.less';
import SecurityView from "@/pages/account/settings/components/security";
import BindingView from "@/pages/account/settings/components/binding";

const { Item } = Menu;

const menuMap = {
  base: '基本设置',
  security: '安全设置',
  // binding: '账号绑定',
  // notification: '新消息通知',
  // giftCard: '礼品卡兑换',
  // thirdPartyKey: '第三方密钥',
  // webhook: 'Webhook',
} as const;

type SettingsStateKeys = keyof typeof menuMap;
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC<any> = (props) => {
  console.log(props);

  const [initConfig, setInitConfig] = useState<SettingsState>(() => {
    const query = queryString.parse(location.search);
    return {
      mode: 'inline',
      selectKey: (query?.['initial-tab'] as SettingsStateKeys) || 'base',
    };
  });
  const dom = useRef<HTMLDivElement>();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({ ...initConfig, mode: mode as SettingsState['mode'] });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const getMenu = () => {
    return Object.entries(menuMap).map(([item, content]) => <Item key={item}>{content}</Item>);
  };

  const renderChildren = () => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      // case 'binding':
      //   return <BindingView />;
      case 'notification':
        return <NotificationView />;
      case 'thirdPartyKey':
        return <ThirdPartyKeyView />;
      case 'giftCard':
        return <GiftCardView />;
      case 'webhook':
        return <WebhookView />;
      default:
        return null;
    }
  };

  return (
    <div
      className={styles.main}
      ref={(ref) => {
        if (ref) {
          dom.current = ref;
        }
      }}
    >
      <div className={styles.leftMenu}>
        <Menu
          mode={initConfig.mode}
          selectedKeys={[initConfig.selectKey]}
          onClick={({ key }) => {
            setInitConfig({
              ...initConfig,
              selectKey: key as SettingsStateKeys,
            });
          }}
        >
          {getMenu()}
        </Menu>
      </div>
      <div className={styles.right}>
        <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
        {renderChildren()}
      </div>
    </div>
  );
};
export default Settings;

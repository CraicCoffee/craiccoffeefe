import { isDevOrTest } from '@/utils/is-dev-or-test';
import * as icons from '@ant-design/icons';
import { history } from '@umijs/max';
import { Menu } from 'antd';
import { memo, useEffect, useState } from 'react';
import routes from '../../config/routes';

type Item = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: Item[];
};

const items: Item[] = [];
// TODO: 补一下的类型定义
function traverse(routes: any, items: Item[]) {
  for (const route of routes) {
    if (route.devOnly && !isDevOrTest) continue;
    if (!route.name || route.hideInNavMenu) continue;
    let children: Item[] | undefined = undefined;
    if (route.routes && !route.hideChildrenInNavMenu) {
      children = [];
      traverse(route.routes, children);
    }
    const IconComponent = icons[route.icon];
    const item: Item = {
      key: route.path,
      label: route.name,
      icon: IconComponent ? <IconComponent /> : undefined,
      children,
    };
    items.push(item);
  }
}

traverse(routes, items);

export const NavMenu = memo(() => {
  const [, setFlag] = useState({});
  useEffect(() => {
    const cancel = history.listen(() => {
      setFlag({});
    });
    return () => {
      cancel();
    };
  }, []);

  const selectedKeys = (() => {
    const target = history.location.pathname;
    function traverse(items: Item[], keys: string[]): string[] | undefined {
      for (const item of items) {
        if (item.children) {
          const result = traverse(item.children, [...keys, item.key]);
          if (result) return result;
        } else {
          if (target.startsWith(item.key)) {
            return [...keys, item.key];
          }
        }
      }
      return undefined;
    }
    return traverse(items, []) ?? [];
  })();

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['1']}
      items={items}
      defaultOpenKeys={selectedKeys}
      selectedKeys={selectedKeys}
      onClick={({ key }) => {
        history.push(key);
      }}
    />
  );
});

import { Avatar, List } from 'antd';

import classNames from 'classnames';
import React from 'react';
import styles from './NoticeList.less';

export type NoticeIconTabProps = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: API.NoticeIconItemType;
  onClick?: (item: API.NoticeIconItem) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: API.NoticeIconItem[];
  onViewMore?: (e: any) => void;
};
const NoticeList: React.FC<NoticeIconTabProps> = ({ list = [], onClick, emptyText }) => {
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List<API.NoticeIconItem>
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null;

          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => {
                onClick?.(item);
              }}
              style={{ borderBottom: '1px solid #999' }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>{item.description}</div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default NoticeList;

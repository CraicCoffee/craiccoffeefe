import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { noticesAll, noticesRead } from './server';

import moment from 'moment';
import NoticeIcon from './NoticeIcon';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const NoticeIconView: React.FC = () => {
  const [unRead, setUnread] = useState(0);
  const [notices, setNotices] = useState([] as any[]);
  const { run, cancel } = useRequest(noticesAll, {
    manual: true,
    pollingInterval: 1000 * 300,
    pollingErrorRetryCount: -1,
    onSuccess: ({ data }) => {
      if (data?.data && data.data.length > 0) {
        const arr = data?.data.sort((a, b) => {
          return moment(a.dateTime).format('YYYY-MM-DD HH:mm') >
            moment(b.dateTime).format('YYYY-MM-DD HH:mm')
            ? -1
            : 1;
        });
        setNotices(arr || []);
      }
    },
  });
  const { run: readNoticeItem } = useRequest(noticesRead, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
    },
  });

  // TODO 请求后端获取获取通知数
  useEffect(() => {
    run();
    return () => {
      cancel();
    };
  }, [run, cancel]);
  useEffect(() => {
    const unReadCount = notices.filter((i) => i.read === false);
    setUnread(unReadCount.length);
  }, [notices]);

  const changeReadState = (item: any) => {
    const readItem = notices.map((i: any) => {
      const notice = { ...i };
      if (i.id === item.id) {
        notice.read = true;
      }
      return notice;
    });
    // history.push(`/alarm/detail/${item.title}`);
    setNotices(readItem);
    readNoticeItem({ id: item.id });
  };

  return (
    <NoticeIcon
      count={unRead}
      onItemClick={(item) => {
        changeReadState(item);
      }}
      loading={false}
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unRead}
        list={notices}
        title="通知"
        emptyText="你已查看所有通知"
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={0}
        list={[]}
        title="消息"
        emptyText="您已读完所有消息"
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;

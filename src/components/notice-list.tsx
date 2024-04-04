import { useNoticeStore } from '@/stores/notice.store';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Badge, Table, TableColumnsType } from 'antd';
import moment from 'moment';
import { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding-top: 12px;
  thead {
    display: none;
  }
  tbody {
    tr:last-child td {
      border-bottom: none;
    }
  }
`;

const Label = styled.div`
  display: inline-block;
  .ant-badge {
    margin-right: 4px;
  }
`;

const Title = styled.div<{
  read: boolean;
}>`
  font-weight: ${(p) => (p.read ? 'normal' : 'bold')};
  cursor: pointer;
  :hover {
    color: #007bc7;
  }
`;

type Props = {
  noticePageData: API.DataWithPageNotice;
  onSelect: (notice: any) => void;
};

export const NoticeList: FC<Props> = (props) => {
  const { setNoticeStarred, nextPage } = useNoticeStore();

  const tableColumns: TableColumnsType<any> = [
    {
      colSpan: 4,
      dataIndex: 'name',
      className: 'mail-list-sender',
      render: (_, notice) => (
        <div className="d-flex align-items-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setNoticeStarred(notice, !notice.starred);
            }}
            style={{ cursor: 'pointer' }}
          >
            {notice.starred ? <StarFilled style={{ color: '#ffc542' }} /> : <StarOutlined />}
          </div>
          {/* <div className="d-flex align-items-center">
            <Avatar src={notice.avatar} size={30}/>
            <h4 className="mb-0 ml-2">{notice.name}</h4>
          </div> */}
        </div>
      ),
    },
    {
      title: '',
      colSpan: 0,
      className: 'mail-list-content',
      render: (_, notice) => (
        <Title
          read={notice.read}
          onClick={() => {
            props.onSelect(notice);
          }}
        >
          {notice.title}
        </Title>
      ),
    },
    {
      title: '',
      colSpan: 0,
      render: (_, notice) => {
        const isAlarm = notice.title.includes('监控告警');
        return (
          <Label>
            <Badge color={isAlarm ? 'red' : 'blue'} />
            <span>{isAlarm ? '监控告警' : '系统通知'}</span>
          </Label>
        );
      },
    },
    {
      title: '',
      colSpan: 0,
      className: 'mail-list-date',
      render: (_, notice) => <div>{moment(notice.dateTime).fromNow()}</div>,
    },
  ];

  return (
    <Container>
      <Table
        columns={tableColumns}
        dataSource={props.noticePageData.data}
        pagination={{
          pageSize: 15,
          current: props.noticePageData.currentPage,
          total: props.noticePageData.total,
          onChange: nextPage,
          showTotal: (total) => `共 ${total} 条`,
        }}
        rowKey="id"
      />
    </Container>
  );
};

function formatBody(body: string) {
  return body.replace(/<(?:.|\n)*?>/gm, ' ');
}

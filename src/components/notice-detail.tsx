import { DeleteOutlined, LeftCircleOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import moment from 'moment';
import { FC, useEffect } from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > * {
    flex: none;
  }
  font-size: 16px;
  padding: 16px 0 12px;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > * {
    flex: none;
    margin-left: 12px;
  }
`;

const IconButton = styled.div`
  cursor: pointer;
  font-size: 24px;
  :hover {
    color: #007bc7;
  }
`;

type Props = {
  notice: any;
  onRead: (notice: any) => void;
  onBack: () => void;
};

export const NoticeDetail: FC<Props> = (props) => {
  const { notice } = props;

  useEffect(() => {
    if (!notice.read) {
      props.onRead(notice);
    }
  }, [notice]);

  return (
    <div>
      <Header>
        <div>
          <IconButton
            onClick={() => {
              props.onBack();
            }}
          >
            <LeftCircleOutlined />
          </IconButton>
        </div>
        <HeaderRight>
          <div>{moment(notice.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
          <Tooltip title="收藏">
            <IconButton>
              {/* <StarFilled className="mail-detail-action-icon star checked" /> */}
              <StarOutlined className="mail-detail-action-icon star" />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton>
              <DeleteOutlined className="mail-detail-action-icon" />
            </IconButton>
          </Tooltip>
        </HeaderRight>
      </Header>
      <h2>{notice.title}</h2>
      <p>{notice.description}</p>
    </div>
  );
};

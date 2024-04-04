import useCopyToClipboard from '@/common/useCopyToClipboard';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Popover, Tag, Tooltip } from 'antd';
import { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import styles from './index.less';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex: auto;
  overflow: hidden;
  white-space: nowrap;
`;

const Right = styled.div`
  flex: none;
  padding-left: 8px;
`;

const ShowAllTagButton = styled(Tag)`
  cursor: pointer;
  margin: 0;
`;

type Props = {
  tags: {
    key: string;
    value: string;
  }[];
  hideLeft?: boolean;
};

const Tags: FC<Props> = (props) => {
  const tags = useMemo(() => props.tags.map((tag) => `${tag.key}:${tag.value}`), []);
  const [searchValue, setSearchValue] = useState('');
  const trimedSearchValue = searchValue.trim();
  const [_, copy] = useCopyToClipboard();

  const copyText = trimedSearchValue ? 'Copy' : 'Copy All';
  const copyTooltip = trimedSearchValue ? 'Copy list of matching tags' : 'Copy list of all tags';

  const filteredTags = useMemo(() => {
    if (trimedSearchValue) {
      return tags.filter((i) => i.includes(trimedSearchValue));
    }
    return tags;
  }, [trimedSearchValue, tags]);

  const handleCopyClick = async () => {
    const success = await copy(filteredTags.join(', '));
    if (success) {
      message.success('已复制到剪贴板!');
    } else {
      message.error('复制失败!');
    }
  };

  const content = () => {
    return (
      <div>
        <div className={styles.contentTop}>
          <Input
            size="small"
            placeholder="Filter Tags"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => {
              console.log('onChange', e.target.value);
              setSearchValue(e.target.value);
            }}
          />
          <Tooltip title={copyTooltip}>
            <div className={styles.copy} onClick={handleCopyClick}>
              <Button size="small" icon={<CopyOutlined />}>
                {copyText}
              </Button>
            </div>
          </Tooltip>
        </div>
        {filteredTags.map((item) => (
          <div key={item}>
            <Tag
              style={{
                marginBottom: 5,
              }}
              color="geekblue"
            >
              {item}
            </Tag>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Container>
      {props.hideLeft !== true && (
        <Left>
          {tags.slice(0, 10).map((item) => (
            <Tag color="geekblue" key={item}>
              {item}
            </Tag>
          ))}
        </Left>
      )}
      {tags.length > 0 && (
        <Right>
          <Popover placement="topLeft" content={content} title={false} trigger="click">
            <ShowAllTagButton>全部{tags.length}个标签</ShowAllTagButton>
          </Popover>
        </Right>
      )}
    </Container>
  );
};

export default Tags;

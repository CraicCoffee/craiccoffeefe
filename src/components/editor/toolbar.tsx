import {
  BarChartOutlined,
  CodeOutlined,
  OrderedListOutlined,
  PictureOutlined,
  TableOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { FC } from 'react';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { CustomTransforms } from './custom-transforms';
import { createChartElement } from './elements/chart';
import { createCodeElement } from './elements/code';
import { createListElement } from './elements/list';
import { ToolbarButton } from './toolbar-button';
import { ToolbarButtonList } from './toolbar-button-list';
import { TypographySelect } from './typography-select';

const ToolbarSeparator = styled.span`
  border-left: 1px solid #e6ebf1;
  height: 40%;
  margin: 0 16px;

  @media (max-width: 800px) {
    display: none;
  }
`;

const HOTKEY_MAP = {
  H1: '#',
  H2: '##',
  H3: '###',
  LIST: '-',
  IMAGE: '![]',
  TABLE: '|||',
  CODE: '```',
};

interface Props {}
export const Toolbar: FC<Props> = (props) => {
  const editor = useSlate();

  function insertList(ordered: boolean) {
    CustomTransforms.insertBlockElement(editor, createListElement(ordered));
  }

  function insertCode() {
    CustomTransforms.insertBlockElement(editor, createCodeElement());
  }

  function insertChart() {
    CustomTransforms.insertBlockElement(editor, createChartElement());
  }

  return (
    <>
      <ToolbarButtonList
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <TypographySelect />
        <ToolbarSeparator />
        <ToolbarButton
          basic={true}
          description={'列表'}
          onClick={() => insertList(false)}
          shortcut={HOTKEY_MAP.LIST}
        >
          <UnorderedListOutlined />
        </ToolbarButton>
        <ToolbarButton basic={true} description={'有序列表'} onClick={() => insertList(true)}>
          <OrderedListOutlined />
        </ToolbarButton>
        <ToolbarButton basic={true} description={'表格'} shortcut={HOTKEY_MAP.TABLE}>
          <TableOutlined />
        </ToolbarButton>
        <ToolbarButton basic={true} description={'图片'} shortcut={HOTKEY_MAP.IMAGE}>
          <PictureOutlined />
        </ToolbarButton>
        <ToolbarButton description={'代码块'} onClick={insertCode}>
          <CodeOutlined />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton description={'监控图表'} onClick={insertChart}>
          <BarChartOutlined />
        </ToolbarButton>
        <ToolbarButton basic={true} description={'AI'}>
          <ThunderboltOutlined />
        </ToolbarButton>
      </ToolbarButtonList>
    </>
  );
};

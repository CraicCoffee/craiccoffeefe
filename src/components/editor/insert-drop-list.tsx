import { useMemoizedFn } from 'ahooks';
import { Menu } from 'antd';
import isHotkey from 'is-hotkey';
import { FC, useEffect, useState } from 'react';
import { Element, Path, Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { createChartElement } from './elements/chart';
import { createCodeElement } from './elements/code';
import { createHeadingElement } from './elements/heading';

const StyledMenuItem = styled(Menu.Item)<{
  selected: boolean;
}>`
  background-color: ${(p) => (p.selected ? '#eeeeee' : 'transparent')} !important;
`;

type Props = {
  path: Path;
};

export type InsertDropListRef = {
  selectPrevious: () => void;
  selectNext: () => void;
  confirm: () => void;
};

export const InsertDropList: FC<Props> = (props) => {
  const editor = useSlateStatic();
  const options: {
    key: string;
    label: string;
    createElement: () => Element;
  }[] = [
    {
      key: 'heading-1',
      label: '1级标题',
      createElement: () => createHeadingElement(1),
    },
    {
      key: 'heading-2',
      label: '2级标题',
      createElement: () => createHeadingElement(2),
    },
    {
      key: 'heading-3',
      label: '3级标题',
      createElement: () => createHeadingElement(3),
    },
    {
      key: 'code',
      label: '代码块',
      createElement: () => createCodeElement(),
    },
    {
      key: 'chart',
      label: '监控图表',
      createElement: () => createChartElement(),
    },
  ];

  const [selectedKey, setSelectedKey] = useState<string>(options[0].key);

  const confirm = useMemoizedFn(() => {
    Transforms.removeNodes(editor, {
      at: props.path,
    });
    const targetOption = options.find(({ key }) => key === selectedKey);
    const element = targetOption?.createElement();
    if (!element) return;
    Transforms.insertNodes(editor, element, {
      at: props.path,
    });
    Transforms.select(editor, props.path);
  });

  const selectPrevious = useMemoizedFn(() => {
    const index = options.findIndex(({ key }) => key === selectedKey);
    if (index === 0) {
      setSelectedKey(options[options.length - 1].key);
    } else {
      setSelectedKey(options[index - 1].key);
    }
  });
  const selectNext = useMemoizedFn(() => {
    const index = options.findIndex(({ key }) => key === selectedKey);
    if (index === options.length - 1) {
      setSelectedKey(options[0].key);
    } else {
      setSelectedKey(options[index + 1].key);
    }
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      function prevent() {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      if (isHotkey('enter', e)) {
        prevent();
        confirm();
      } else if (isHotkey('down', e)) {
        prevent();
        selectNext();
      } else if (isHotkey('up', e)) {
        prevent();
        selectPrevious();
      }
    }
    document.addEventListener('keydown', handleKeyDown, {
      capture: true,
    });
    return () => {
      document.removeEventListener('keydown', handleKeyDown, {
        capture: true,
      });
    };
  }, []);

  return (
    <div onClick={confirm}>
      {options.map((option) => (
        <div
          key={option.key}
          onMouseOver={() => {
            setSelectedKey(option.key);
          }}
        >
          <StyledMenuItem key={option.key} selected={selectedKey === option.key}>
            {option.label}
          </StyledMenuItem>
        </div>
      ))}
    </div>
  );
};

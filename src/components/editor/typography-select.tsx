import { Select } from 'antd';
import { memo } from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { HeadingElement } from './elements/heading';

type Typography = {
  value: string;
  changeable: boolean;
};

export const TypographySelect = memo(() => {
  const editor = useSlate();
  const currentBlockElement =
    editor.selection && editor.getNearestBlockElement(editor.selection.anchor.path)?.[0];

  const typography = ((): Typography => {
    switch (currentBlockElement?.type) {
      case 'paragraph':
        return {
          value: 'paragraph',
          changeable: true,
        };
      case 'heading':
        return {
          value: `heading-${currentBlockElement.level}`,
          changeable: true,
        };
      case 'code-line':
        return {
          value: '代码块',
          changeable: false,
        };
      default:
        return {
          value: '',
          changeable: false,
        };
    }
  })();

  function formatToHeading(level: HeadingElement['level']) {
    Transforms.setNodes(editor, {
      type: 'heading',
      level,
    });
  }

  return (
    <Select
      value={typography.value}
      disabled={!typography.changeable}
      style={{ width: 120, marginRight: 8 }}
      onBlur={() => {
        editor.focus();
      }}
    >
      <Select.Option
        value="paragraph"
        onClick={() => {
          Editor.withoutNormalizing(editor, () => {
            Transforms.setNodes(editor, {
              type: 'paragraph',
            });
            Transforms.unsetNodes(editor, 'level');
          });
        }}
      >
        正文
      </Select.Option>
      <Select.Option
        value="heading-1"
        style={{ fontSize: 24 }}
        onClick={() => {
          formatToHeading(1);
        }}
      >
        标题1
      </Select.Option>
      <Select.Option
        value="heading-2"
        style={{ fontSize: 20 }}
        onClick={() => {
          formatToHeading(2);
        }}
      >
        标题2
      </Select.Option>
      <Select.Option
        value="heading-3"
        style={{ fontSize: 16 }}
        onClick={() => {
          formatToHeading(3);
        }}
      >
        标题3
      </Select.Option>
    </Select>
  );
});

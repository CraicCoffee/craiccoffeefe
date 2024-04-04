import { IconFont } from '@/components/icon-font';
import { FC } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { CustomText } from '../editor-types';
import { ToolbarButton } from '../toolbar-button';
import { toggleSelectedInlineStyle } from '../utils';
import { HoveringToolbar } from './hovering-toolbar';

type InlineStyleType = keyof Omit<CustomText, 'text'>;

const inlineStyles = ['bold', 'italic', 'underline', 'sup', 'sub'] as InlineStyleType[];

export const EditModeHoveringToolbar: FC = () => {
  const editor = useSlate();

  const marks = Editor.marks(editor);
  const isMarkActive = (format: InlineStyleType) => {
    return marks ? marks[format] === true : false;
  };

  return (
    <HoveringToolbar>
      {inlineStyles.map((type) => (
        <ToolbarButton
          key={type}
          active={isMarkActive(type) ? true : undefined}
          onClick={() => {
            toggleSelectedInlineStyle(editor, type);
          }}
        >
          <IconFont name={type} />
        </ToolbarButton>
      ))}
      {/* <ToolbarButton
          onClick={() => {
            toggleSelectedInlineStyle(editor, 'comment-id-1')
          }}
        >
          Comment
        </ToolbarButton> */}
    </HoveringToolbar>
  );
};

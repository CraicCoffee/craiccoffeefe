import { useEditorStore } from '@/stores/editor.store';
import { Dropdown, Menu } from 'antd';
import { useState } from 'react';
import { Node, Range } from 'slate';
import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react';
import { CustomInlineElement, ElementComponent } from '.';
import { CustomText } from '../editor-types';
import { InsertDropList } from '../insert-drop-list';
import { PlaceholderText } from '../placeholder-text';

export type ParagraphElement = {
  type: 'paragraph';
  children: (CustomText | CustomInlineElement)[];
};

/**
 * @deprecated use createParagraphElement instead
 */
export const emptyParagraphElement: ParagraphElement = {
  type: 'paragraph',
  children: [{ text: '' }],
};

export function createParagraphElement(): ParagraphElement {
  return {
    type: 'paragraph',
    children: [{ text: '' }],
  };
}

export const Paragraph: ElementComponent<ParagraphElement> = (props) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const collapsed = !!editor.selection && Range.isCollapsed(editor.selection);
  const focused = useFocused();
  const path = ReactEditor.findPath(editor, props.element);
  const isTopLevel = path.length === 1;
  const string = Node.string(props.element);
  const hasOnlyOneChild = props.element.children.length === 1;
  const showPopover = selected && collapsed && isTopLevel && string === '/' && hasOnlyOneChild;
  let placeholder = '';
  if (selected && collapsed && focused && hasOnlyOneChild && string === '' && isTopLevel) {
    placeholder = '输入 / 可以快捷插入';
  }

  const editorStore = useEditorStore();
  const [compositing, setCompositing] = useState(false);
  editorStore.compositionStart$.useSubscription(() => {
    setCompositing(selected);
  });
  editorStore.compositionEnd$.useSubscription(() => {
    setCompositing(false);
  });

  return (
    <Dropdown
      open={showPopover}
      placement="bottomLeft"
      destroyPopupOnHide
      overlay={
        <Menu
          style={{
            width: 200,
          }}
        >
          <InsertDropList path={path} />
        </Menu>
      }
    >
      <>
        {Boolean(placeholder) && !compositing && <PlaceholderText content={placeholder} />}
        <p {...props.attributes}>{props.children}</p>
      </>
    </Dropdown>
  );
};

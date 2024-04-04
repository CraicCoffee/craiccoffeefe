import { Node, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { CustomInlineElement, ElementComponent } from '.';
import { useEditorElementEnterKeyDown } from '../../../utils/use-editor-element-enter-key-down';
import { CustomText } from '../editor-types';

export type ListItemElement = {
  type: 'list-item';
  children: (CustomText | CustomInlineElement)[];
};

export function createListItemElement(): ListItemElement {
  return {
    type: 'list-item',
    children: [{ text: '' }],
  };
}

export const ListItem: ElementComponent<ListItemElement> = (props) => {
  const editor = useSlateStatic();

  const isEmpty = props.element.children.length === 1 && Node.string(props.element) === '';
  useEditorElementEnterKeyDown(isEmpty, () => {
    const path = ReactEditor.findPath(editor, props.element);
    Transforms.liftNodes(editor, {
      at: path,
    });
  });

  return <li {...props.attributes}>{props.children}</li>;
};

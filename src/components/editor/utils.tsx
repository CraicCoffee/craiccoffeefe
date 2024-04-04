import { Editor, Element, Node, Transforms } from 'slate';
import { CustomText } from './editor-types';
import { CustomBlockElement } from './elements';
import { HeadingElement } from './elements/heading';

type BlockType = CustomBlockElement['type'];
export function toggleSelectedBlockType(editor: Editor, format: BlockType) {
  const active = editor.isBlockActive(format);
  Transforms.setNodes(editor, {
    type: active ? 'paragraph' : format,
  });
  return !active;
}

export function toggleHeading(editor: Editor, level: HeadingElement['level']) {
  Editor.withoutNormalizing(editor, () => {
    const isActiveAfterToggle = toggleSelectedBlockType(editor, 'heading');
    if (isActiveAfterToggle) {
      Transforms.setNodes<HeadingElement>(editor, {
        level,
      });
    } else {
      Transforms.unsetNodes(editor, 'level');
    }
  });
}

type InlineStyleType = keyof Omit<CustomText, 'text'>;

export function toggleSelectedInlineStyle(editor: Editor, style: InlineStyleType) {
  const marks = Editor.marks(editor);
  const isMarkActive = marks ? marks[style] === true : false;
  if (isMarkActive) {
    editor.removeMark(style);
  } else {
    editor.addMark(style, !isMarkActive);
  }
}

export function addComment(editor: Editor, commentId: string) {
  // editor.addMark('commentId', commentId)
}

export function isEmptyElement(element: Element) {
  return element.children.length === 1 && Node.string(element) === '';
}

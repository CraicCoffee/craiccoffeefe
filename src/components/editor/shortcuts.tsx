import { Editor, Element as SlateElement, Point, Range, Transforms } from 'slate';
import { createListElement } from './elements/list';

// https://github.com/ianstormtaylor/slate/blob/main/site/examples/markdown-shortcuts.tsx

const SHORTCUTS: Record<string, Partial<SlateElement>> = {
  '-': {
    type: 'list-item',
  },
  '#': {
    type: 'heading',
    level: 1,
  },
  '##': {
    type: 'heading',
    level: 2,
  },
  '###': {
    type: 'heading',
    level: 3,
  },
  // '```': {
  //   type: 'code',
  // },
};

export function withShortcuts(editor: Editor) {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const properties = SHORTCUTS[beforeText];

      if (properties) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.select(editor, range);
          if (!Range.isCollapsed(range)) {
            Transforms.delete(editor);
          }
          Transforms.setNodes<SlateElement>(editor, properties, {
            match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
          });

          if (properties.type === 'list-item') {
            Transforms.wrapNodes(editor, createListElement(), {
              match: (n) =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
            });
          }
        });

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          };
          Transforms.setNodes(editor, newProperties);

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list',
              split: true,
            });
          }

          return;
        }
      }

      deleteBackward(...args);
    }
  };

  return editor;
}
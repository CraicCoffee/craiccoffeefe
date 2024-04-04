import { parseHotkey } from 'is-hotkey';
import { Editor } from 'slate';
import {
  addComment,
  toggleHeading,
  toggleSelectedBlockType,
  toggleSelectedInlineStyle,
} from './utils';

type KeyBindingHandler = (editor: Editor) => void;

const raw: [string, KeyBindingHandler][] = [
  [
    'mod+b',
    (editor) => {
      toggleSelectedInlineStyle(editor, 'bold');
    },
  ],
  [
    'mod+i',
    (editor) => {
      toggleSelectedInlineStyle(editor, 'italic');
    },
  ],
  [
    'mod+u',
    (editor) => {
      toggleSelectedInlineStyle(editor, 'underline');
    },
  ],
  [
    'mod+0',
    (editor) => {
      const block = editor.getFocusingBlock();
      if (!block || block.type !== 'heading') return;
      toggleSelectedBlockType(editor, 'paragraph');
    },
  ],
  [
    'mod+1',
    (editor) => {
      toggleHeading(editor, 1);
    },
  ],
  [
    'mod+2',
    (editor) => {
      toggleHeading(editor, 2);
    },
  ],
  [
    'mod+3',
    (editor) => {
      toggleHeading(editor, 3);
    },
  ],
  [
    'mod+k',
    (editor) => {
      // FIXME: this should be the hyperlink hotkey
      addComment(editor, 'test123');
    },
  ],
];

export const keyBindings = raw.map(
  ([keyString, handler]) => [parseHotkey(keyString), handler] as const,
);

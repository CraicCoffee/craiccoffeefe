import { BaseEditor, BaseRange, Node, NodeEntry, Path } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { CustomBlockElement, CustomElement } from './elements';

export type EmptyText = { text: '' };

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  sup?: boolean;
  sub?: boolean;
  underline?: boolean;
  [key: `comment-id-${string}`]: boolean;
};

type BlockType = CustomBlockElement['type'];

type MyEditor = {
  checkElementInSelection: (check: (element: CustomElement) => boolean) => boolean;
  isBlockActive: (format: BlockType) => boolean;
  focus: () => void;
  moveCursorToNextBlock: () => void;
  moveCursorToEnd: () => void;
  getNearest: <T extends Node>(path: Path, targetElementType: BlockType) => NodeEntry<T> | null;
  getNearestBlockElement: (path: Path) => NodeEntry<CustomBlockElement> | null;
  getFocusingBlock: () => CustomBlockElement | null;
  onContentChange: () => void;
  addContentChangeHandler: (handler: () => void) => void;
  removeContentChangeHandler: (handler: () => void) => void;
  removeElement: (element: CustomElement) => void;
  nodeToDecorations?: Map<CustomElement, BaseRange[]>;
};

export type CustomEditor = BaseEditor & HistoryEditor & ReactEditor & MyEditor;
declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

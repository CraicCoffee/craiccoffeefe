import React from 'react';
import { Editor, Transforms } from 'slate';
import { createParagraphElement } from './elements/paragraph';

export function handleEnterKey(editor: Editor, e: React.KeyboardEvent<HTMLDivElement>) {
  if (editor.isBlockActive('title')) {
    e.preventDefault();
    editor.moveCursorToNextBlock();
  } else if (editor.isBlockActive('heading')) {
    const currentFocusPoint = editor.selection?.focus;
    if (!currentFocusPoint) return;
    const headingEntry = editor.getNearestBlockElement(currentFocusPoint.path);
    if (!headingEntry) return;
    const [, headingPath] = headingEntry;
    if (Editor.isStart(editor, currentFocusPoint, headingPath)) {
      // focusing point is at the start of the heading
      e.preventDefault();
      Transforms.insertNodes(editor, createParagraphElement());
      editor.moveCursorToNextBlock();
    } else if (Editor.isEnd(editor, currentFocusPoint, headingPath)) {
      // focusing point is at the start of the heading
      e.preventDefault();
      Transforms.insertNodes(editor, createParagraphElement());
    }
  }
}

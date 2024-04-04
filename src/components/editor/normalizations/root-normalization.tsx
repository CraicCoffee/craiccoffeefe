import { Element, Transforms } from 'slate';
import { Normalization } from '.';
import { isEmptyElement } from '../utils';

export const rootNormalization: Normalization = ([node, path], editor) => {
  if (path.length === 0) {
    // path is []
    const lastNode = editor.children.at(-1);
    if (
      !Element.isElement(lastNode) ||
      lastNode.type !== 'paragraph' ||
      !isEmptyElement(lastNode)
    ) {
      Transforms.insertNodes(
        editor,
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
        {
          at: [editor.children.length],
        },
      );
      return;
    }
  }
  return true;
};

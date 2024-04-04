import { Element, Path, Transforms } from 'slate';
import { emptyTitleElement } from '../elements/title';
import { Normalization } from './index';

export const titleNormalization: Normalization = ([node, path], editor) => {
  // the first block node of editor must be a title element
  if (path.length === 0) {
    const firstNode = editor.children[0];
    if (!Element.isElement(firstNode) || firstNode.type !== 'title') {
      Transforms.insertNodes(editor, emptyTitleElement, {
        at: [0],
      });
      return;
    }
  }
  // the title element must only exist at the specified path
  if (Element.isElement(node) && node.type === 'title') {
    if (!Path.equals(path, [0])) {
      Transforms.unwrapNodes(editor, {
        at: path,
      });
      return;
    }
  }
  return true;
};

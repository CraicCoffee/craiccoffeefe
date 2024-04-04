import { Element, Node, Transforms } from 'slate';
import { Normalization } from '.';

export const codeNormalization: Normalization = ([node, path], editor) => {
  if (!Element.isElement(node)) return true;
  if (node.type === 'code') {
    for (const [child, childPath] of Node.children(editor, path)) {
      if (!(Element.isElement(child) && child.type === 'code-line')) {
        if (childPath[childPath.length - 1] === 0) {
          // is the first child
          Transforms.liftNodes(editor, { at: childPath });
        } else {
          Transforms.mergeNodes(editor, { at: childPath });
        }
        return;
      }
    }
  }
  return true;
};

import { Element, Node, Transforms } from 'slate';
import { Normalization } from '.';

export const paragraphNormalization: Normalization = ([node, path], editor) => {
  if (Element.isElement(node)) {
    if (node.type === 'paragraph') {
      const subEntries = Node.children(editor, path);
      for (const [child, childPath] of subEntries) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
      }
    }
  }
  return true;
};

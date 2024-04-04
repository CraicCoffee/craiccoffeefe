import { Editor, Element, Node, Path, Transforms } from 'slate';
import { Normalization } from '.';
import { createParagraphElement } from '../elements/paragraph';

export const listNormalization: Normalization = ([node, path], editor) => {
  if (!Element.isElement(node)) return true;
  if (node.type === 'list') {
    for (const [child, childPath] of Node.children(editor, path)) {
      if (!(Element.isElement(child) && child.type === 'list-item')) {
        if (Element.isElement(child) && child.type === 'paragraph') {
          Transforms.setNodes(editor, { type: 'list-item' }, { at: childPath });
          return;
        }
        if (childPath[childPath.length - 1] === 0) {
          // is the first child
          Transforms.liftNodes(editor, { at: childPath });
        } else {
          Transforms.mergeNodes(editor, { at: childPath });
        }
        return;
      }
    }
    const prevNodeEntry = Editor.previous(editor, {
      at: path,
    });
    if (!prevNodeEntry) return true;
    const [prevNode] = prevNodeEntry;
    if (Element.isElement(prevNode) && prevNode.type === 'list') {
      Transforms.mergeNodes(editor, { at: path });
      return;
    }
  }
  if (node.type === 'list-item') {
    const parentNode = Node.parent(editor, path);
    if (!(Element.isElement(parentNode) && parentNode.type === 'list')) {
      Transforms.wrapNodes(editor, createParagraphElement(), { at: path });
      Transforms.unwrapNodes(editor, { at: [...path, 0] });
      return;
    }
  }
  return true;
};

import { diff } from 'deep-object-diff';
import {
  createEditor as createSlateEditor,
  Editor,
  Element,
  Node,
  NodeEntry,
  Transforms,
} from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import { CustomEditor } from './editor-types';
import { CustomBlockElement, elementConfigMap } from './elements';
import { allNormalizations } from './normalizations';
import { withShortcuts } from './shortcuts';

export function createEditor() {
  const editor: CustomEditor = withShortcuts(
    withReact<CustomEditor>(withHistory(createSlateEditor())),
  );

  const contentChangeHandlerSet = new Set<() => void>();
  editor.addContentChangeHandler = (handler) => {
    contentChangeHandlerSet.add(handler);
  };
  editor.removeContentChangeHandler = (handler) => {
    contentChangeHandlerSet.delete(handler);
  };

  editor.onContentChange = () => {
    contentChangeHandlerSet.forEach((handler) => handler());
  };

  editor.isInline = (element) => {
    return elementConfigMap[element.type]?.isInline ?? false;
  };

  editor.isVoid = (element) => {
    return elementConfigMap[element.type]?.isVoid ?? false;
  };

  const builtInNormalizeNode = editor.normalizeNode;
  editor.normalizeNode = (entry) => {
    for (const normalization of allNormalizations) {
      // TODO: just for debugging
      const before = JSON.stringify(editor.children);
      const result = normalization(entry, editor);
      if (result !== true) {
        console.log('normalization happended', normalization.name);
        console.log('before', JSON.parse(before));
        console.log('after', editor.children);
        console.log('diff', diff(JSON.parse(before), editor.children));
        return;
      }
    }
    builtInNormalizeNode(entry);
  };

  editor.checkElementInSelection = (check) => {
    const { selection } = editor;
    if (!selection) return false;
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && check(n),
      }),
    );
    return !!match;
  };

  editor.isBlockActive = (format) => {
    return editor.checkElementInSelection((element) => element.type === format);
  };

  editor.focus = () => {
    ReactEditor.focus(editor);
  };

  editor.moveCursorToNextBlock = () => {
    const location = editor.selection?.focus;
    if (!location) return;
    const [startPoint] = Editor.edges(editor, [location.path[0] + 1]);
    Transforms.select(editor, {
      anchor: startPoint,
      focus: startPoint,
    });
  };

  editor.moveCursorToEnd = () => {
    const endPoint = Editor.end(editor, []);
    Transforms.select(editor, {
      anchor: endPoint,
      focus: endPoint,
    });
  };

  editor.getNearest = (path, targetElementType) => {
    for (const nodeEntry of Node.levels(editor, path, {
      reverse: true,
    })) {
      const [targetNode] = nodeEntry;
      if (Element.isElement(targetNode) && targetNode.type === targetElementType) {
        return nodeEntry as any;
      }
    }
    return null;
  };

  editor.getFocusingBlock = () => {
    const focus = editor.selection?.focus;
    if (!focus) return null;
    const block = editor.getNearestBlockElement(focus.path);
    if (!block) return null;
    return block[0];
  };

  editor.getNearestBlockElement = (path) => {
    for (const nodeEntry of Node.levels(editor, path, {
      reverse: true,
    })) {
      const [targetNode] = nodeEntry;
      if (!Element.isElement(targetNode)) continue;
      const elementConfig = elementConfigMap[targetNode.type];
      if (!elementConfig) continue;
      if (!elementConfig.isInline) {
        return nodeEntry as NodeEntry<CustomBlockElement>;
      }
    }
    return null;
  };

  editor.removeElement = (element) => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
    });
  };

  return editor;
}

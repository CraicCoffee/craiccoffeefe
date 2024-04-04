import { Editor, Node, Path, Range, Transforms } from 'slate';
import { CustomBlockElement } from './elements';

export const CustomTransforms = {
  insertBlockElement: (editor: Editor, element: CustomBlockElement) => {
    let targetPath: Path | undefined = undefined;
    Editor.withoutNormalizing(editor, () => {
      const { selection } = editor;
      if (!selection) return false;
      if (Range.isCollapsed(selection)) {
        const [blockElement, path] = editor.getNearestBlockElement(selection.anchor.path) ?? [];
        if (
          blockElement &&
          blockElement.children.length === 1 &&
          Node.string(blockElement) === ''
        ) {
          editor.removeElement(blockElement);
          targetPath = path;
        }
      }
      Transforms.insertNodes(editor, element, {
        at: targetPath,
      });
    });
    if (targetPath) {
      Transforms.select(editor, targetPath);
    }
  },
};

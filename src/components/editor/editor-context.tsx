import { FC, PropsWithChildren, useState } from 'react';
import { Descendant } from 'slate';
import { Slate } from 'slate-react';
import { EditorStoreProvider } from '../../stores/editor.store';
import { createEditor } from './create-editor';

type Props = PropsWithChildren<{
  initialContent: Descendant[];
}>;

export const EditorContext: FC<Props> = (props) => {
  const [editor] = useState(() => createEditor());

  return (
    <Slate
      editor={editor}
      value={props.initialContent}
      onChange={(val) => {
        const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
        if (!isAstChange) return;
        editor.onContentChange();
        localStorage.setItem('editor-data', JSON.stringify(val));
      }}
    >
      <EditorStoreProvider>
        <div>{props.children}</div>
      </EditorStoreProvider>
    </Slate>
  );
};

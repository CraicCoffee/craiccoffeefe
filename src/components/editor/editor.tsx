import { useEditorStore } from '@/stores/editor.store';
import isHotkey, { compareHotkey } from 'is-hotkey';
import { createElement, FC, ReactElement, useCallback, useEffect } from 'react';
import { Editor as SlateEditor, Element, NodeEntry } from 'slate';
import { Editable, RenderElementProps, useSlate } from 'slate-react';
import { ContentContainer } from './content-container';
import { ElementComponent, elementConfigMap } from './elements';
import { handleBackspaceKey } from './handle-backspace-key';
import { handleEnterKey } from './handle-enter-key';
import { EditModeHoveringToolbar } from './hovering-toolbar/edit-mode-hovering-toolbar';
import { keyBindings } from './key-bindings';
import { renderLeaf } from './render-leaf';
import { SetNodeToDecorations } from './set-node-to-decorations';
import { Toolbar } from './toolbar';

export const Editor: FC<{
  mode: 'edit' | 'comment' | 'read';
}> = (props) => {
  const editor = useSlate();
  const renderElement = useCallback(function (props: RenderElementProps): ReactElement {
    const config = elementConfigMap[props.element.type];
    let Component: ElementComponent<any> | string = config?.component;
    if (Component === undefined) {
      Component = 'div';
      console.warn(`No config found for ${props.element.type}, fallback to div`);
    }
    return createElement(Component, props);
  }, []);

  useEffect(() => {
    SlateEditor.normalize(editor, {
      force: true,
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEnter(e)) {
        handleEnterKey(editor, e);
      }
      if (isBackspace(e)) {
        handleBackspaceKey(editor, e);
      }
      for (const [hotkey, handler] of keyBindings) {
        if (compareHotkey(hotkey, e)) {
          e.preventDefault();
          handler(editor);
          return;
        }
      }
    },
    [editor],
  );

  function handleDrag(e: any) {
    e.preventDefault();
    const top = 64;
    const bottom = window.innerHeight;
    const topDelta = top - e.clientY + 60;
    if (topDelta > 0) {
      // console.log(topDelta)
      // FIXME: why this feels laggy
      window.scrollTo({
        top: window.scrollY - topDelta * 2,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      const bottomDelta = e.clientY + 60 - bottom;
      // console.log(bottomDelta)
      if (bottomDelta > 0) {
        window.scrollTo({
          top: window.scrollY + bottomDelta * 2,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    console.log(e.dataTransfer.files[0]);
  }

  const editorStore = useEditorStore();

  const decorate = useCallback(
    ([node, path]: NodeEntry) => {
      if (Element.isElement(node) && node.type === 'code-line') {
        const ranges = editor.nodeToDecorations?.get(node) || [];
        return ranges;
      }

      return [];
    },
    [editor.nodeToDecorations],
  );

  return (
    <>
      {props.mode === 'edit' && (
        <>
          <Toolbar />
          <EditModeHoveringToolbar />
        </>
      )}
      <ContentContainer>
        <div>
          <SetNodeToDecorations />
          <Editable
            decorate={decorate}
            readOnly={props.mode !== 'edit'}
            onKeyDown={handleKeyDown}
            // onSelect={handleSelect}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onCompositionStart={() => {
              editorStore.compositionStart$.emit();
            }}
            onCompositionEnd={() => {
              editorStore.compositionEnd$.emit();
            }}
          />
        </div>
      </ContentContainer>
    </>
  );
};

const isEnter = isHotkey('enter');
const isBackspace = isHotkey('backspace');

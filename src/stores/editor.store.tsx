import { useEventEmitter, useLocalStorageState, useMemoizedFn } from 'ahooks';
import { createStore } from 'hox';
import { useSlate } from 'slate-react';

export type StyleConfig = {
  layout: 'default' | 'compact' | 'loose';
};

export const [useEditorStore, EditorStoreProvider] = createStore(() => {
  const editor = useSlate();

  const [styleConfig, setStyleConfig] = useLocalStorageState<StyleConfig>('editor-style-config', {
    defaultValue: {
      layout: 'default',
    },
  });
  const updateStyleConfig = useMemoizedFn((next: Partial<StyleConfig>) => {
    setStyleConfig({
      ...styleConfig,
      ...next,
    });
  });

  const compositionStart$ = useEventEmitter();
  const compositionEnd$ = useEventEmitter();

  return {
    editor,
    styleConfig,
    updateStyleConfig,
    compositionStart$,
    compositionEnd$,
  };
});

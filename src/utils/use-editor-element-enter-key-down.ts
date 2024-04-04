import isHotkey from 'is-hotkey';
import { useEffect } from 'react';
import { useFocused, useSelected } from 'slate-react';

const isEnter = isHotkey('enter');

export function useEditorElementEnterKeyDown(active: boolean, fn: () => void) {
  const selected = useSelected();
  const focused = useFocused();
  const allActive = selected && focused && active;
  useEffect(() => {
    if (!allActive) return;
    function handle(e: KeyboardEvent) {
      if (isEnter(e)) {
        e.stopPropagation();
        e.preventDefault();
        fn();
      }
    }
    document.addEventListener('keydown', handle, {
      capture: true,
    });
    return () => {
      document.removeEventListener('keydown', handle, {
        capture: true,
      });
    };
  }, [allActive]);
}

import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Editor, Range } from 'slate';
import { useSlate, useSlateSelection } from 'slate-react';
import styled from 'styled-components';
import { ToolbarButtonList } from '../toolbar-button-list';

const Container = styled.div`
  padding: 2px 12px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -4px;
  opacity: 0;
  border-radius: var(--border-radius-medium);
  transition: opacity 0.75s;
  background: var(--color-bg-2);
  box-shadow: 0px -1px 14px 0px rgba(0, 0, 0, 0.14);
`;

export const HoveringToolbar: FC<PropsWithChildren<{}>> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  const selection = useSlateSelection();

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    if (selection && !Range.isCollapsed(selection) && Editor.string(editor, selection) !== '') {
      const domSelection = window.getSelection();
      if (!domSelection) return;
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      el.style.opacity = '1';
      el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
      el.style.left = `${rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2}px`;
    }

    return () => {
      el.removeAttribute('style');
    };
  }, [selection]);

  return ReactDOM.createPortal(
    <Container
      ref={ref}
      onMouseDown={(e) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault();
      }}
    >
      <ToolbarButtonList>{props.children}</ToolbarButtonList>
    </Container>,
    document.body,
  );
};

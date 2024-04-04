import { FC, useState } from 'react';
import { Element, Node } from 'slate';
import { useReadOnly, useSelected } from 'slate-react';
import styled from 'styled-components';
import { useEditorStore } from '../../stores/editor.store';

export const PlaceholderText = styled.div<{
  content: string;
}>`
  display: block;
  position: relative;
  overflow: visible;
  opacity: 0.4;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    color: var(--color-text-4);
    cursor: text;
    content: '${(props) => props.content}';
  }
`;

export const ElmentPlaceholder: FC<{
  element: Element;
  content: string;
}> = (props) => {
  const isEmpty = props.element.children.length === 1 && Node.string(props.element) === '';

  const selected = useSelected();
  const editorStore = useEditorStore();
  const isReadOnly = useReadOnly();
  const [compositing, setCompositing] = useState(false);
  editorStore.compositionStart$.useSubscription(() => {
    setCompositing(selected);
  });
  editorStore.compositionEnd$.useSubscription(() => {
    setCompositing(false);
  });

  return isEmpty && !isReadOnly && !compositing ? (
    <PlaceholderText content={props.content} />
  ) : null;
};

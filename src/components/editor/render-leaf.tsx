import { RenderLeafProps } from 'slate-react';
import { CSSProperties } from 'styled-components';

export function renderLeaf(props: RenderLeafProps) {
  const style: CSSProperties = {};
  const { leaf } = props;
  if (leaf.bold) {
    style.fontWeight = 'bold';
  }
  if (leaf.italic) {
    style.fontStyle = 'italic';
  }
  if (leaf.sup) {
    style.verticalAlign = 'super';
    style.fontSize = '0.6em';
  }
  if (leaf.sub) {
    style.verticalAlign = 'sub';
    style.fontSize = '0.6em';
  }
  if (leaf.underline) {
    style.textDecoration = 'underline';
  }
  const dataAttributes: any = {};
  for (const key in leaf) {
    if (key.startsWith('comment-id-')) {
      dataAttributes[`data-${key}`] = 'true';
    }
  }
  return (
    <span
      {...props.attributes}
      {...dataAttributes}
      className={Object.keys(leaf).join(' ')}
      style={style}
    >
      {props.children}
    </span>
  );
}

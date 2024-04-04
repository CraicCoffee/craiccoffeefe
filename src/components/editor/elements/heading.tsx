import { createElement } from 'react';
import { CustomInlineElement, ElementComponent } from '.';
import { CustomText } from '../editor-types';

export type HeadingElement = {
  type: 'heading';
  children: (CustomText | CustomInlineElement)[];
  level: 1 | 2 | 3;
};

export function createHeadingElement(level: HeadingElement['level']): HeadingElement {
  return {
    type: 'heading',
    children: [{ text: '' }],
    level,
  };
}

export const Heading: ElementComponent<HeadingElement> = (props) => {
  const tag = `h${props.element.level}`;
  return createElement(tag, props.attributes, props.children);
};

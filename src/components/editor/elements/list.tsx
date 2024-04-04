import React from 'react';
import { ElementComponent } from '.';
import { createListItemElement, ListItemElement } from './list-item';

export type ListElement = {
  type: 'list';
  ordered: boolean;
  children: ListItemElement[];
};

export function createListElement(ordered: boolean): ListElement {
  return {
    type: 'list',
    ordered,
    children: [createListItemElement()],
  };
}

export const List: ElementComponent<ListElement> = (props) => {
  return React.createElement(
    props.element.ordered ? 'ol' : 'ul',
    {
      ...props.attributes,
    },
    props.children,
  );
};

import { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import { Chart, ChartElement } from './chart';
import { Code, CodeElement } from './code';
import { CodeLine, CodeLineElement } from './code-line';
import { Heading, HeadingElement } from './heading';
import { List, ListElement } from './list';
import { ListItem, ListItemElement } from './list-item';
import { Paragraph, ParagraphElement } from './paragraph';
import { Title, TitleElement } from './title';

export type ElementComponentProps<T> = RenderElementProps & {
  element: T;
};

export type ElementComponent<T> = FC<ElementComponentProps<T>>;

type ElementConfig = {
  component: ElementComponent<any>;
  isInline?: boolean;
  isVoid?: boolean;
};

export const elementConfigMap: Record<string, ElementConfig> = {
  title: {
    component: Title,
  },
  paragraph: {
    component: Paragraph,
  },
  heading: {
    component: Heading,
  },
  list: {
    component: List,
  },
  'list-item': {
    component: ListItem,
  },
  code: {
    component: Code,
  },
  'code-line': {
    component: CodeLine,
  },
  chart: {
    component: Chart,
  },
};

export type CustomInlineElement = never;

export type CustomBlockElement =
  | TitleElement
  | ParagraphElement
  | HeadingElement
  | ListElement
  | ListItemElement
  | CodeElement
  | CodeLineElement
  | ChartElement;

export type CustomElement = CustomBlockElement | CustomInlineElement;

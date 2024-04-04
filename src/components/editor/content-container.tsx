import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { StyleConfig, useEditorStore } from '../../stores/editor.store';

const fontSizeRecord: Record<StyleConfig['layout'], string> = {
  compact: '16px',
  default: '18px',
  loose: '20px',
};

const lineHeightRecord: Record<StyleConfig['layout'], string> = {
  compact: '1.5',
  default: '1.6',
  loose: '1.8',
};

const Container = styled.div<{
  config: StyleConfig;
}>`
  font-family: Helvetica, Arial, sans-serif;
  font-size: ${(p) => fontSizeRecord[p.config.layout]};
  text-align: justify;
  line-height: ${(p) => lineHeightRecord[p.config.layout]};
  color: var(--color-text-1);
  padding-top: 20px;

  h1 {
    font-size: 1.6em;
  }

  h2 {
    font-size: 1.4em;
  }

  h3 {
    font-size: 1.2em;
  }

  p {
    margin-bottom: 0.6em;
  }

  table,
  th,
  td {
    border: 1px solid;
  }
  table {
    width: 100%;
    margin-bottom: 1em;
    border-collapse: collapse;
  }
  tr {
    width: 100%;
  }
  td {
    min-width: 20px;
    padding: 1em;
  }

  div[role='textbox'] {
    padding-bottom: 200px;
  }

  /**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */

  code[class*='language-'],
  pre[class*='language-'] {
    color: black;
    line-height: 1.5;
    white-space: pre;
    text-align: left;
    text-shadow: 0 1px white;
    word-wrap: normal;
    word-break: normal;
    word-spacing: normal;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    background: none;
  }

  pre[class*='language-']::-moz-selection,
  pre[class*='language-'] ::-moz-selection,
  code[class*='language-']::-moz-selection,
  code[class*='language-'] ::-moz-selection {
    text-shadow: none;
    background: #b3d4fc;
  }

  pre[class*='language-']::selection,
  pre[class*='language-'] ::selection,
  code[class*='language-']::selection,
  code[class*='language-'] ::selection {
    text-shadow: none;
    background: #b3d4fc;
  }

  @media print {
    code[class*='language-'],
    pre[class*='language-'] {
      text-shadow: none;
    }
  }

  /* Code blocks */
  pre[class*='language-'] {
    margin: 0.5em 0;
    padding: 1em;
    overflow: auto;
  }

  :not(pre) > code[class*='language-'],
  pre[class*='language-'] {
    background: #f5f2f0;
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    padding: 0.1em;
    white-space: normal;
    border-radius: 0.3em;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: slategray;
  }

  .token.punctuation {
    color: #999;
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #905;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #690;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #9a6e3a;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #07a;
  }

  .token.function,
  .token.class-name {
    color: #dd4a68;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #e90;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;

export const ContentContainer: FC<PropsWithChildren<{}>> = (props) => {
  const { styleConfig } = useEditorStore();
  return <Container config={styleConfig}>{props.children}</Container>;
};

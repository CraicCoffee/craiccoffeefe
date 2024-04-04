import { normalizeTokens } from '@/utils/normalize-tokens';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import { memo } from 'react';
import { BaseRange, Editor, Element, Node, NodeEntry } from 'slate';
import { useSlate } from 'slate-react';
import { CodeElement } from './elements/code';

export const SetNodeToDecorations = memo(() => {
  const editor = useSlate();

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: 'highest',
      match: (n) => Element.isElement(n) && n.type === 'code',
    }),
  ) as NodeEntry<CodeElement>[];

  const nodeToDecorations = mergeMaps(...blockEntries.map(getChildNodeToDecorations));

  editor.nodeToDecorations = nodeToDecorations;

  return null;
});

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<CodeElement>) => {
  const nodeToDecorations = new Map<Element, BaseRange[]>();

  const text = block.children.map((line) => Node.string(line)).join('\n');
  // const language = block.language
  const language = 'js'; // TODO: use user selected
  console.log(Prism.languages);
  console.log('Prism.languages[language]', Prism.languages[language]);
  const tokens = Prism.tokenize(text, Prism.languages[language]);
  const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
  const blockChildren = block.children as Element[];

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index];
    const element = blockChildren[index];

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }

    let start = 0;
    for (const token of tokens) {
      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map((type) => [type, true])),
      };

      nodeToDecorations.get(element)!.push(range);

      start = end;
    }
  }

  return nodeToDecorations;
};

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>();

  for (const m of maps) {
    for (const item of m) {
      map.set(...item);
    }
  }

  return map;
};

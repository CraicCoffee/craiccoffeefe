import { Editor, NodeEntry } from 'slate';
import { codeNormalization } from './code-normalization';
import { listNormalization } from './list-normalization';
import { paragraphNormalization } from './paragraph-normalization';
import { rootNormalization } from './root-normalization';
import { titleNormalization } from './title-normalization';

export type Normalization = (entry: NodeEntry, editor: Editor) => true | undefined;

export const allNormalizations: Normalization[] = [
  rootNormalization,
  titleNormalization,
  paragraphNormalization,
  listNormalization,
  codeNormalization,
];

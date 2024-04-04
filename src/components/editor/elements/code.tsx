import styled from 'styled-components';
import { ElementComponent } from '.';
import { CodeLineElement, createCodeLineElement } from './code-line';

export type CodeElement = {
  type: 'code';
  children: CodeLineElement[];
};

export function createCodeElement(): CodeElement {
  return {
    type: 'code',
    children: [createCodeLineElement()],
  };
}

const StyledCode = styled.code`
  font-family: Monaco, 'Courier New', Courier, monospace;
  font-size: 0.8em;
  background-color: var(--color-fill-2);
  border-radius: 12px;

  display: block;
  padding: 16px;
  margin: 8px;
  position: relative;

  /* white-space: nowrap;
  overflow-x: scroll;
  > span {
    display: block;
    padding: 0 20px;
    width: fit-content;
  } */
`;

export const Code: ElementComponent<CodeElement> = (props) => {
  return (
    <StyledCode {...props.attributes} spellCheck={false}>
      {/* <LanguageSelect
      value={element.language}
      onChange={e => setLanguage(e.target.value)}
    /> */}
      {props.children}
    </StyledCode>
  );
};

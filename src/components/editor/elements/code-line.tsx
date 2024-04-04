import styled from 'styled-components';
import { ElementComponent } from '.';
import { CustomText } from '../editor-types';

export type CodeLineElement = {
  type: 'code-line';
  children: CustomText[];
};

export function createCodeLineElement(): CodeLineElement {
  return {
    type: 'code-line',
    children: [{ text: '' }],
  };
}

const StyledSpan = styled.span`
  display: block;
`;

export const CodeLine: ElementComponent<CodeLineElement> = (props) => {
  return <StyledSpan {...props.attributes}>{props.children}</StyledSpan>;
};

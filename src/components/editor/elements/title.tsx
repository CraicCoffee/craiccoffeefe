import { Node } from 'slate';
import styled from 'styled-components';
import { ElementComponent } from '.';
import { CustomText } from '../editor-types';
import { PlaceholderText } from '../placeholder-text';

const Container = styled.div`
  font-size: 36px;
  font-weight: bold;
  padding: 16px 0 8px;
  line-height: 1.2;
  text-align: left;
`;

export type TitleElement = {
  type: 'title';
  children: CustomText[];
};

export const emptyTitleElement: TitleElement = {
  type: 'title',
  children: [{ text: '' }],
};

export const Title: ElementComponent<TitleElement> = (props) => {
  const isEmpty = props.element.children.length === 1 && Node.string(props.element) === '';
  return (
    <Container {...props.attributes}>
      {isEmpty && <PlaceholderText content="请输入标题" />}
      {props.children}
    </Container>
  );
};

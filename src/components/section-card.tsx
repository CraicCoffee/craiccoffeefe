import { Card } from 'antd';
import { FC, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
`;

export const SectionCard: FC<
  PropsWithChildren<{
    title: ReactNode;
    extra?: ReactNode;
  }>
> = (props) => {
  return (
    <Card>
      <Header>
        <h3 className="mb-0">{props.title}</h3>
        <div>{props.extra}</div>
      </Header>
      {props.children}
    </Card>
  );
};

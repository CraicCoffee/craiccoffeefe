import type { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  //overflow: hidden; // 会导致图表的 tooltip 溢出部分无法显示
`;

const PlaceholderContent = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  pointer-events: none;
  color: rgba(0, 0, 0, 0.4);
`;

type Props = PropsWithChildren<{
  active: boolean;
  message: string;
}>;
export const EmptyPlaceholder: FC<Props> = (props) => {
  return (
    <Container>
      {props.active && <PlaceholderContent>{props.message}</PlaceholderContent>}
      {props.children}
    </Container>
  );
};

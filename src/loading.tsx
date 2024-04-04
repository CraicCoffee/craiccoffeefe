import { Skeleton } from 'antd';
import { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
`;

const LoadingPlaceholder: FC = () => {
  return (
    <Container>
      <Skeleton />
    </Container>
  );
};

export default LoadingPlaceholder;

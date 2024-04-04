import { useLockFn } from 'ahooks';
import { Spin } from 'antd';
import React, { ReactNode, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import styled from 'styled-components';

const SpinContainer = styled.div`
  text-align: center;
  padding: 4px;
`;

type Props<T> = {
  fetchPage: (pageToken: string) => Promise<{
    items: T[];
    nextPageToken: string;
  }>;
  children: (items: T[]) => ReactNode;
  useWindow?: boolean;
};
export function InfiniteScrollContent<T>(props: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageTokenRef = useRef('');

  const loadNextPage = useLockFn(async () => {
    const { nextPageToken, items } = await props.fetchPage(pageTokenRef.current);
    if (!nextPageToken) {
      setHasMore(false);
    }
    pageTokenRef.current = nextPageToken;
    setItems((prev) => [...prev, ...items]);
  });

  const useWindow = props.useWindow ?? true;

  const element = (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => {
        // 为了避免和 useLockFn 出现一些奇怪的冲突问题，只能先这样临时解决了
        setTimeout(() => {
          loadNextPage();
        }, 50);
      }}
      initialLoad={true}
      hasMore={hasMore}
      loader={
        <SpinContainer key="spin">
          <Spin />
        </SpinContainer>
      }
      useWindow={useWindow}
    >
      <React.Fragment key="content">
        {(items.length > 0 || !hasMore) && props.children(items)}
      </React.Fragment>
    </InfiniteScroll>
  );

  return useWindow ? (
    element
  ) : (
    <div
      style={{
        height: 500,
        overflowY: 'scroll',
      }}
    >
      {element}
    </div>
  );
}

import React, { memo } from 'react';

interface Props {
  name: string;
}

export const IconFont = memo<Props>((props) => {
  return <i className={`iconfont icon-${props.name}`} />;
});

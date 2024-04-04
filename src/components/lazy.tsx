import { FC, PropsWithChildren, useEffect, useState } from 'react';

type Props = PropsWithChildren<{
  active: boolean;
}>;

export const Lazy: FC<Props> = (props) => {
  const [activated, setActivated] = useState(props.active);
  useEffect(() => {
    if (props.active) {
      setActivated(true);
    }
  }, [props.active]);


  return props.active || activated ? (
    <div
      style={{
        display: props.active ? 'block' : 'none',
      }}
    >
      {props.children}
    </div>
  ) : null;
};

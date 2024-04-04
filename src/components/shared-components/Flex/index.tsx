import { FC, PropsWithChildren } from 'react';

const Flex: FC<
  PropsWithChildren<{
    className?: string;
    alignItems?: string;
    flexDirection?: string;
    justifyContent?: string;
    mobileFlex?: boolean;
  }>
> = (props) => {
  const { children, className, alignItems, justifyContent, mobileFlex, flexDirection } = props;
  const getFlexResponsive = () => (mobileFlex ? 'd-flex' : 'd-md-flex');
  return (
    <div
      className={`${getFlexResponsive()} ${className} ${
        flexDirection ? 'flex-' + flexDirection : ''
      } ${alignItems ? 'align-items-' + alignItems : ''} ${
        justifyContent ? 'justify-content-' + justifyContent : ''
      }`}
    >
      {children}
    </div>
  );
};

Flex.defaultProps = {
  mobileFlex: true,
  flexDirection: 'row',
  className: '',
};

export default Flex;

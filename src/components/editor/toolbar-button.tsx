import { Button, ButtonProps, Tooltip } from 'antd';
import { FC, PropsWithChildren, useState } from 'react';
import styled from 'styled-components';

const ProxyButton: FC<ButtonProps> = (props) => {
  const passedProps: any = {
    ...props,
    active: undefined,
  };
  return <Button {...passedProps} />;
};

const InnerButton = styled(ProxyButton).attrs({
  type: 'text',
})<{
  active?: boolean;
  disabled?: boolean;
}>`
  &,
  &:hover {
    color: ${(p) => (p.disabled ? 'var(--color-text-4)' : 'var(--color-text-2)')} !important;
  }

  ${({ active }) => active && 'background: rgba(0, 0, 0, 0.1) !important;'}
  &.basic {
    @media (max-width: 800px) {
      display: none;
    }
  }
  height: 38px;
  width: 38px;
  box-sizing: content-box;
  line-height: 1;
  font-size: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0;

  > span {
    font-size: 16px;
  }
`;

const Shortcut = styled.span`
  display: inline-block;
  background: rgba(128, 128, 128, 0.3);
  color: rgb(var(--primary-4));
  border-radius: 4px;
  padding: 0 4px;
  margin-left: 8px;
`;

type Props = PropsWithChildren<{
  description?: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  basic?: boolean;
  onClick?: () => void;
}>;

export const ToolbarButton: FC<Props> = ({
  description,
  shortcut,
  active,
  disabled,
  basic,
  onClick,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <Tooltip
      popupVisible={Boolean(description) && visible}
      overlay={
        description && (
          <>
            {description}
            {shortcut && <Shortcut>{shortcut}</Shortcut>}
          </>
        )
      }
    >
      <InnerButton
        active={active}
        disabled={disabled}
        className={basic ? 'basic' : ''}
        onClick={onClick}
        onMouseEnter={() => {
          setVisible(true);
        }}
        onMouseLeave={() => {
          setVisible(false);
        }}
      >
        {children}
      </InnerButton>
    </Tooltip>
  );
};

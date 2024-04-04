import { hashStringToColor } from '@/utils/hash-string-to-color';
import { Avatar, AvatarProps } from 'antd';
import { FC } from 'react';

type Props = {
  user: API.CurrentUser;
  size?: AvatarProps['size'];
};

export const AutomaticAvatar: FC<Props> = (props) => {
  const { user } = props;
  return (
    <Avatar
      size={props.size ?? 'default'}
      src={user.avatar}
      alt="avatar"
      style={{ background: hashStringToColor(user.name!), color: '#ffffff' }}
    >
      {user.name!.slice(0, 2)}
    </Avatar>
  );
};

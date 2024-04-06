import { hashStringToColor } from '@/utils/hash-string-to-color';
import { Avatar, AvatarProps } from 'antd';
import {FC, useState} from 'react';

type Props = {
  user: API.CurrentUser;
  size?: AvatarProps['size'];
};

export const AutomaticAvatar: FC<Props> = (props) => {
  const { user, size } = props;

  // 使用state来跟踪是否应该显示默认头像
  const [showDefaultAvatar, setShowDefaultAvatar] = useState(false);

  // 根据用户提供的avatar和showDefaultAvatar状态来确定展示的内容
  const avatarContent = showDefaultAvatar || !user.avatar
      ? user.email ? user.email.slice(0, 2).toUpperCase() : '??'
      : <img src={user.avatar} alt="avatar" onError={() => setShowDefaultAvatar(true)} />;

  return (
      <Avatar
          size={size ?? 'default'}
          style={{
            background: showDefaultAvatar || !user.avatar ? hashStringToColor(user.email!) : 'transparent',
            color: '#ffffff'
          }}
      >
        {avatarContent}
      </Avatar>
  );
};

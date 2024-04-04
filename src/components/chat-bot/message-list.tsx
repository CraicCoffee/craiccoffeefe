import { useUserStore } from '@/stores/user.store';
import { ThunderboltOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { FC } from 'react';
import styled from 'styled-components';
import { AutomaticAvatar } from '../automatic-avatar';
import { BotMessage } from './bot-message';
import { ChatMessage } from './types';

const Container = styled.div`
  height: 100%;
  padding-top: 4px;
  padding-bottom: 24px;
  overflow-y: auto;
`;

const Item = styled.div<{ role: ChatMessage['role'] }>`
  background-color: ${(p) => (p.role === 'user' ? '#f8f8f8' : 'inherit')};
  padding: 20px 16px;
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex: none;
  padding-right: 12px;
`;

const Right = styled.div`
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: pre-wrap;
  min-width: 0;
  line-height: 1.6;
`;

type Props = {
  messages: ChatMessage[];
  onQuickReplyClicked: (option: string) => void;
};
export const MessageList: FC<Props> = (props) => {
  const { user } = useUserStore();
  return (
    <Container id="chat-message-list">
      {props.messages.map((message, index) => (
        <Item key={index} role={message.role}>
          <Left>
            {message.role === 'bot' ? (
              <Avatar
                size={36}
                alt="avatar"
                style={{ background: '#007bc7', color: '#ffffff', fontSize: '18px' }}
              >
                <ThunderboltOutlined />
              </Avatar>
            ) : (
              <AutomaticAvatar size={36} user={user!} />
            )}
          </Left>
          <Right>
            {message.role === 'bot' ? (
              <BotMessage message={message} onQuickReplyClicked={props.onQuickReplyClicked} />
            ) : (
              <div>{message.content}</div>
            )}
          </Right>
        </Item>
      ))}
    </Container>
  );
};

import { DownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { FC, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { MessageList } from './message-list';
import { mockBotMessages } from './mock-messages';
import { ChatMessage } from './types';

const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 12px;
  overflow: visible;
`;

const BubbleButton = styled.a`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bc7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    background-color: #0065a3;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  &:active {
    background-color: #003f66;
  }
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  > .anticon {
    display: block;
    color: #ffffff;
    font-size: 28px;
  }
`;

const CardBody = styled.div`
  min-height: 0;
`;
const CardFooter = styled.div`
  height: 72px;
  border-top: 1px solid #e8e8e8;
`;

const ChatInput = styled.textarea`
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 16px;
  &::placeholder {
    color: inherit;
    opacity: 0.5;
  }
`;

const Card = styled.div<{ opened: boolean }>`
  width: 450px;
  height: 700px;
  max-height: calc(100vh - 160px);
  position: absolute;
  right: 0;
  bottom: 100%;
  background-color: #ffffff;
  transform: translateY(-16px);
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  > ${CardBody} {
    flex: auto;
  }
  > ${CardFooter} {
    flex: none;
  }
  ${(p) =>
    !p.opened &&
    css`
      display: none;
    `};
`;

type Props = {};
export const ChatBot: FC<Props> = (props) => {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: '你好，我是 InsightMon 智能分析机器人，有什么可以帮助你的吗？' },
  ]);
  // const [messages, setMessages] = useState<ChatMessage[]>(mockBotMessages);
  const mockBotMessageIndexRef = useRef(0);

  function submitMessage(content: string) {
    setMessages((prev) => [...prev, { role: 'user', content: content }]);
    const botMessage = mockBotMessages[mockBotMessageIndexRef.current];
    if (!botMessage) return;
    setMessages((prev) => [...prev, botMessage]);
    mockBotMessageIndexRef.current++;
  }

  return (
    <Container>
      <BubbleButton
        onClick={() => {
          setOpened(!opened);
        }}
      >
        {opened ? <DownOutlined /> : <ThunderboltOutlined />}
      </BubbleButton>
      <Card opened={opened}>
        <CardBody>
          <MessageList
            messages={messages}
            onQuickReplyClicked={(option) => {
              submitMessage(option);
            }}
          />
        </CardBody>
        <CardFooter>
          <ChatInput
            placeholder="和 InsightMon 智能运维助手对话…"
            onKeyUp={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // TODO: 处理 shift + enter 换行 & 输入法时按 enter 不提交
                submitMessage(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
        </CardFooter>
      </Card>
    </Container>
  );
};

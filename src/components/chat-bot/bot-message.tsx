import LineChartWidget from '@/pages/metric/components/LineChartWidget';
import { Button, Space } from 'antd';
import { FC, useEffect, useLayoutEffect, useState } from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';
import { ChatMessage } from './types';

const Cursor = styled.div`
  display: inline-block;
  height: 1em;
  width: 0.25em;
  background-color: currentColor;
  vertical-align: -0.125em;
  margin-left: 0.1em;
`;

const ExtraItem = styled.div`
  padding-top: 20px;
  width: 100%;
`;

const enableTypingEffect = true;
// const enableTypingEffect = false;

type Props = {
  message: ChatMessage;
  onQuickReplyClicked: (option: string) => void;
};

export const BotMessage: FC<Props> = (props) => {
  const [current, setCurrent] = useState(enableTypingEffect ? '' : props.message.content);
  const [typeFinished, setTypeFinished] = useState(enableTypingEffect ? false : true);
  useEffect(() => {
    if (current === props.message.content) return;
    let i = 0;
    async function randomTypeContent() {
      await sleep(Math.random() * 1000 + 1500);
      while (true) {
        if (Math.random() < 0.03) {
          await sleep(Math.random() * 1000 + 300);
        } else {
          await sleep(20);
        }
        setCurrent(props.message.content.slice(0, i));
        i++;
        if (i > props.message.content.length) {
          setTypeFinished(true);
          break;
        }
      }
    }
    randomTypeContent();
  }, []);

  useLayoutEffect(() => {
    const element = document.getElementById('chat-message-list') as
      | HTMLDivElement
      | null
      | undefined;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  });

  return (
    <div>
      {current}
      {!typeFinished && <Cursor />}
      {typeFinished && props.message.extra && (
        <>
          {props.message.extra.map((item, index) => {
            let element: ReactElement | null = null;
            if (item.type === 'metric-chart') {
              element = (
                <LineChartWidget
                  dataSource={item.data}
                  customConfig={{
                    height: 200,
                    ...item.customConfig,
                  }}
                />
              );
            } else if (item.type === 'quick-reply') {
              element = (
                <Space>
                  {item.options.map((option) => (
                    <Button
                      key={option}
                      size="small"
                      onClick={() => {
                        props.onQuickReplyClicked(option);
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </Space>
              );
            }
            return <ExtraItem key={index}>{element}</ExtraItem>;
          })}
        </>
      )}
    </div>
  );
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

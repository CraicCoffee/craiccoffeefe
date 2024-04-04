import { RightOutlined as RawRightOutlined } from '@ant-design/icons';
import { Card, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const { TextArea } = Input;

const Container = styled(Card)<{ readonly?: boolean }>`
  background-color: ${(props) => (props.readonly ? '#ebeaea' : 'unset')};
  .ant-card-head {
    height: 40px;
    padding: 0 10px;
    font-size: 14px;
    line-height: 40px;
    background-color: #ebeaea;

    .ant-card-head-wrapper {
      padding: 0 10px;
      border-bottom: ${(props) => (props.readonly ? '1px solid #bbbbbb' : 'unset')};
    }

    .ant-card-head-title {
      padding: 0;
      color: #979797;
      font-weight: normal;
    }
  }
`;

const RightOutlined = styled(RawRightOutlined)`
  color: #979797;
  margin-right: 14px;
`;

/**
 * @link API.CompositeAlarmRule
 */
export type AlarmRule = {
  /** alarm uuid */
  alarmName: string;
  /** 告警状态 */
  stateValue: 'OK' | 'ALARM' | 'NO_DATA';
  /** 运算符，最后一个 rule 不需要填 */
  operator?: 'AND' | 'OR' | 'AND NOT';
  /** 括号 */
  parentheses?: string;
};

type AlarmRuleProps = {
  alarmRules: AlarmRule[] | string;
  readonly?: boolean;
  hideTitle?: boolean;
  onChange?: (alarmRules: string) => void;
};

const keywordColorMap: Record<string, string> = {
  OK: 'red',
  ALARM: 'red',
  NO_DATA: 'red',
  AND: '#4690ed',
  OR: '#4690ed',
  'AND NOT': '#4690ed',
};

/**
 * 请求(响应)数据和需要在页面上展示的关键字的映射
 */
const keywordMap: Record<string, string> = {
  OK: 'OK',
  ALARM: 'ALARM',
  NO_DATA: 'INSUFFICIENT_DATA',
  AND: 'AND',
  OR: 'OR',
  'AND NOT': 'AND_NOT',

  // aws to local
  INSUFFICIENT_DATA: 'NO_DATA',
  AND_NOT: 'AND NOT',
};

/**
 * 校验括号是否匹配
 * (), ()(), (())
 */
export const validParenthesesIsBalanced = (input: string) => {
  const stack = [];
  const openingParentheses = '(';
  const closingParentheses = ')';

  for (const char of input) {
    if (openingParentheses.includes(char)) {
      stack.push(char);
    } else if (closingParentheses.includes(char)) {
      const matchingOpening = openingParentheses[closingParentheses.indexOf(char)];
      if (stack.length === 0 || stack[stack.length - 1] !== matchingOpening) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
};

/**
 * 将告警规则对象转换为请求参数 CompositeAlarmRule
 */
export const convertToRequestAlarmRules = (alarmRules: AlarmRule[]): API.CompositeAlarmRule[] => {
  return alarmRules.map((rule) => ({
    alarmName: rule.alarmName,
    stateValue: keywordMap[rule.stateValue] as API.CompositeAlarmRule['stateValue'],
    operator: rule.operator
      ? (keywordMap[rule.operator] as API.CompositeAlarmRule['operator'])
      : undefined,
    parentheses: rule.parentheses,
  }));
};

/**
 * 将响应数据 CompositeAlarmRule 转换为告警规则对象
 */
export const convertToAlarmRules = (alarmRules: API.CompositeAlarmRule[]): AlarmRule[] => {
  const arr = alarmRules.map((rule) => ({
    alarmName: rule.alarmName,
    stateValue: keywordMap[rule.stateValue] as AlarmRule['stateValue'],
    operator: rule.operator ? (keywordMap[rule.operator] as AlarmRule['operator']) : undefined,
    parentheses: rule.parentheses,
  }));
  return arr;
};

/**
 * 将告警规则字符串转换为告警规则对象
 */
export const convertAlarmRules = (val: string) => {
  const alarmRuleList: AlarmRule[] = [];
  const alarmRuleStr = val.replaceAll(/[\s]+/g, ' ');
  if (!alarmRuleStr || alarmRuleStr.trim() === '') {
    return Promise.resolve(alarmRuleList);
  }

  const regex = /(\(*)?(OK|ALARM|NO_DATA|NO DATA)\("([^"]+)"\)(\)*)?(?: (AND NOT|AND|OR))?/g;
  let match = regex.exec(alarmRuleStr);
  let lastIndex = 0;
  let result = '';
  while (match) {
    const [, openingParentheses, stateValue, alarmName, closingParentheses, operator] = match;
    const parentheses = openingParentheses || closingParentheses || null;

    const alarmRule: AlarmRule = {
      alarmName,
      stateValue: (stateValue === 'NO DATA' ? 'NO_DATA' : stateValue) as AlarmRule['stateValue'],
      operator: operator as AlarmRule['operator'],
      parentheses: parentheses ? parentheses : '',
    };
    alarmRuleList.push(alarmRule);
    result += match[0] + ' ';
    lastIndex = regex.lastIndex;
    match = regex.exec(alarmRuleStr);
  }
  result = result.trim();
  // console.log(result, alarmRuleStr, lastIndex, alarmRuleStr.length)
  if (!(result === alarmRuleStr && lastIndex === alarmRuleStr.length)) {
    return Promise.reject('告警规则格式错误');
  }
  const parentheses = alarmRuleList.map((rule) => rule.parentheses).join('');
  if (!validParenthesesIsBalanced(parentheses)) {
    return Promise.reject('括号个数不匹配');
  }
  // 去除最后一个 rule 的 operator
  if (alarmRuleList.length > 0) {
    alarmRuleList[alarmRuleList.length - 1].operator = undefined;
  }
  return Promise.resolve(alarmRuleList);
};

const AlarmRuleComponent: React.FC<AlarmRuleProps> = ({
  alarmRules,
  readonly = false,
  hideTitle = false,
  onChange,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (readonly) return;
    if (typeof alarmRules !== 'string') return;
    if (alarmRules === text) return;
    setText(alarmRules as string);
    if (onChange) {
      onChange(alarmRules as string);
    }
  }, [alarmRules, readonly]);

  const renderStyledText = (alarmRuleList: AlarmRule[]) => {
    return alarmRuleList.map((rule) => {
      // console.log(rule);
      const leftParenthesis = rule.parentheses?.startsWith('(');
      const rightParenthesis = rule.parentheses?.startsWith(')');
      return (
        <>
          <RightOutlined />
          {leftParenthesis && rule.parentheses}
          <span style={{ color: keywordColorMap[rule.stateValue as string] }}>
            {rule.stateValue}
          </span>
          <span>{`("${rule.alarmName}")`}</span>
          {rightParenthesis && rule.parentheses}
          {rule.operator && (
            <>
              &nbsp;
              <span style={{ color: keywordColorMap[rule.operator as string] }}>
                {rule.operator}
              </span>
            </>
          )}
          &nbsp;
          <br />
        </>
      );
    });
  };

  return (
    <Container
      title={
        !hideTitle && '请使用 AND/OR/AND NOT 进行规则表达式的配置（注意请勿使用重复的告警名称）'
      }
      readonly={readonly}
    >
      {readonly ? (
        <div>{renderStyledText(alarmRules as AlarmRule[])}</div>
      ) : (
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          onBlur={() => {
            if (onChange) {
              setText(text.trim());
              onChange(text.trim());
            }
          }}
        />
      )}
    </Container>
  );
};

export default AlarmRuleComponent;

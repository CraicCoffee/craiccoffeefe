import { TIME } from '@/constants';
import { useIntl } from '@umijs/max';
import { Select, Tag } from 'antd';
import type { FC } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};
export const MetricTimeSelect: FC<Props> = (props) => {
  const intl = useIntl();
  return (
    <Select value={props.value} style={{ width: 220 }} onChange={props.onChange}>
      {TIME.map((item) => (
        <Select.Option value={item.value} key={item.label}>
          <Tag color="#ffa940">{item.value}</Tag>
          {intl.formatMessage({
            id: item.label,
            defaultMessage: item.label,
          })}
        </Select.Option>
      ))}
    </Select>
  );
};

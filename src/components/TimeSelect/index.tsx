import { TIME } from '@/constants';
import { getTimeRange } from '@/pages/metric/utils';
import { useIntl } from '@umijs/max';
import { Select, Tag } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

type Props = {
  onChange: any;
  initSelectTime?: string;
  timeRange?: typeof TIME;
};

const TimeSelect: FC<Props> = ({ onChange, initSelectTime = '3h', timeRange = TIME }) => {
  const intl = useIntl();
  const [selectTime, setSelectTime] = useState(initSelectTime);

  function handleChange(value: string) {
    setSelectTime(value);
  }

  // timeRange 变化时，重置 selectTime
  useEffect(() => {
    // selectTime 不存在于 timeRange 中时，重置为 timeRange 的最后一个
    if (!timeRange.find((item) => item.value === selectTime)) {
      setSelectTime(timeRange[timeRange.length - 1].value);
    }
  }, [selectTime, timeRange.length]);

  useEffect(() => {
    const { startTime, endTime } = getTimeRange(selectTime);
    onChange({ startTime, endTime, selectTime });
  }, [onChange, selectTime]);

  const options = timeRange.map((item) => ({
    value: item.value,
    label: (
      <>
        <Tag color="#ffa940">{item.value}</Tag>
        {intl.formatMessage({
          id: item.label,
          defaultMessage: item.label,
        })}
      </>
    ),
  }));

  return (
    <Select
      defaultValue={selectTime}
      value={selectTime}
      style={{ width: 220, margin: 10 }}
      onChange={handleChange}
      options={options}
    />
  );
};
export default TimeSelect;

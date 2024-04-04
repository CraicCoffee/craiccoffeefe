import { Badge, Calendar } from 'antd';
import { Component } from 'react';

function getListData(value) {
  console.log('value', value);
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'error', content: '1次拨测失败' },
        { type: 'success', content: '143次拨测成功' },
      ];
      break;
    case 10:
      listData = [
        { type: 'error', content: '4次拨测失败' },
        { type: 'success', content: '140次拨测成功' },
      ];
      break;
    case 15:
      listData = [
        { type: 'error', content: '8次拨测失败' },
        { type: 'success', content: '280次拨测成功' },
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map((item) => (
        <li key={item.content}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  );
}

function getMonthData(value) {
  if (value.month() === 7) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month" style={{ fontSize: '16px' }}>
      <section style={{ fontSize: '16px' }}>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

export class NoticeCalendar extends Component {
  render() {
    return <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />;
  }
}

export default NoticeCalendar;

import DemoCard from '@/components/util-components/DemoCard';
import { Component } from 'react';
import NoticeCalendarMd from './markdown/notice-calendar.md';
import NoticeCalendar from './NoticeCalendar';

export class CalendarComponent extends Component {
  render() {
    return (
      <div className="code-box-calendar-demo">
        <div className="calendar-notice">
          <DemoCard code={NoticeCalendarMd}>
            <NoticeCalendar />
          </DemoCard>
        </div>
      </div>
    );
  }
}

export default CalendarComponent;

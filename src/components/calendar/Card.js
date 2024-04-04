import { Calendar } from 'antd';
import { Component } from 'react';

function onPanelChange(value, mode) {
  console.log(value, mode);
}

export class Card extends Component {
  render() {
    return (
      <div className="border rounded" style={{ width: 320 }}>
        <Calendar fullscreen={false} onPanelChange={onPanelChange} />
      </div>
    );
  }
}

export default Card;

import { Calendar } from 'antd';
import { Component } from 'react';

function onPanelChange(value, mode) {
  console.log(value.format('YYYY-MM-DD'), mode);
}

export class Basic extends Component {
  render() {
    return <Calendar onPanelChange={onPanelChange} />;
  }
}

export default Basic;

// https://github.com/jonahsnider/convert
import type { Plot } from '@ant-design/charts';
import type { Unit } from 'convert';
import convert from 'convert';
import moment from 'moment';

export type WidgetPropsType = {
  dataSource: any[];
  customConfig?: any;
  threshold?: number;
  hideUnit?: boolean;
  onPlotReady?: (chart: Plot<any>) => void;
  onPlotDestroy?: (chart: Plot<any>) => void;
};

const unitMap: Record<string, Unit> = {
  nanoseconds: 'nanoseconds',
  milliseconds: 'milliseconds',
  microseconds: 'microseconds',
  seconds: 'seconds',
  d: 'days',
  h: 'hours',

  bytes: 'bytes',
  kibibytes: 'kibibytes',
  mebibytes: 'mebibytes',
  gibibytes: 'gibibytes',
  tebibytes: 'tebibytes',
  kilobytes: 'kilobytes',
  megabytes: 'megabytes',
  gigabytes: 'gigabytes',
  terabytes: 'terabytes',

  watts: 'watts',
};

export const formatter = (
  stringValue = '',
  unit: string = '',
  toFixed = 1,
): {
  value: string;
  unit: string;
  toString: () => string;
  toPrettyString: () => string;
} => {
  const value = Number(stringValue);
  let converted = null;
  const newUnit = unitMap[unit];
  if (newUnit) {
    // @ts-ignore
    converted = convert(value, newUnit).to('best');
  }

  const result = {
    value: value + '',
    unit,
    toString() {
      if (!this.value) return '';
      return this.value == '0' ? `${this.value}` : `${this.value} ${this.unit}`;
    },
    toPrettyString() {
      if (!this.value) return '';
      return this.value == '0'
        ? `${this.value}`
        : `${this.value} <span style="color: #4690ed">${this.unit}</span>`;
    },
  };
  if (converted) {
    // 49.9999999999999 这种情况下会被转成 50.0000，parseFloat 会把后面的 0 去掉
    const quantity = parseFloat(converted.quantity.toFixed(toFixed));
    if (quantity === 0) {
      result.value = '0';
    } else if (quantity % 1 === 0) {
      // 没有小数
      result.value = quantity.toFixed(0) + '';
    } else {
      result.value = quantity + '';
    }
    result.unit = converted.unit;
  } else {
    const absValue = Math.abs(value);
    if (isNaN(absValue)) {
      result.value = '';
      return result;
    }
    if (absValue >= 1000000000) {
      result.value = `${Math.round((value / 1000000000) * 100) / 100}B`;
    } else if (absValue >= 1000000) {
      result.value = `${Math.round((value / 1000000) * 100) / 100}M`;
    } else if (absValue >= 1000) {
      result.value = `${Math.round((value / 1000) * 10) / 10}K`;
    }
    result.unit = unit;
  }
  if (result.unit === 'B') {
    result.unit = 'Bytes';
  }
  return result;
};

export const unitValue = (datum = {}) => {
  const { unit, value } = datum;
  return formatter(value, unit);
};

export const isSameUnit = (units: any[] = []) => {
  if (units.length === 0) return true;
  const unit = units[0];
  if (units?.length > 1) {
    for (let i = 1; i < units.length; i++) {
      if (units[i] !== unit) {
        return false;
      }
    }
  }
  return true;
};

export const tooltip = {
  fields: ['timestamp', 'value', 'name', 'unit'],
  formatter: (datum: any) => ({
    ...datum,
    value: `${formatter(datum.value, datum.unit, 4).toPrettyString()}`,
    name: datum.name,
    title: moment(Number(datum.timestamp)).format('MM-DD HH:mm:ss'),
  }),
  position: 'bottom',
  offset: 30,
  enterable: true,
  domStyles: {
    'g2-tooltip-list': {
      maxHeight: '130px', //
      overflowY: 'auto',
      marginBottom: '12px',
      width: 'max-content',
    },
    'g2-tooltip-list-item': {
      height: '14px',
      margin: '12px 4px 0',
    },
  },
};

export const xAxis = {
  label: {
    formatter: (v: string) => {
      return moment(Number(v)).format('MM-DD HH:mm:ss');
    },
  },
};

export const yAxis = {
  label: {
    formatter: (value: any) => {
      return formatter(value, '').toString();
    },
  },
};

export const createTooltip = (options = {}) => {
  return {
    ...tooltip,
    ...options,
  };
};

export const createAxis = ({ unit = '', ...options }) => {
  return {
    label: {
      formatter: (value: any) => {
        return formatter(value, unit).toString();
      },
    },
    ...options,
  };
};

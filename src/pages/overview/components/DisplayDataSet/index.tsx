import DataDisplayWidget from '@/components/shared-components/DataDisplayWidget';
import {
  AlertOutlined,
  ClusterOutlined,
  DeploymentUnitOutlined,
  FunctionOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import type { FC } from 'react';

type Props = {
  data?: API.OverviewResponseBody;
};

const DisplayDataSet: FC<Props> = ({ data = {} }) => {
  const {
    UniqueMetricNamesCount = 0,
    AlarmsCount = 0,
    AlarmUniqueMetricNamesCount = 0,
    AlarmCoverageRate = 0,
  } = data;

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <DataDisplayWidget
          icon={<DeploymentUnitOutlined />}
          value={UniqueMetricNamesCount}
          title="采集指标数"
          color="lime"
          vertical={true}
          avatarSize={55}
        />
        <DataDisplayWidget
          icon={<AlertOutlined />}
          value={AlarmsCount}
          title="告警总数"
          color="volcano"
          vertical={true}
          avatarSize={55}
        />
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <DataDisplayWidget
          icon={<ClusterOutlined />}
          value={(AlarmCoverageRate * 100).toFixed(2) + '%'}
          title="告警覆盖率"
          color="warning"
          vertical={true}
          avatarSize={55}
        />
        <DataDisplayWidget
          icon={<FunctionOutlined />}
          value={AlarmUniqueMetricNamesCount}
          title="接口监控总数"
          color="geekblue"
          vertical={true}
          avatarSize={55}
        />
      </Col>
    </Row>
  );
};

export default DisplayDataSet;

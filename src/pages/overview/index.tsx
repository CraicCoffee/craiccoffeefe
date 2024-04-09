import AlarmTable from '@/pages/overview/components/AlarmTable';
import DisplayDataSet from '@/pages/overview/components/DisplayDataSet';
import TrafficStatistic from '@/pages/overview/components/TrafficStatistic';
import { overview } from '@/services/craicCoffee/overviewController';
import { useRequest } from 'ahooks';
import { Col, Row } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  //padding: 24px;
`;

const OverviewPage = () => {
  const { data } = useRequest(overview);

  return (
    <Container>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={16} xl={15} xxl={14}>
          <TrafficStatistic />
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={9} xxl={10}>
          <DisplayDataSet data={data?.data} />
        </Col>
      </Row>

      {/*TODO: 需要新增其他insight 数据，待补充*/}
      {/*<Row gutter={16}>*/}
      {/*	<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={7} >*/}
      {/*    <AlarmTable />*/}
      {/*	</Col>*/}
      {/*	<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={17}>*/}
      {/*    <AlarmTable />*/}
      {/*	</Col>*/}
      {/*</Row>*/}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <AlarmTable
            allActiveAlarms={data?.data?.AllActiveAlarms}
            alarmsCount={data?.data?.AlarmsCount}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default OverviewPage;

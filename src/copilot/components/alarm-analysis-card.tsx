import { CaretRightOutlined } from '@ant-design/icons';
import { Card, Collapse, Space } from 'antd';
import { FC } from 'react';
const { Panel } = Collapse;

type Props = {
  analysisResult: any;
  loading: boolean;
};

export const AlarmAnalysisCard: FC<Props> = (props) => {
  return (
    <Card style={{ marginTop: 16 }} loading={props.loading}>
      <Collapse
        bordered={false}
        defaultActiveKey={['1', '2', '3']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel header="分析结果" key="1" className="site-collapse-custom-panel">
          <span style={{ whiteSpace: 'pre-wrap' }}>{props.analysisResult}</span>
        </Panel>
        {/*<Panel header="排查步骤" key="2" className="site-collapse-custom-panel">*/}
        {/*  <p>{result.solutions}</p>*/}
        {/*</Panel>*/}
        {/*<Panel header="修复建议" key="3" className="site-collapse-custom-panel">*/}
        {/*  <p>{result.solutions}</p>*/}
        {/*</Panel>*/}
      </Collapse>
    </Card>
  );
};

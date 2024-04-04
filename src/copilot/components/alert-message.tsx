import { Alert } from 'antd';
import { FC } from 'react';

type Props = {
  analysisResult: any;
};

export const AlertMessage: FC<Props> = (props) => {
  return <Alert message="Error" description={props.analysisResult} type="error" showIcon />;
};

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

const Icon = <LoadingOutlined style={{ fontSize: 35 }} spin />;

const Loading = (props) => {
  const { align, cover } = props;
  return (
    <div className={`loading text-${align} cover-${cover}`}>
      <Spin indicator={Icon} />
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
  cover: PropTypes.string,
};

Loading.defaultProps = {
  align: 'center',
  cover: 'inline',
};

export default Loading;

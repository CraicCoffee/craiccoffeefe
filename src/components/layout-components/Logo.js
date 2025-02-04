import { Grid } from 'antd';
import { APP_NAME } from '@/components/configs/AppConfig';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from '@/constants/ThemeConstant';
import { connect } from 'react-redux';
import utils from '../utils';

const { useBreakpoint } = Grid;

const getLogoWidthGutter = (props, isMobile) => {
  const { navCollapsed, navType } = props;
  const isNavTop = navType === NAV_TYPE_TOP ? true : false;
  if (isMobile && !props.mobileLogo) {
    return 0;
  }
  if (isNavTop) {
    return 'auto';
  }
  if (navCollapsed) {
    return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
  } else {
    return `${SIDE_NAV_WIDTH}px`;
  }
};

const getLogo = (props) => {
  const { navCollapsed, logoType } = props;
  if (logoType === 'light') {
    if (navCollapsed) {
      return '/img/logo-sm-white.png';
    }
    return '/img/logo-white.png';
  }

  if (navCollapsed) {
    return '/img/logo-sm.png';
  }
  return '/img/logo.png';
};

const getLogoDisplay = (isMobile, mobileLogo) => {
  if (isMobile && !mobileLogo) {
    return 'd-none';
  } else {
    return 'logo';
  }
};

export const Logo = (props) => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  return (
    <div
      className={getLogoDisplay(isMobile, props.mobileLogo)}
      style={{ width: `${getLogoWidthGutter(props, isMobile)}` }}
    >
      <img src={getLogo(props)} alt={`${APP_NAME} logo`} />
    </div>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType } = theme;
  return { navCollapsed, navType };
};

export default connect(mapStateToProps)(Logo);

import { CopyrightOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styled from 'styled-components';

const FooterBox = styled.div`
  position: absolute;
  bottom: 10px;
  text-align: center;
  width: 100%;
  left: 0;
`;

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'InsightMon',
  });

  const currentYear = new Date().getFullYear();

  return (
    <FooterBox>
      <CopyrightOutlined /> {currentYear} {defaultMessage}
    </FooterBox>
  );
};

export default Footer;

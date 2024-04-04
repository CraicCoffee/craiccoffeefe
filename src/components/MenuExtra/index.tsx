import { ThemeSwitcherProvider, useThemeSwitcher } from 'react-css-theme-switcher';
import styled from 'styled-components';
import { withWrapper } from 'with-wrapper';
import Avatar from './AvatarDropdown';

const Container = styled.div`
  padding: 12px;
  color: #99abb4;
`;

const IconButton = styled.div`
  cursor: pointer;
  font-size: 24px;
  color: #99abb4;
`;

const themeMap = {
  dark: `/css/dark-theme.css`,
  light: `/css/light-theme.css`,
};
const defaultTheme = localStorage.getItem('THEME') || themeMap.light;

export type SiderTheme = 'light' | 'dark';

const MenuExtra = withWrapper(
  (element) => element,
  // <ThemeSwitcherProvider
  //   themeMap={themeMap}
  //   defaultTheme={defaultTheme}
  //   insertionPoint="styles-insertion-point"
  // >
  //   {element}
  // </ThemeSwitcherProvider>
)(() => {
  // const { unreadCount } = useNoticeStore();

  // const { switcher, themes } = useThemeSwitcher();

  // useEffect(() => {
  //   const theme = localStorage.getItem('THEME') || themes.light;
  //   switcher({ theme });
  // }, []);

  return (
    <Container>
      {/*<div style={{ margin: '0  0 10px  15px' }}>*/}
      {/*  /!* <SelectLang className={styles.action} /> *!/*/}
      {/*  <Badge count={unreadCount} offset={[8, 0]}>*/}
      {/*    <IconButton*/}
      {/*      onClick={() => {*/}
      {/*        history.push('/notice');*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <BellOutlined />*/}
      {/*    </IconButton>*/}
      {/*  </Badge>*/}
      {/*</div>*/}
      <Avatar menu />
    </Container>
  );
});

export default MenuExtra;

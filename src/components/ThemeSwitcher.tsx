import { Switch } from 'antd';
import { useThemeSwitcher } from 'react-css-theme-switcher';

const ThemeSwitcher: React.FC = () => {
  const { switcher, themes, currentTheme } = useThemeSwitcher();

  const onThemeChange = () => {
    const theme = currentTheme === themes.dark ? themes.light : themes.dark;
    window.localStorage.setItem('THEME', theme);
    switcher({ theme });
  };

  return (
    <>
      暗黑模式 <Switch defaultChecked={currentTheme === themes.dark} onChange={onThemeChange} />
    </>
  );
};

export default ThemeSwitcher;

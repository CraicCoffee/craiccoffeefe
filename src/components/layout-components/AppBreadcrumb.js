import { Breadcrumb } from 'antd';
import IntlMessage from "@/components/util-components/IntlMessage";
import navigationConfig from '@/components/configs/NavigationConfig';
import { Link, useLocation } from 'react-router-dom';

let breadcrumbData = {
  '/app': <IntlMessage id="home" />,
};

navigationConfig.forEach((elm, i) => {
  const assignBreadcrumb = (obj) => (breadcrumbData[obj.path] = <IntlMessage id={obj.title} />);
  assignBreadcrumb(elm);
  if (elm.submenu) {
    elm.submenu.forEach((elm) => {
      assignBreadcrumb(elm);
      if (elm.submenu) {
        elm.submenu.forEach((elm) => {
          assignBreadcrumb(elm);
        });
      }
    });
  }
});

const BreadcrumbRoute = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const buildBreadcrumb = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbData[url]}</Link>
        </Breadcrumb.Item>
    );
  });

  return <Breadcrumb>{buildBreadcrumb}</Breadcrumb>;
};

export default BreadcrumbRoute;

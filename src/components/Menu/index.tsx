import { GlobalOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, matchRoutes, useLocation } from 'react-router-dom';

import cls from './index.module.less';
const { Sider } = Layout;

const MyMenu: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const sysRoutes = [
    {
      path: '/sys/domain',
      title: '域名管理',
      icon: <GlobalOutlined />,
    },
  ];
  const location = useLocation();

  // 路由监听
  useEffect(() => {
    const pathname = location.pathname;
    const match = matchRoutes(sysRoutes, pathname);

    if (match?.length) {
      setOpenKeys(match.map((n) => n.route.path));
      setSelectedKeys([match[0].route.path]);
    }
  }, [location.pathname]);

  return (
    <Sider>
      <div className={cls.menu_logo}>
        <Typography.Title className={cls.logo_title} level={5}>
          Domain0-UI
        </Typography.Title>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        items={sysRoutes.map((route) => ({
          key: route.path,
          title: route.title,
          icon: route.icon,
          label: <Link to={route.path}>{route.title}</Link>,
        }))}></Menu>
    </Sider>
  );
};
export default MyMenu;

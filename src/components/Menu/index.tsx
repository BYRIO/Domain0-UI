import { GlobalOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, matchRoutes, useLocation } from 'react-router-dom';

import { sysRoutes, useMatchedSysRoutes } from '@/routes/config';
import { UserRole, useUserInfo } from '@/store/token';

import { Logo } from '../Header';
import cls from './index.module.less';
const { Sider } = Layout;

const MyMenu: React.FC = () => {
  const matchedRoutes = useMatchedSysRoutes();
  const userInfo = useUserInfo();

  return (
    <Sider className={`h-screen overflow-auto inset-y-0 left-0 menu-sider`}>
      <div className={cls.menu_logo}>
        <Typography.Title className={cls.logo_title} level={5}>
          <Logo size={35} /> <span className="title">Domain0-UI</span>
        </Typography.Title>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        openKeys={matchedRoutes.map((r) => r.menuActivePath)}
        selectedKeys={[matchedRoutes[0].menuActivePath]}
        items={sysRoutes
          .filter((route) => !route.hideInMenu)
          .filter(
            (router) =>
              router.role === undefined ||
              router.role.includes(userInfo?.role as UserRole),
          )
          .map((route) => ({
            key: route.path,
            title: route.title,
            icon: route.icon,
            label: <Link to={route.path}>{route.title}</Link>,
          }))}></Menu>
    </Sider>
  );
};
export default MyMenu;

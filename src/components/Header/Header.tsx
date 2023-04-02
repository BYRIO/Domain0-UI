import { Breadcrumb, Dropdown, Layout, Space, theme } from 'antd';
import React, { useEffect } from 'react';
import { Link, matchRoutes, useLocation } from 'react-router-dom';

import { sysRoutes, useMatchedSysRoutes } from '@/routes/config';
import { setToken, useUserInfo } from '@/store/token';

const { Header } = Layout;

const MyHeader: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const user = useUserInfo();

  const matchedRoutes = useMatchedSysRoutes();

  const handleChange = (e: { key: string }) => {
    if (e.key === '0') {
      setToken('');
      window.location.href = '/user/login';
    }
  };

  // const menu = (
  //   <Menu onClick={handleChange}>
  //     <Menu.Item key="0">退出登录</Menu.Item>
  //   </Menu>
  // );
  return (
    <Header style={{ backgroundColor: colorBgContainer }} className="flex">
      <Space className="flex-1">
        <Breadcrumb
          items={matchedRoutes.reverse().map((r, index, list) => ({
            key: r.path,
            title:
              index === list.length - 1 ? r.title : <Link to={r.path}>{r.title}</Link>,
          }))}
        />
      </Space>
      <Dropdown
        menu={{
          onClick: handleChange,
          items: [
            {
              key: 'id',
              label: `ID: ${user?.sub}`,
              disabled: true,
            },
            { key: '0', label: '退出登录' },
          ],
        }}>
        <Space>{user?.name ? `${user.name}(${user.email})` : user?.email}</Space>
      </Dropdown>
    </Header>
  );
};

export default MyHeader;

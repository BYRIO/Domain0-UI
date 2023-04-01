import { Avatar, Dropdown, Layout, Space } from 'antd';
import React from 'react';

import { setToken, useUserInfo } from '@/store/token';

import cls from './index.module.less';

const { Header } = Layout;

const MyHeader: React.FC = () => {
  const user = useUserInfo();

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
    <Header className={cls.layout_header}>
      <Dropdown
        menu={{
          onClick: handleChange,
          items: [{ key: '0', label: '退出登录' }],
        }}>
        <Space>{user?.name ? `${user.name}(${user.email})` : user?.email}</Space>
      </Dropdown>
    </Header>
  );
};

export default MyHeader;

import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

import MyHeader from '../components/Header';
import MyMenu from '../components/Menu';

const { Content } = Layout;

const BasicLayout: React.FC = () => {
  return (
    <Layout className="main-layout">
      <MyMenu />
      <Layout className="content-layout">
        <MyHeader />
        <Content className="grow overflow-y-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

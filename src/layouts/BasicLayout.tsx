import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

import MyHeader from '../components/Header';
import MyMenu from '../components/Menu';

const { Content } = Layout;

const BasicLayout: React.FC = () => {
  return (
    <Layout>
      <MyMenu />
      <Layout style={{ marginLeft: 200 }}>
        <MyHeader />
        <Content style={{ height: 'calc(100vh - 60px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

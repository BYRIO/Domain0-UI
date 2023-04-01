import { Layout, Typography } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

const { Content, Footer } = Layout;
const { Text } = Typography;

const UserLayout: React.FC = () => {
  return (
    <Layout className="_bg">
      <Content>
        <Outlet />
      </Content>
      <Footer>
        <Text>
          Domain0-UI <Text type="secondary">@xice.wang 2023</Text>
        </Text>
      </Footer>
    </Layout>
  );
};
export default UserLayout;

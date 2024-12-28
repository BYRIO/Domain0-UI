import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Space,
  Typography,
} from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as Api from '@/api';
import { Logo } from '@/components/Header';
import { catchCommonResponseError, MessageError, useError } from '@/error';
import { setToken } from '@/store/token';

const FeishuLogin: React.FC = () => {
  return (
    <a href="/api/v1/user/feishu">
      <Avatar src="https://sf3-scmcdn2-cn.feishucdn.com/lark/open/doc/frontend/favicon-logo.svg" />
    </a>
  );
};
const OIDCLogin: React.FC = () => {
  return (
    <a href="/api/v1/user/oidc">
      <Avatar src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkyIDE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzNkM2YxIj4KICAgIDxwYXRoIGQ9Ik05OS41MSw2NS42NEMxMDEuNzYsNDguMDMgMTE2LjEsMjYuNDUgMTM2LjQ3LDMzLjMzQzE1Mi4xNiwzOC45MyAxNDcuMDUsNjAuOTQgMTYwLjgsNjkuNDFDMTU4Ljg2LDg0Ljg2IDE0MC40Niw5MS42MyAxMjcuMzcsOTYuMzdDMTI3LjI2LDk2Ljk5IDEyNy4wNCw5OC4yMyAxMjYuOTIsOTguODRDMTM4Ljk5LDk4LjgxIDE1NC42MSw5OC42MyAxNjEuNjYsMTEwLjM5QzE2NS4yOCwxMTUuNTEgMTYwLjEsMTIwLjMxIDE1Ny43LDEyNC41N0MxNTUuNjUsMTMwLjg0IDE1OS4xNSwxMzguNzEgMTU0LjAyLDE0NC4wMkMxNDQuNzQsMTU0LjI2IDEyNy44NCwxNTEuMyAxMTguODMsMTQyLjE4QzExMy4wNSwxMzcuNjkgMTEwLjgzLDEzMC4yOSAxMDUuNDcsMTI1LjUyQzEwMy45MiwxMzYuMzYgMTAzLjQ0LDE0OC44NyA5NC44NSwxNTYuODVDODcuMzIsMTY0LjI3IDcyLjg3LDE2NC42OSA2Ni45MiwxNTUuMTRDNjMuMjMsMTQ3LjEzIDUwLjYxLDE0Ni4zOCA1MC42OSwxMzZDNTAuNjksMTIyLjM2IDY1LjA2LDExNy4wNyA3My41MiwxMDkuMzhDNTYuNTcsMTEwLjgzIDM2LjA2LDEwMy43OCAyOC4yNiw4OC4xM0MzNi43OCw3NS45NCAzMS4xMyw1Ni41MSA0NS4wNSw0OC4xMUM2MC40Nyw0My45OCA3NC4zMyw1NS4wOSA4Ni4xNyw2My4yOUM4NS40MSw1Ny41NyA3OS4zOSw1My42MSA4MC44LDQ3LjQ5Qzg3LjQ0LDUyLjg3IDg3LjQzLDYyLjc3IDkzLjUzLDY4LjUyQzk2LjAxLDU4LjE3IDkyLjc3LDQ2LjY2IDk3Ljk2LDM3LjA1QzEwMC45Miw0Ni40MyA5NS4yOCw1Ni4zIDk3LjA1LDY2LjA3Qzk3LjY3LDY1Ljk2IDk4LjksNjUuNzUgOTkuNTEsNjUuNjRaIj48L3BhdGg+Cjwvc3ZnPg==" />
    </a>
  );
};
const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    run: doLogin,
    loading,
    error,
  } = useRequest(
    async (data: { username: string; password: string }) => {
      const res = await catchCommonResponseError(Api.User.login(data));
      if (res.status !== 200) {
        throw new MessageError('error', res.statusText);
      }
      if (res.data.status !== 200) {
        throw new MessageError('error', res.data.errors || '登录失败');
      }
      setToken(res.data.data);
      message.success('登录成功');
      navigate('/');
    },
    {
      manual: true,
    },
  );

  useError(error);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="mx-auto flex flex-col items-center justify-center mb-4">
        <Logo size={120} />
      </div>
      <Card className="mx-auto w-80" bordered={false}>
        <Form onFinish={doLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input type="password" prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" className="w-full">
              登陆
            </Button>
          </Form.Item>
          <Space>
            <Typography.Text>
              没有帐号？
              <Link to="/user/register">
                <Typography.Link>点击注册</Typography.Link>
              </Link>
            </Typography.Text>
          </Space>
        </Form>
        {/* 其他登录方式 */}
        <Divider>其他登录方式</Divider>
        <Space className="w-full justify-center">
          <FeishuLogin />
          <OIDCLogin />
        </Space>
      </Card>
    </div>
  );
};
export default Login;

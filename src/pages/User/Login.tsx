import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
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

const OIDCLogin: React.FC<{ logo_url: string }> = ({ logo_url }) => {
  return (
    <a href="/api/v1/user/oidc">
      <Avatar src={logo_url} />
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

  const {
    data,
    error: login_method_error,
    loading: login_method_loading,
  } = useRequest(Api.User.login_methods);

  useError(login_method_error);

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
          {login_method_loading ? (
            <LoadingOutlined />
          ) : (
            <>
              {data?.oidc.data.enable && <OIDCLogin logo_url={data.oidc.data.logo_url} />}
              {data?.feishu.data.enable && <FeishuLogin />}
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};
export default Login;

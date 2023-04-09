import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, message, Space, Typography } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as Api from '@/api';
import { catchCommonResponseError, MessageError, useError } from '@/error';
import { setToken } from '@/store/token';

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
    <div className="w-full h-full flex items-center justify-center">
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
      </Card>
    </div>
  );
};
export default Login;

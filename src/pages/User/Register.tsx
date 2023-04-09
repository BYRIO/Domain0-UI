import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, message, Space, Typography } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as Api from '@/api';
import { catchCommonResponseError, MessageError, useError } from '@/error';
import { setToken } from '@/store/token';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    run: doRegister,
    loading,
    error,
  } = useRequest(
    async (data: { email: string; password: string }) => {
      const res = await catchCommonResponseError(Api.User.register(data));
      if (res.status !== 200) {
        throw new MessageError('error', res.statusText);
      }
      if (res.data.status !== 200) {
        throw new MessageError('error', res.data.errors || '注册失败');
      }
      setToken(res.data.data);
      message.success('注册成功');
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
        <Form onFinish={doRegister}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              {
                type: 'email',
                message: '请输入正确的邮箱',
              },
            ]}>
            <Input prefix={<UserOutlined />} placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              {
                min: 6,
                message: '密码长度不能小于6位',
              },
            ]}>
            <Input prefix={<LockOutlined />} placeholder="请输入密码" type="password" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" className="w-full">
              注册
            </Button>
          </Form.Item>
          <Space>
            <Typography.Text>
              已有帐号？
              <Link to="/user/login">
                <Typography.Link>点击登录</Typography.Link>
              </Link>
            </Typography.Text>
          </Space>
        </Form>
      </Card>
    </div>
  );
};
export default Register;

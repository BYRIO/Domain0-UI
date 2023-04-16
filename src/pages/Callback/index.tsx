import { LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Space } from 'antd';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Api from '@/api';
import { catchCommonResponseError, useError } from '@/error';
import { setToken } from '@/store/token';

const CallbackPage: FC = () => {
  const navigate = useNavigate();

  const { error } = useRequest(async () => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    if (!code || !state) {
      throw new Error('code or state is empty');
    }
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, '', url.href);
    const res = await catchCommonResponseError(Api.User.callback(code, state));
    if (res.data?.status !== 200) {
      throw new Error(res.data.errors || '登录失败');
    }
    setToken(res.data.data);
    navigate('/sys/domain');
  });
  useError(error);

  useEffect(() => {
    if (error) {
      navigate('/user/login');
    }
  }, [error]);

  return (
    <Space className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-2xl">
        <LoadingOutlined />
        <span className="ml-2">Oauth 祈福中...</span>
      </div>
    </Space>
  );
};

export default CallbackPage;

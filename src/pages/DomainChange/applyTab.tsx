import { RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Space, Table } from 'antd';
import React, { FC } from 'react';

import * as Api from '@/api';
import { catchCommonResponseError, useError } from '@/error';

import ApplyTable from './applyTable';

const ApplyTab: FC = () => {
  const {
    run: doLoadApplyList,
    loading: loadingApplyList,
    error: errorOnLoadApplyList,
    data: applyList,
  } = useRequest(async () => {
    const res = await catchCommonResponseError(Api.DomainChange.apply());
    if (res.data.status === 200) return res.data.data;
    throw new Error('未知错误(#100)');
  });
  useError(errorOnLoadApplyList);
  return (
    <>
      <Space className="w-full justify-end">
        <Button type="text" icon={<RedoOutlined />} onClick={doLoadApplyList} />
      </Space>
      <Card loading={loadingApplyList}>
        <ApplyTable dataSource={applyList?.reverse()} />
      </Card>
    </>
  );
};

export default ApplyTab;

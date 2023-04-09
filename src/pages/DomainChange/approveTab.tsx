import { RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC } from 'react';

import * as Api from '@/api';
import DoubleClickButton from '@/components/DoubleClickButton';
import { catchCommonResponseError, useError } from '@/error';

import ApplyTable from './applyTable';

const ChangeStatusButton: FC<{
  item: Api.DomainChange.ApplyChangeItem;
  targetStatus:
    | Api.DomainChange.ActionStatus.Approved
    | Api.DomainChange.ActionStatus.Rejected;
  onStatusChanged?: () => void;
}> = ({ item, targetStatus, onStatusChanged }) => {
  const {
    run: doChangeStatus,
    loading: loadingChangeStatus,
    error: errorOnChangeStatus,
  } = useRequest(
    async () => {
      const res = await catchCommonResponseError(
        Api.DomainChange.updateStatus(
          item.ID,
          targetStatus === Api.DomainChange.ActionStatus.Approved ? 'accept' : 'reject',
        ),
      );
      if (res.data.status === 200) {
        onStatusChanged?.();
      }
      throw new Error('未知错误(#101)');
    },
    {
      manual: true,
    },
  );
  useError(errorOnChangeStatus);

  return (
    <DoubleClickButton
      loading={loadingChangeStatus}
      endBtnProps={{
        type: 'primary',
      }}
      danger={targetStatus === Api.DomainChange.ActionStatus.Rejected}
      onFinalClick={doChangeStatus}>
      <DoubleClickButton.Start>
        {targetStatus === Api.DomainChange.ActionStatus.Approved ? '通过' : '拒绝'}
      </DoubleClickButton.Start>
      <DoubleClickButton.End>确认？</DoubleClickButton.End>
    </DoubleClickButton>
  );
};

const ApproveTab: FC = () => {
  const {
    run: doLoadApproveList,
    loading: loadingApproveList,
    error: errorOnLoadApproveList,
    data: approveList,
  } = useRequest(async () => {
    const res = await catchCommonResponseError(Api.DomainChange.approve());
    if (res.data.status === 200) return res.data.data;
    throw new Error('未知错误(#99)');
  });
  useError(errorOnLoadApproveList);

  return (
    <>
      <Space className="w-full justify-end">
        <Button type="text" icon={<RedoOutlined />} onClick={doLoadApproveList} />
      </Space>
      <Card loading={loadingApproveList}>
        <ApplyTable
          dataSource={approveList?.reverse()}
          actionColumn={{
            title: '操作',
            key: 'action',
            className: 'w-48',
            render: (_: unknown, record) => {
              if (record.ActionStatus === Api.DomainChange.ActionStatus.Reviewing) {
                return (
                  <Space>
                    <ChangeStatusButton
                      item={record}
                      onStatusChanged={doLoadApproveList}
                      targetStatus={Api.DomainChange.ActionStatus.Approved}
                    />
                    <ChangeStatusButton
                      item={record}
                      onStatusChanged={doLoadApproveList}
                      targetStatus={Api.DomainChange.ActionStatus.Rejected}
                    />
                  </Space>
                );
              }
              return null;
            },
          }}
        />
      </Card>
    </>
  );
};

export default ApproveTab;

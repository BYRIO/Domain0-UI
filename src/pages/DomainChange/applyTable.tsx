import { FileTextOutlined } from '@ant-design/icons';
import { Button, Modal, Popover, Space, Table, Typography } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';
import React, { FC } from 'react';

import * as Api from '@/api';

export type ApplyTableProps = {
  dataSource?: Api.DomainChange.ApplyChangeItem[];
  actionColumn?: ColumnType<Api.DomainChange.ApplyChangeItem>;
};

const OperationModalWithButton: FC<{
  operation: string;
}> = ({ operation }) => {
  const safeFormatJson = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };
  operation = safeFormatJson(operation);
  const [modal, contextHolder] = Modal.useModal();
  return (
    <>
      <Button
        type="text"
        property="operation"
        onClick={() =>
          modal.info({
            title: '申请内容',
            content: (
              <Typography.Text copyable>
                <pre>{operation}</pre>
              </Typography.Text>
            ),
            width: 800,
          })
        }
        icon={<FileTextOutlined />}></Button>
      {contextHolder}
    </>
  );
};

const columns: ColumnsType<Api.DomainChange.ApplyChangeItem> = [
  {
    title: 'ID',
    dataIndex: 'ID',
    key: 'ID',
  },
  {
    title: '域名ID',
    dataIndex: 'DomainId',
    key: 'DomainId',
  },
  {
    title: '申请用户ID',
    dataIndex: 'UserId',
    key: 'UserId',
  },
  {
    title: '申请类型',
    dataIndex: 'ActionType',
    key: 'ActionType',
    render: (actionType: Api.DomainChange.ApplyChangeItem['ActionType']) => {
      return Api.DomainChange.ActionType[actionType];
    },
  },
  {
    title: '申请状态',
    dataIndex: 'ActionStatus',
    key: 'ActionStatus',
    render: (actionStatus: Api.DomainChange.ApplyChangeItem['ActionStatus']) => {
      return Api.DomainChange.ActionStatus[actionStatus];
    },
  },
  {
    title: '申请内容',
    dataIndex: 'Operation',
    key: 'Operation',
    render: (operation: Api.DomainChange.ApplyChangeItem['Operation']) => {
      return <OperationModalWithButton operation={operation} />;
    },
  },
  {
    title: '申请时间',
    dataIndex: 'CreatedAt',
    key: 'CreatedAt',
    render: (createdAt: Api.DomainChange.ApplyChangeItem['CreatedAt']) => {
      return new Date(createdAt).toLocaleString();
    },
  },
];

const ApplyTable: FC<ApplyTableProps> = ({ dataSource, actionColumn }) => {
  return (
    <Table
      dataSource={dataSource}
      pagination={false}
      columns={actionColumn ? columns.concat(actionColumn) : columns}
    />
  );
};

export default ApplyTable;

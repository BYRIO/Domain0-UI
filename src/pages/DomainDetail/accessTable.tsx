import { DeleteFilled, RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Form, InputNumber, Modal, Select, Space, Table } from 'antd';
import form from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';
import { ColumnType } from 'antd/es/table';
import React from 'react';

import * as Api from '@/api';
import DoubleClickButton from '@/components/DoubleClickButton';
import { catchCommonResponseError, MessageError, useError } from '@/error';
import { useUserInfo } from '@/store/token';

type UserAccessItem = Api.Domain.DomainUserAccessItem;

const columns: ColumnType<UserAccessItem>[] = [
  {
    title: '用户 ID',
    dataIndex: 'user_id',
    key: 'user_id',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    render: (role) => Api.Domain.DomainAcccessRole[role],
  },
];

const RemoveUserButton: React.FC<{
  item: UserAccessItem;
  onDelete: (item: UserAccessItem) => void;
}> = ({ item, onDelete }) => {
  const {
    run: doDelete,
    loading: loadingDelete,
    error: errorOnDelete,
  } = useRequest(
    async () => {
      const res = await catchCommonResponseError(
        Api.Domain.userRemove(item.domain_id, item.user_id),
      );
      console.log('res', res);
      onDelete(item);
    },
    {
      manual: true,
    },
  );
  useError(errorOnDelete);

  return (
    <DoubleClickButton
      danger
      loading={loadingDelete}
      icon={<DeleteFilled />}
      endBtnProps={{ type: 'primary' }}
      onFinalClick={doDelete}>
      <DoubleClickButton.End>确定删除?</DoubleClickButton.End>
    </DoubleClickButton>
  );
};
const AccessTable: React.FC<{ id: number }> = ({ id }) => {
  const userInfo = useUserInfo();
  const [removeUserIds, setRemoveUserIds] = React.useState<number[]>([]);
  const {
    run: doLoadList,
    loading: loadingList,
    data: userAccessList,
    error: errorOnList,
  } = useRequest(async () => {
    const res = await catchCommonResponseError(Api.Domain.userList(id));
    console.log('res', res);
    if (res.data.status !== 200) {
      throw new MessageError('warning', res.data.errors || '未知错误(#91)');
    }
    setRemoveUserIds([]);
    return res.data.data;
  });
  useError(errorOnList);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const onRemoveUser = (item: UserAccessItem) => {
    setRemoveUserIds((ids) => ids.concat(item.user_id));
  };

  const selfAccessRole = userAccessList?.find(
    (item) => item.user_id === userInfo?.sub,
  )?.role;

  const userList = userAccessList?.filter(
    (item) => !removeUserIds.includes(item.user_id),
  );

  const [form] = Form.useForm<{
    user_id: number;
    role: Api.Domain.DomainAcccessRole;
  }>();
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const {
    run: doUserCreate,
    loading: loadingUserCreate,
    error: errorOnUserCreate,
  } = useRequest(
    async () => {
      const data = await form.validateFields().catch(() => null);
      if (!data) return;
      const res = await catchCommonResponseError(Api.Domain.userCreate(id, data));
      if (res.data.status !== 200) {
        throw new MessageError('warning', res.data.errors || '未知错误(#92)');
      }
      setIsEditModalOpen(false);
      doLoadList();
    },
    {
      manual: true,
    },
  );
  useError(errorOnUserCreate);

  const newAccessUser = () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="w-full flex">
        <div className="flex flex-1">
          {selfAccessRole && selfAccessRole >= Api.Domain.DomainAcccessRole.Manager ? (
            <Button type="primary" onClick={newAccessUser}>
              添加角色
            </Button>
          ) : null}
        </div>
        <div className="flex">
          <Button icon={<RedoOutlined />} type="text" onClick={doLoadList}></Button>
        </div>
      </div>
      <Table
        loading={loadingList}
        dataSource={userList}
        columns={columns.concat({
          title: '操作',
          key: 'action',
          render: (_, record) => (
            <Space className="w-48">
              {record.role === Api.Domain.DomainAcccessRole.Owner &&
              record.user_id === userInfo?.sub ? null : (
                <RemoveUserButton item={record} onDelete={onRemoveUser} />
              )}
            </Space>
          ),
        })}
        pagination={false}
        rowKey="id"
      />
      <Modal
        title="添加角色"
        open={isEditModalOpen}
        onCancel={handleEditModalClose}
        okButtonProps={{ loading: loadingUserCreate }}
        onOk={doUserCreate}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          requiredMark={false}>
          <Form.Item
            name="user_id"
            label="用户 ID"
            rules={[{ required: true, message: '请输入用户 ID' }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              <Select.Option value={Api.Domain.DomainAcccessRole.ReadOnly}>
                {Api.Domain.DomainAcccessRole[Api.Domain.DomainAcccessRole.ReadOnly]}
              </Select.Option>
              <Select.Option value={Api.Domain.DomainAcccessRole.ReadWrite}>
                {Api.Domain.DomainAcccessRole[Api.Domain.DomainAcccessRole.ReadWrite]}
              </Select.Option>
              <Select.Option
                value={Api.Domain.DomainAcccessRole.Manager}
                disabled={
                  selfAccessRole && selfAccessRole <= Api.Domain.DomainAcccessRole.Manager
                }>
                {Api.Domain.DomainAcccessRole[Api.Domain.DomainAcccessRole.Manager]}
              </Select.Option>
              <Select.Option
                value={Api.Domain.DomainAcccessRole.Owner}
                disabled={
                  selfAccessRole && selfAccessRole <= Api.Domain.DomainAcccessRole.Owner
                }>
                {Api.Domain.DomainAcccessRole[Api.Domain.DomainAcccessRole.Owner]}
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccessTable;

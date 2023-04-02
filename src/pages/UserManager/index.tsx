import { DeleteFilled, EditOutlined, RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, message, Modal, Select, Space, Table } from 'antd';
import React, { useEffect } from 'react';

import * as Api from '@/api';
import DoubleClickButton from '@/components/DoubleClickButton';
import { catchCommonResponseError, MessageError, useError } from '@/error';
import { UserRole, useUserInfo } from '@/store/token';

const columns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    key: 'ID',
  },
  {
    title: '邮箱',
    dataIndex: 'Email',
    key: 'Email',
  },
  {
    title: '用户名',
    dataIndex: 'Name',
  },
  {
    title: '学号',
    dataIndex: 'StuId',
    key: 'StuId',
    render: (text: Api.User.UserInfoItem['StuId']) => (
      <>{text.Valid ? text.String : '<未设置>'}</>
    ),
  },
  {
    title: '角色',
    dataIndex: 'Role',
    key: 'Role',
    render: (role: Api.User.UserInfoItem['Role']) => {
      return <>{UserRole[role] || `<未知角色: ${role}>`}</>;
    },
  },
];

const RemoveUserButton: React.FC<{
  item: Api.User.UserInfoItem;
  onRemove: (item: Api.User.UserInfoItem) => void;
}> = ({ item, onRemove }) => {
  const {
    run: doRemove,
    loading: loadingRemove,
    error: errorOnRemove,
  } = useRequest(
    async () => {
      const res = await catchCommonResponseError(Api.User.remove(item.ID));
      if (res.data.status !== 200) {
        throw new MessageError('error', res.data.errors || '未知错误(#ER323)');
      }
      message.success('删除成功');
      onRemove(item);
    },
    {
      manual: true,
    },
  );

  useError(errorOnRemove);

  return (
    <DoubleClickButton
      danger
      loading={loadingRemove}
      icon={<DeleteFilled />}
      endBtnProps={{ type: 'primary' }}
      onFinalClick={doRemove}>
      <DoubleClickButton.End>确定删除?</DoubleClickButton.End>
    </DoubleClickButton>
  );
};

const UserManager: React.FC = () => {
  const userInfo = useUserInfo();
  const [canEditPassword, setCanEditPassword] = React.useState(false);
  useEffect(() => {
    (window as any)['__setCanEditPassword'] = setCanEditPassword;
    return () => {
      delete (window as any)['__setCanEditPassword'];
    };
  }, []);
  const {
    run: doLoadList,
    loading: loadingLoadList,
    data: dataLoadList,
    error: errorOnLoadList,
  } = useRequest(async () => {
    const res = await catchCommonResponseError(Api.User.list());
    setRemovedIds([]);
    return res.data.data;
  });
  useError(errorOnLoadList);

  const [removedIds, setRemovedIds] = React.useState<number[]>([]);
  const onRemove = (item: Api.User.UserInfoItem) => {
    setRemovedIds((prev) => [...prev, item.ID]);
  };

  const [editingItem, setEditingItem] = React.useState<Api.User.UserInfoItem | null>(
    null,
  );
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [form] = Form.useForm<Partial<Api.User.UserInfoUpdateRequest>>();

  const handleClose = () => {
    setIsEditModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const getEditClickHandler = (item: Api.User.UserInfoItem) => () => {
    setEditingItem(item);
    setIsEditModalVisible(true);
    form.setFieldsValue({});
  };

  const {
    run: doUpdate,
    loading: loadingUpdate,
    error: errorOnUpdate,
  } = useRequest(
    async () => {
      if (!editingItem) return;
      const values = await form.validateFields();
      const res = await catchCommonResponseError(Api.User.update(editingItem.ID, values));
      console.log('res', res);
      handleClose();
      doLoadList();
    },
    {
      manual: true,
    },
  );
  useError(errorOnUpdate);

  const dataSource = dataLoadList?.filter((item) => !removedIds.includes(item.ID)) || [];

  return (
    <div className="p-4 min-h-full space-y-4">
      <Space className="w-full flex justify-end">
        <Button icon={<RedoOutlined />} type="text" onClick={doLoadList} />
      </Space>
      <Card loading={loadingLoadList}>
        <Table
          dataSource={dataSource}
          rowKey="ID"
          pagination={false}
          columns={[
            ...columns,
            {
              title: '操作',
              key: 'Action',
              render: (_, record) => (
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={getEditClickHandler(record)}
                  />
                  <RemoveUserButton item={record} onRemove={onRemove} />
                </Space>
              ),
            },
          ]}
        />
      </Card>
      <Modal
        title="编辑用户"
        open={isEditModalVisible}
        onCancel={handleClose}
        okButtonProps={{ loading: loadingUpdate }}
        onOk={doUpdate}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: false, message: '请输入用户名' }]}>
            <Input placeholder="无需修改时留空" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: false, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱' },
            ]}>
            <Input placeholder="无需修改时留空" />
          </Form.Item>
          <Form.Item
            label="学号"
            name="stuid"
            rules={[{ required: false, message: '请输入学号' }]}>
            <Input placeholder="无需修改时留空" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: false, message: '请选择角色' }]}>
            <Select allowClear placeholder="无需修改时留空">
              {Object.entries(UserRole)
                .filter(([, value]) => typeof value === 'number')
                .map(([key, value]) => (
                  <Select.Option
                    key={value}
                    value={value}
                    disabled={
                      !userInfo?.role || (userInfo.role as number) <= (value as number)
                    }>
                    {key}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          {canEditPassword && (
            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: false, message: '请输入密码' },
                { min: 6, message: '密码长度至少为6位' },
              ]}>
              <Input.Password placeholder="无需修改时留空" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManager;

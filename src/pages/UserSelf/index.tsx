import { EditOutlined, RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, Modal, Space, Typography } from 'antd';
import React from 'react';

import * as Api from '@/api';
import { catchCommonResponseError, useError } from '@/error';
import { UserRole, useUserInfo } from '@/store/token';

const { Text } = Typography;

const UserSelf: React.FC = () => {
  const userInfo = useUserInfo();
  const {
    run: doLoadSelf,
    loading: loadingLoadSelf,
    data: dataLoadSelf,
    error: errorOnLoadSelf,
  } = useRequest(async () => {
    const res = await catchCommonResponseError(Api.User.detail(userInfo?.sub || 0));
    return res.data.data;
  });
  useError(errorOnLoadSelf);

  const [showChangeUserInfoModal, setShowChangeUserInfoModal] = React.useState(false);
  const [form] = Form.useForm();

  const {
    run: doChangeUserInfo,
    loading: loadingChangeUserInfo,
    error: errorOnChangeUserInfo,
  } = useRequest(
    async () => {
      const values = await form.validateFields();
      const res = await catchCommonResponseError(
        Api.User.update(userInfo?.sub || 0, values),
      );
      console.log('res', res);
      doLoadSelf();
      setShowChangeUserInfoModal(false);
    },
    {
      manual: true,
    },
  );
  useError(errorOnChangeUserInfo);

  const showChangeUserInfoModalHandle = () => {
    setShowChangeUserInfoModal(true);
    form.setFieldsValue({
      email: null,
      password: null,
    });
  };

  const handleModuelClose = () => {
    setShowChangeUserInfoModal(false);
    form.resetFields();
  };

  return (
    <div className="p-4 min-h-full space-y-4">
      <Card
        loading={loadingLoadSelf}
        title="个人信息"
        extra={
          <Space>
            <Button
              onClick={showChangeUserInfoModalHandle}
              icon={<EditOutlined />}
              type="text"
            />
            <Button onClick={doLoadSelf} icon={<RedoOutlined />} type="text" />
          </Space>
        }>
        <p className="flex space-x-5">
          <Text className="w-24 block text-right">ID:</Text>
          <Text>{dataLoadSelf?.ID}</Text>
        </p>
        <p className="flex space-x-5">
          <Text className="w-24 block text-right">用户名:</Text>
          <Text>{dataLoadSelf?.Name || '<未设置>'}</Text>
        </p>
        <p className="flex space-x-5">
          <Text className="w-24 block text-right">邮箱:</Text>
          <Text>{dataLoadSelf?.Email}</Text>
        </p>
        <p className="flex space-x-5">
          <Text className="w-24 block text-right">学号:</Text>
          <Text>
            {dataLoadSelf?.StuId.Valid ? dataLoadSelf?.StuId.String : '<未设置>'}
          </Text>
        </p>
        <p className="flex space-x-5">
          <Text className="w-24 block text-right">角色:</Text>
          <Text>
            {UserRole[dataLoadSelf?.Role as UserRole] ||
              `未知角色(${dataLoadSelf?.Role})`}
          </Text>
        </p>
        <p className="flex space-x-5">
          <Text className="w-24 block text-right">创建时间:</Text>
          <Text>
            {dataLoadSelf?.CreatedAt
              ? new Date(dataLoadSelf?.CreatedAt).toLocaleString()
              : ''}
          </Text>
        </p>
      </Card>
      <Modal
        title="修改个人信息"
        open={showChangeUserInfoModal}
        okButtonProps={{
          loading: loadingChangeUserInfo,
        }}
        onCancel={handleModuelClose}
        onOk={doChangeUserInfo}>
        <Form form={form}>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                required: false,
                message: '请输入邮箱',
              },
              {
                type: 'email',
                message: '请输入正确的邮箱',
              },
            ]}>
            <Input placeholder="不修改请留空" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: false,
                message: '请输入密码',
              },
              {
                min: 6,
                message: '密码长度不能小于6位',
              },
            ]}>
            <Input.Password placeholder="不修改请留空" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserSelf;

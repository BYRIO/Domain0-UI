import { RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';

import * as Api from '@/api';
import { DomainUpdateRequest } from '@/api/domain';
import DoubleClickButton from '@/components/DoubleClickButton';
import { catchCommonResponseError, useError } from '@/error';

const { Option } = Select;
type AnyFn = (...args: unknown[]) => unknown;

type DomainNormalType = Api.Domain.DomainCreateRequest;
type DomainType = Api.Domain.DomainItem;
type DomainFormType = DomainNormalType & { ICP_reg_boolean: boolean };

const VendorNameMap: Record<Api.Domain.DomainVendor, string> = {
  [Api.Domain.DomainVendorMap.aliyun]: '阿里云',
  [Api.Domain.DomainVendorMap.dnspod]: '腾讯云(DNSpod)',
  [Api.Domain.DomainVendorMap.cloudflare]: 'Cloudflare',
};

const BaseColumns = [
  { title: 'ID', dataIndex: 'ID', key: 'ID' },
  { title: '名称', dataIndex: 'Name', key: 'Name' },
  {
    title: 'ICP',
    key: 'ICP_reg',
    dataIndex: 'ICP_reg',
    render: (ICP_reg: 0 | 1) => (ICP_reg ? <Tag color="blue">已备案</Tag> : <></>),
  },
  {
    title: 'DNS 供应商',
    dataIndex: 'vendor',
    key: 'vendor',
    render: (vendor: Api.Domain.DomainVendor) => VendorNameMap[vendor],
  },
];

const DeleteButton: React.FC<{
  item: DomainType;
  onDelete: (item: DomainType) => void;
}> = ({ item, onDelete }) => {
  const {
    run: doDelete,
    loading: loadingDelete,
    error: errorOnDelete,
  } = useRequest(
    async () => {
      const res = await catchCommonResponseError(Api.Domain.remove(item.ID));
      console.log('res', res);
      message.success('删除成功');
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
      endBtnProps={{ type: 'primary' }}
      onFinalClick={doDelete}>
      <DoubleClickButton.Start>删除</DoubleClickButton.Start>
      <DoubleClickButton.End>确定删除?</DoubleClickButton.End>
    </DoubleClickButton>
  );
};

const Home: React.FC = () => {
  const {
    run: doLoadList,
    loading: loadingList,
    data: listLoadResponse,
    error: errorOnList,
  } = useRequest(() => catchCommonResponseError(Api.Domain.list()));
  useError(errorOnList);

  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const removeList = (item: DomainType) => {
    setRemovedIds((ids) => [...ids, item.ID]);
  };

  const dataSource =
    listLoadResponse?.data.data?.filter((item) => !removedIds.includes(item.ID)) || [];

  const {
    run: doCreate,
    loading: loadingCreate,
    error: errorOnCreate,
  } = useRequest(
    async (data: DomainFormType) => {
      data.ICP_reg = data.ICP_reg_boolean ? 1 : 0;
      const res = await catchCommonResponseError(Api.Domain.create(data));
      console.log('res', res);
      handleCancle();
      message.success('创建成功');
      doLoadList();
    },
    {
      manual: true,
    },
  );
  useError(errorOnCreate);

  const [editItem, setEditItem] = useState<DomainType | null>(null);
  const isEditing = !!editItem;

  const {
    run: doUpdate,
    loading: loadingUpdate,
    error: errorOnUpdate,
  } = useRequest(
    async (data: DomainFormType) => {
      if (!editItem) return handleCancle();
      const res = await catchCommonResponseError(Api.Domain.update(editItem.ID, data));
      console.log('res', res);
      handleCancle();
      message.success('更新成功');
      doLoadList();
    },
    {
      manual: true,
    },
  );
  useError(errorOnUpdate);

  const [form] = Form.useForm<DomainFormType>();
  const [isVonderChange, setIsVonderChange] = useState<boolean>(false);

  const cleanForm = () => {
    form.resetFields();
    setEditItem(null);
    setIsVonderChange(false);
  };

  const [editModuleVisible, setEditModuleVisible] = useState<boolean>(false);

  const getHandleEdit = (item: DomainType) => {
    return () => {
      const updateItem = Api.Domain.utils.fromItemToUpdateRequest(item);
      setEditItem(item);
      setEditModuleVisible(true);
      form.setFieldsValue({
        ...updateItem,
        ICP_reg_boolean: updateItem.ICP_reg === 1,
      });
    };
  };

  const handleCancle = () => {
    setEditModuleVisible(false);
  };

  const hanldeOk = () => {
    form
      .validateFields()
      .then(async (res) => {
        console.log(res);
        const next = editItem ? doUpdate : doCreate;
        next(res);
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <div className="p-4 min-h-full space-y-4">
      <Space className="w-full flex justify-end">
        <Button type="primary" onClick={() => setEditModuleVisible(true)}>
          新增
        </Button>
        <Button onClick={() => doLoadList()} icon={<RedoOutlined />} type="text" />
      </Space>
      <Card loading={loadingList}>
        <Table
          dataSource={dataSource}
          rowKey="ID"
          columns={[
            ...BaseColumns,
            {
              title: 'Action',
              key: 'action',
              // eslint-disable-next-line react/display-name
              render: (_: any, record: DomainType) => (
                <Space size="middle">
                  <Button type="primary" onClick={getHandleEdit(record)}>
                    修改
                  </Button>
                  <DeleteButton item={record} onDelete={removeList} />
                </Space>
              ),
            },
          ]}
        />
      </Card>
      {/* transitionName=""和maskTransitionName=""是去除弹框动画属性 */}
      <Modal
        // transitionName=""
        // maskTransitionName=""
        width={700}
        title={editItem ? '修改信息' : '新增信息'}
        open={editModuleVisible}
        onOk={hanldeOk}
        okButtonProps={{ loading: isEditing ? loadingUpdate : loadingCreate }}
        onCancel={handleCancle}
        afterClose={cleanForm}>
        <Form
          form={form}
          requiredMark={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="是否ICP备案" name="ICP_reg_boolean">
            <Switch
              disabled={isEditing}
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked={form.getFieldValue('ICP_reg') === 1}
            />
          </Form.Item>
          <Form.Item
            name="vendor"
            label="DNS 接入方"
            rules={[{ required: true, message: '请选择DNS接入方' }]}>
            <Radio.Group
              onChange={(e) => setIsVonderChange(e.target.value !== editItem?.vendor)}>
              {Object.entries(VendorNameMap).map(([key, value]) => (
                <Radio.Button key={key} value={key}>
                  {value}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="api_id"
            name="api_id"
            rules={
              isEditing && !isVonderChange
                ? []
                : [{ required: true, message: '请输入api_id' }]
            }>
            <Input placeholder={isEditing && !isVonderChange ? '不修改请留空' : ''} />
          </Form.Item>
          <Form.Item
            label="api_secret"
            name="api_secret"
            rules={
              isEditing && !isVonderChange
                ? []
                : [{ required: true, message: '请输入api_secret' }]
            }>
            <Input placeholder={isEditing && !isVonderChange ? '不修改请留空' : ''} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Home;
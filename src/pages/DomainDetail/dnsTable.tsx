import { FileTextFilled, FileTextOutlined, RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ColumnType } from 'antd/es/table';
import { TextProps } from 'antd/es/typography/Text';
import React, { useEffect } from 'react';

import * as Api from '@/api';
import { catchCommonResponseError, MessageError, useError } from '@/error';

import { RowFormContext } from './context';
import CreateOrUpdateDnsButton from './createOrUpdateDnsBtn';
import RemoveDnsButton from './removeDnsBtn';
import { DnsItem } from './type';

const DnsTypeList = ['A', 'CNAME', 'MX', 'TXT', 'NS', 'AAAA', 'SRV', 'CAA', 'SPF'];

const TableNormalTextItem: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    textProps?: TextProps & React.RefAttributes<HTMLSpanElement>;
  }
> = ({ children, className, textProps, ...props }) => {
  return (
    <div
      {...props}
      className={
        className +
        ' flex items-center border rounded border-solid border-transparent transition hover:border-blue-500'
      }>
      <Typography.Text
        {...textProps}
        ellipsis={{
          tooltip: (
            <Typography.Text copyable className="text-white">
              {children}
            </Typography.Text>
          ),
        }}>
        {children}
      </Typography.Text>
    </div>
  );
};

const TableRowWithFormProvider: React.FC<{
  record: DnsItem;
}> = ({ record, ...props }) => {
  const [form] = Form.useForm<Api.Domain.DomainDNSItem>();
  useEffect(() => {
    form.setFieldsValue(record?.origin || {});
  }, [record?.editing]);
  return (
    <RowFormContext.Provider value={form}>
      <tr {...props} />
    </RowFormContext.Provider>
  );
};

const TableCellWithFormItem: React.FC<{
  record: DnsItem;
  children: React.ReactNode;
}> = ({ record, children, ...props }) => {
  const form = React.useContext(RowFormContext);
  if (!form || !record?.editing) {
    return <td {...props}>{children}</td>;
  }
  return (
    <td {...props}>
      <Form form={form}>{children}</Form>
    </td>
  );
};

const baseColumns: ColumnType<DnsItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id: number | string) => {
      return (
        <TableNormalTextItem className="w-8">
          {typeof id === 'string' && id.startsWith('tmp-') ? '新建' : id}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: '主机记录',
    key: 'name',
    render: (_: unknown, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item
            name="name"
            className="w-24 h-8 m-0"
            rules={[{ required: true, message: '记录不能为空' }]}>
            <Input />
          </Form.Item>
        );
      }
      return (
        <TableNormalTextItem onClick={() => record.setEditing(true)} className="w-24 h-8">
          {record.origin?.name}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: '记录类型',
    key: 'type',
    render: (_: unknown, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item name="type" noStyle>
            <Select className="w-16 h-8">
              {DnsTypeList.map((item) => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      }
      return (
        <TableNormalTextItem onClick={() => record.setEditing(true)} className="w-16 h-8">
          {record.origin?.type}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: '记录值',
    key: 'content',
    render: (_: unknown, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item
            name="content"
            className="w-48 h-8 m-0"
            rules={[
              {
                required: true,
                message: '记录值不能为空',
              },
            ]}>
            <Input />
          </Form.Item>
        );
      }
      return (
        <TableNormalTextItem onClick={() => record.setEditing(true)} className="w-48 h-8">
          {record.origin?.content}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: '优先级',
    key: 'priority',
    render: (_: unknown, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item name="priority" className="w-16 h-8 m-0">
            <InputNumber />
          </Form.Item>
        );
      }
      return (
        <TableNormalTextItem onClick={() => record.setEditing(true)} className="w-16 h-8">
          {record.origin?.priority || '-'}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: 'TTL',
    key: 'ttl',
    render: (_: unknown, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item name="ttl" className="w-20 h-8 m-0">
            <InputNumber />
          </Form.Item>
        );
      }
      const isAuto =
        record.origin?.ttl === 1 &&
        record.vendor === Api.Domain.DomainVendorMap.cloudflare;
      return (
        <TableNormalTextItem
          onClick={() => record.setEditing(true)}
          className="w-20 h-8"
          textProps={{ type: isAuto ? 'secondary' : undefined }}>
          {isAuto ? 'auto' : record.origin?.ttl}
        </TableNormalTextItem>
      );
    },
  },
];

const vendorCustomizeColums: Record<Api.Domain.DomainVendor, ColumnType<DnsItem>[]> = {
  [Api.Domain.DomainVendorMap.dnspod]: [],
  [Api.Domain.DomainVendorMap.aliyun]: [],
  [Api.Domain.DomainVendorMap.cloudflare]: [
    {
      title: '代理状态',
      key: 'proxied',
      render: (_: unknown, record: DnsItem) => {
        if (record.editing) {
          return (
            <Form.Item name="proxied" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          );
        }
        return (
          <TableNormalTextItem
            onClick={() => record.setEditing(true)}
            className="w-16 h-8"
            textProps={{ type: record.origin?.proxied ? 'success' : 'danger' }}>
            {record.origin?.proxied ? '开启' : '关闭'}
          </TableNormalTextItem>
        );
      },
    },
  ],
  [Api.Domain.DomainVendorMap.huawei]: [],
};

const actionColums: ColumnType<DnsItem> = {
  title: '操作',
  key: 'action',
  render: (_: unknown, record: DnsItem) => {
    return (
      <Space size="middle" className="w-48">
        {record.editing ? (
          <Form.Item noStyle>
            <CreateOrUpdateDnsButton
              item={record}
              onUpdated={record.onUpdate}
              onCreated={record.onCreate}
            />
            <Button onClick={() => record.setEditing(false)}>取消</Button>
          </Form.Item>
        ) : (
          <>
            <Popover content={record.origin?.comment || '点击添加备注'}>
              <Button
                type="text"
                icon={record.origin?.comment ? <FileTextFilled /> : <FileTextOutlined />}
                onClick={record.doEditComment.bind(record)}
              />
            </Popover>
            <RemoveDnsButton item={record} onDelete={record.onDelete} />
          </>
        )}
      </Space>
    );
  },
};

const DnsTable: React.FC<{
  id: number;
  vendor: Api.Domain.DomainVendor;
}> = (props) => {
  const { id, vendor } = props;

  const [removeIds, setRemoveIds] = React.useState<(number | string)[]>([]);
  const [editingIds, setEditingIds] = React.useState<(number | string)[]>([]);
  const [newDnsItems, setNewDnsItems] = React.useState<DnsItem[]>([]);
  const [updateDnsItems, setUpdateDnsItems] = React.useState<
    (DnsItem & { oldId?: DnsItem['id'] })[]
  >([]);

  const onDnsItemCreated: DnsItem['onCreate'] = (oldItem, newData) => {
    setNewDnsItems((prev) =>
      newData
        ? prev
            .slice()
            .map((item) => (item.id === oldItem.id ? getNormalDnsProps(newData) : item))
        : prev.filter((item) => item.id !== oldItem.id),
    );
  };
  const onDnsItemUpdated: DnsItem['onUpdate'] = (oldItem, newData) => {
    const item: (typeof updateDnsItems)[number] = getNormalDnsProps(newData);
    const oldId =
      'oldId' in oldItem && oldItem.oldId ? (oldItem as typeof item).oldId : oldItem.id;
    if (oldId !== newData.id) {
      item.oldId = oldId;
    }
    setUpdateDnsItems((prev) =>
      prev
        .filter((item) => item.id !== newData.id && item.id !== oldItem.id)
        .concat(item),
    );
    setEditingIds((prev) => prev.filter((id) => id !== oldItem.id));
  };

  const onDnsItemDeleted: DnsItem['onDelete'] = (item) => {
    setRemoveIds((prev) => prev.concat(item.id));
  };

  const {
    run: doLoadDnsList,
    loading: loadingDnsList,
    data: dnsList,
    error: errorOnDnsList,
  } = useRequest(async () => {
    const res = await catchCommonResponseError(Api.Domain.dnsList(id));
    if (res.data.status !== 200) {
      throw new MessageError('error', res.data.errors || '未知错误(#87)');
    }
    const serverSideRes = res.data.data;
    if (!serverSideRes.success) {
      throw new MessageError('error', serverSideRes.errors || '未知错误(#EF23)');
    }
    setNewDnsItems([]);
    setUpdateDnsItems([]);
    setEditingIds([]);
    setRemoveIds([]);
    return serverSideRes.result;
  });
  useError(errorOnDnsList);

  const {
    run: doDnsCommentUpdate,
    loading: loadingDnsCommentUpdate,
    error: errorOnDnsCommentUpdate,
  } = useRequest(
    async () => {
      const comment = form.getFieldValue('comment');
      if (!editingDnsItem || !editingDnsItem.origin)
        throw new MessageError('error', '未选中DNS项(#RF23)');
      const fullData = {
        ...editingDnsItem.origin,
        comment: comment || undefined,
      } satisfies Api.Domain.DomainDNSItem;
      const res = await catchCommonResponseError(
        Api.Domain.dnsUpdate(id, editingDnsItem.id, fullData),
      );
      if (res.data.status !== 200) {
        throw new MessageError('error', res.data.errors || '未知错误(#87)');
      }
      onDnsItemUpdated(editingDnsItem, res.data.data);
      handleCommentModalClose();
    },
    {
      manual: true,
    },
  );
  useError(errorOnDnsCommentUpdate);

  const getNormalDnsProps = (item: Api.Domain.DomainDNSItem): DnsItem => ({
    ...item,
    id: item.id,
    vendor,
    origin: item,
    new: false,
    domainId: id,
    editing: false,
    deleted: false,
    setEditing: (editing: boolean) => {
      if (editing) {
        setEditingIds([...editingIds, item.id]);
      } else {
        setEditingIds(editingIds.filter((id) => id !== item.id));
      }
    },
    doEditComment() {
      setEditingDnsItem(this);
      setIsCommentModalVisible(true);
      form.setFieldsValue(this);
    },
    onCreate: onDnsItemCreated,
    onUpdate: onDnsItemUpdated,
    onDelete: onDnsItemDeleted,
  });

  const newDnsItem = () => {
    setNewDnsItems((prev) => {
      const tmpId = `tmp-${prev.length}-${Date.now()}`;
      setEditingIds((prev) => [...prev, tmpId]);
      return [
        {
          id: tmpId,
          vendor,
          new: true,
          domainId: id,
          name: '',
          type: 'A',
          content: '',
          priority: 0,
          ttl: 600,
          comment: '',
          editing: false,
          deleted: false,
          setEditing: (editing: boolean) => {
            if (!editing) {
              setNewDnsItems((prev) => prev.filter((item) => item.id !== tmpId));
            }
          },
          doEditComment: () => void 0,
          onCreate: onDnsItemCreated,
          onUpdate: onDnsItemUpdated,
          onDelete: onDnsItemDeleted,
        },
        ...prev,
      ];
    });
  };

  const dnsListExtra = [
    ...newDnsItems,
    ...(dnsList?.map((i) => getNormalDnsProps(i)) || []),
  ]
    .map((item) => {
      const updateItem = updateDnsItems.find(
        (updateItem) => updateItem.id === item.id || updateItem.oldId === item.id,
      );
      return updateItem || item;
    })
    .map((item) => {
      item.deleted = removeIds.includes(item.id);
      item.editing = editingIds.includes(item.id);

      return item;
    })
    .filter((item) => !item.deleted);

  const [editingDnsItem, setEditingDnsItem] = React.useState<DnsItem | null>(null);
  const [isCommentModalVisible, setIsCommentModalVisible] = React.useState(false);
  const [form] = Form.useForm<DnsItem>();

  const handleCommentModalClose = () => {
    setIsCommentModalVisible(false);
    setEditingDnsItem(null);
    form.resetFields();
  };

  const columns = [
    ...baseColumns,
    ...(vendorCustomizeColums[vendor] || []),
    actionColums,
  ].map((item) => {
    return {
      ...item,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onCell(record: DnsItem): any {
        return { record };
      },
    };
  });

  return (
    <>
      <div className="w-full flex">
        <div className="flex flex-1">
          <Button type="primary" onClick={newDnsItem}>
            添加记录
          </Button>
        </div>
        <div className="flex">
          <Button icon={<RedoOutlined />} type="text" onClick={doLoadDnsList}></Button>
        </div>
      </div>
      <Table
        loading={loadingDnsList}
        onRow={(record) => {
          return {
            record,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;
        }}
        components={{
          body: {
            row: TableRowWithFormProvider,
            cell: TableCellWithFormItem,
          },
        }}
        dataSource={dnsListExtra}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
      <Modal
        title="备注"
        open={isCommentModalVisible}
        onCancel={handleCommentModalClose}
        okButtonProps={{ loading: loadingDnsCommentUpdate }}
        onOk={doDnsCommentUpdate}>
        <Form form={form}>
          <Form.Item name="comment">
            <TextArea
              showCount
              maxLength={200}
              style={{ height: 120, resize: 'none' }}
              placeholder="填写该条记录的备注信息，方便后续管理"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DnsTable;

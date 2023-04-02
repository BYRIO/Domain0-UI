import {
  DeleteFilled,
  DeleteOutlined,
  FileTextFilled,
  FileTextOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Space,
  Table,
  theme,
  Typography,
} from 'antd';
import { FormContext } from 'antd/es/form/context';
import TextArea from 'antd/es/input/TextArea';
import { ColumnType } from 'antd/es/table';
import React, { useEffect } from 'react';

import * as Api from '@/api';
import DoubleClickButton from '@/components/DoubleClickButton';
import { catchCommonResponseError, MessageError, useError } from '@/error';

import { RowFormContext } from './context';
import CreateOrUpdateDnsButton from './createOrUpdateDnsBtn';
import RemoveDnsButton from './removeDnsBtn';
import { DnsItem } from './type';

const DnsTypeList = ['A', 'CNAME', 'MX', 'TXT', 'NS', 'AAAA', 'SRV', 'CAA', 'SPF'];

const TableNormalTextItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={
        className +
        ' flex items-center border rounded border-solid border-transparent transition hover:border-blue-500'
      }>
      <Typography.Text
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
  const [form] = Form.useForm<DnsItem>();
  useEffect(() => {
    form.setFieldsValue(record);
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

const columns: ColumnType<DnsItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id: number | string) => {
      return <>{typeof id === 'string' && id.startsWith('tmp-') ? '新建' : id}</>;
    },
  },
  {
    title: '主机记录',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, record: DnsItem) => {
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
          {name}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: '记录类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item name="type" noStyle>
            <Select value={type} className="w-16 h-8">
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
          {type}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: '记录值',
    dataIndex: 'content',
    key: 'content',
    render: (content: string, record: DnsItem) => {
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
          {content}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority: number, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item name="priority" className="w-16 h-8 m-0">
            <InputNumber />
          </Form.Item>
        );
      }
      return (
        <TableNormalTextItem onClick={() => record.setEditing(true)} className="w-16 h-8">
          {priority}
        </TableNormalTextItem>
      );
    },
  },
  {
    title: 'TTL',
    dataIndex: 'ttl',
    key: 'ttl',
    render: (ttl: number, record: DnsItem) => {
      if (record.editing) {
        return (
          <Form.Item name="ttl" className="w-20 h-8 m-0">
            <InputNumber />
          </Form.Item>
        );
      }
      return (
        <TableNormalTextItem onClick={() => record.setEditing(true)} className="w-20 h-8">
          {ttl}
        </TableNormalTextItem>
      );
    },
  },
  {
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
              <Popover content={record.comment || '点击添加备注'}>
                <Button
                  type="text"
                  icon={record.comment ? <FileTextFilled /> : <FileTextOutlined />}
                  onClick={record.doEditComment.bind(record)}
                />
              </Popover>
              <RemoveDnsButton item={record} onDelete={record.onDelete} />
            </>
          )}
        </Space>
      );
    },
  },
];

columns.forEach((item) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item.onCell = (record): any => ({
    record,
  });
});

const DnsTable: React.FC<{
  id: number;
}> = (props) => {
  const { id } = props;

  const [removeIds, setRemoveIds] = React.useState<(number | string)[]>([]);
  const [editingIds, setEditingIds] = React.useState<(number | string)[]>([]);
  const [newDnsItems, setNewDnsItems] = React.useState<DnsItem[]>([]);
  const [updateDnsItems, setUpdateDnsItems] = React.useState<DnsItem[]>([]);

  const onDnsItemCreated: DnsItem['onCreate'] = (item, newData) => {
    setNewDnsItems((prev) =>
      prev
        .slice()
        .map((item) => (item.id === newData.id ? getNormalDnsProps(newData) : item)),
    );
  };
  const onDnsItemUpdated: DnsItem['onUpdate'] = (item, newData) => {
    setUpdateDnsItems((prev) =>
      prev
        .filter((item) => item.id !== newData.id)
        .concat(getNormalDnsProps(newData, false)),
    );
    setEditingIds((prev) => prev.filter((id) => id !== newData.id));
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
      if (!editingDnsItem) throw new MessageError('error', '未选中DNS项(#RF23)');
      const fullData = {
        ...editingDnsItem,
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

  const getNormalDnsProps = (
    item: Api.Domain.DomainDNSItem,
    editing = editingIds.includes(item.id),
    deleted = removeIds.includes(item.id),
  ): DnsItem => ({
    ...item,
    new: false,
    domainId: id,
    editing,
    deleted,
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
      return [
        {
          id: tmpId,
          new: true,
          domainId: id,
          name: '',
          type: 'A',
          content: '',
          priority: 0,
          ttl: 600,
          comment: '',
          editing: true,
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
      const updateItem = updateDnsItems.find((updateItem) => updateItem.id === item.id);
      return updateItem || item;
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

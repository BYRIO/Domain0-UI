import { DeleteFilled } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import React from 'react';

import * as Api from '@/api';
import DoubleClickButton from '@/components/DoubleClickButton';
import { catchCommonResponseError, useError } from '@/error';

import { DnsItem } from './type';

const RemoveDnsButton: React.FC<{
  item: DnsItem;
  onDelete: (item: DnsItem) => void;
}> = ({ item, onDelete }) => {
  const {
    run: doDelete,
    loading: loadingDelete,
    error: errorOnDelete,
  } = useRequest(
    async () => {
      const res = await catchCommonResponseError(
        Api.Domain.dnsRemove(item.domainId, item.id),
      );
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
      icon={<DeleteFilled />}
      endBtnProps={{ type: 'primary' }}
      onFinalClick={doDelete}>
      <DoubleClickButton.End>确定删除?</DoubleClickButton.End>
    </DoubleClickButton>
  );
};

export default RemoveDnsButton;

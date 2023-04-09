import { useRequest } from 'ahooks';
import { Card, Space, Tabs, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import * as Api from '@/api';
import { VendorNameMap } from '@/constants/domainVendor';
import { catchCommonResponseError, useError } from '@/error';

import AccessTable from './accessTable';
import DnsTable from './dnsTable';

const { Text } = Typography;

const DomainDetail: React.FC = () => {
  const id = Number.parseInt(useParams().id as string);
  const {
    run: doLoadDetail,
    data: detailResponse,
    loading: detailLoading,
    error: detailError,
  } = useRequest(() => catchCommonResponseError(Api.Domain.detail(id)), {
    cacheKey: `domain-detail-${id}`,
  });
  useError(detailError);

  const domain = detailResponse?.data.data;

  return (
    <div className="p-4 min-h-full space-y-4">
      <Card loading={detailLoading}>
        <Card title="基本信息" bordered={false}>
          <p className="flex space-x-5">
            <Text className="w-24 block text-right">ID:</Text>
            <Text>{domain?.ID}</Text>
          </p>
          <p className="flex space-x-5">
            <Text className="w-24 block text-right">域名:</Text>
            <Text>{domain?.Name}</Text>
          </p>
          <p className="flex space-x-5">
            <Text className="w-24 block text-right">ICP 备案:</Text>
            <Text>{domain?.ICP_reg ? '是' : '否'}</Text>
          </p>
          <p className="flex space-x-5">
            <Text className="w-24 block text-right">DNS 提供商:</Text>
            <Text>
              {VendorNameMap[domain?.vendor as Api.Domain.DomainVendor] || domain?.vendor}
            </Text>
          </p>
          <p className="flex space-x-5">
            <Text className="w-24 block text-right">创建时间:</Text>
            <Text>
              {domain?.CreatedAt ? new Date(domain?.CreatedAt).toLocaleString() : ''}
            </Text>
          </p>
        </Card>
        <Tabs
          className="w-full mt-4"
          defaultActiveKey="dns"
          items={[
            {
              label: 'DNS',
              key: 'dns',
              children: <DnsTable id={id} />,
            },
            {
              label: 'Access Management',
              key: 'access',
              children: <AccessTable id={id} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default DomainDetail;

import { RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Descriptions, Space, Tabs, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import * as Api from '@/api';
import { VendorNameMap } from '@/constants/domainVendor';
import { catchCommonResponseError, useError } from '@/error';

import AccessTable from './accessTable';
import DnsTable from './dnsTable';

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
        <Descriptions
          title="基本信息"
          extra={<Button type="text" icon={<RedoOutlined />} onClick={doLoadDetail} />}>
          <Descriptions.Item label="ID">{domain?.ID}</Descriptions.Item>
          <Descriptions.Item label="域名">{domain?.Name}</Descriptions.Item>
          <Descriptions.Item label="ICP 备案">
            {domain?.ICP_reg ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label="DNS 提供商">
            {VendorNameMap[domain?.vendor as Api.Domain.DomainVendor] || domain?.vendor}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {domain?.CreatedAt ? new Date(domain?.CreatedAt).toLocaleString() : ''}
          </Descriptions.Item>
        </Descriptions>
        <Tabs
          className="w-full mt-4"
          defaultActiveKey="dns"
          items={[
            {
              label: 'DNS',
              key: 'dns',
              children: (
                <DnsTable id={id} vendor={domain?.vendor as Api.Domain.DomainVendor} />
              ),
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

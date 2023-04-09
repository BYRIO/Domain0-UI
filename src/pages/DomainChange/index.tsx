import { Tabs } from 'antd';
import React, { FC } from 'react';

import ApplyTab from './applyTab';
import ApproveTab from './approveTab';

const DomainChange: FC = () => {
  return (
    <div className="p-4 min-h-full space-y-4">
      <Tabs
        className="w-full mt-4"
        defaultActiveKey="apply"
        items={[
          {
            label: '我的申请',
            key: 'apply',
            children: <ApplyTab />,
          },
          {
            label: '待我审批',
            key: 'approve',
            children: <ApproveTab />,
          },
        ]}
      />
    </div>
  );
};

export default DomainChange;

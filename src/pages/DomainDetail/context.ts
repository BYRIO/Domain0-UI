import { FormInstance } from 'antd';
import React from 'react';

import * as Api from '@/api';

export const RowFormContext = React.createContext<FormInstance<
  Pick<Api.Domain.DomainDNSItem, 'name' | 'type' | 'content' | 'ttl' | 'priority'>
> | null>(null);

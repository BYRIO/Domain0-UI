import { FormInstance } from 'antd';

import * as Api from '@/api';

export type DnsItem = {
  new: boolean;
  id: Api.Domain.DomainDNSItem['id'];
  origin?: Api.Domain.DomainDNSItem;
  domainId: number;
  editing: boolean;
  deleted: boolean;
  setEditing: (editing: boolean) => void;
  doEditComment: () => void;

  onCreate: (item: DnsItem, newData?: Api.Domain.DomainDNSItem) => void;
  onUpdate: (item: DnsItem, newData: Api.Domain.DomainDNSItem) => void;
  onDelete: (item: DnsItem) => void;
};

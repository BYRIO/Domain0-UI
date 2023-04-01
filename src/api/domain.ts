import { getToken } from '@/store/token';
import request from '@/utils/request';

const enum Api {
  DOMAIN = '/v1/domain',
  DOMAIN_Item = '/v1/domain/:id',
}

export const DomainVendorMap = {
  cloudflare: 'cloudflare',
  dnspod: 'dnspod',
  aliyun: 'aliyun',
} as const;

export const DomainVendorList = Object.values(DomainVendorMap);

export type DomainVendor = (typeof DomainVendorList)[number];

export interface DomainCreateRequest {
  ICP_reg: 0 | 1;
  api_id: string;
  api_secret: string;
  name: string;
  vendor: DomainVendor;
}

export type DomainUpdateRequest = Partial<DomainCreateRequest>;

export interface DomainItem {
  /** 2023-04-02T01:34:25.624796+08:00 */
  CreatedAt: string;
  DeletedAt: null | string;
  UpdatedAt: string;
  ICP_reg: 0 | 1;
  ID: number;
  Name: string;
  Users: null;
  vendor: DomainVendor;
}

export const utils = {
  fromItemToUpdateRequest(item: DomainItem): DomainUpdateRequest {
    return {
      name: item.Name,
      vendor: item.vendor,
      ICP_reg: item.ICP_reg,
    };
  },
};

export type DomainListResponse = {
  status: 200 | number;
  data: DomainItem[];
  error?: string;
};

export function list(token = getToken()) {
  return request<DomainListResponse>({
    url: Api.DOMAIN,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function create(data: DomainCreateRequest, token = getToken()) {
  return request({
    url: Api.DOMAIN,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

export function update(id: number, data: DomainUpdateRequest, token = getToken()) {
  return request({
    url: Api.DOMAIN_Item.replace(':id', id.toString()),
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: Object.fromEntries(
      Object.entries(data).filter(([k, v]) => k !== 'ICP_reg' && !!v),
    ),
  });
}

export function remove(id: number, token = getToken()) {
  return request({
    url: Api.DOMAIN_Item.replace(':id', id.toString()),
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

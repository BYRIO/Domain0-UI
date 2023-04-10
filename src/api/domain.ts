import { getToken } from '@/store/token';
import request from '@/utils/request';

const enum Api {
  DOMAIN = '/v1/domain',
  DOMAIN_Item = '/v1/domain/:id',
  DOMAIN_DNS = '/v1/domain/:id/dns',
  DOMAIN_DNS_Item = '/v1/domain/:id/dns/:dns_id',

  DOMAIN_User = '/v1/domain/:id/user',
  DOMAIN_User_Item = '/v1/domain/:id/user/:user_id',
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

export type DomainDetailResponse = {
  status: 200 | number;
  data: DomainItem;
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

export function detail(id: number, token = getToken()) {
  return request<DomainDetailResponse>({
    url: Api.DOMAIN_Item.replace(':id', id.toString()),
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface DomainDNSItem {
  comment?: string;
  content: string;
  id: number | string;
  name: string;
  priority: number;
  ttl: number;
  type: string;

  // 以下字段在部分情况下返回
  proxied?: boolean;
}

export interface DomainDNSListServerSideResponse {
  success: boolean;
  result?: DomainDNSItem[];
  errors?: string[];
  messages?: string[];
}

export interface DomainDNSListResponse {
  status: 200 | number;
  data: DomainDNSListServerSideResponse;
  errors?: string;
}

export interface DomainDNSCreateOrUpdateNeedApproveResponse {
  status: 208;
  data: string;
  errors: never;
}

export interface DomainDNSCraeteOrUpdateSuccessResponse {
  status: 200 | 201;
  data: DomainDNSItem;
  errors: never;
}

export interface DomainDNSCraeteOrUpdateCommonRequest {
  status: 500;
  data: unknown;
  errors?: string;
}

export type DomainDNSCraeteOrUpdateRequest =
  | DomainDNSCreateOrUpdateNeedApproveResponse
  | DomainDNSCraeteOrUpdateSuccessResponse
  | DomainDNSCraeteOrUpdateCommonRequest;

export function dnsList(id: number, token = getToken()) {
  return request<DomainDNSListResponse>({
    url: Api.DOMAIN_DNS.replace(':id', id.toString()),
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function dnsCreate(
  id: number,
  _data: Omit<DomainDNSItem, 'id'>,
  token = getToken(),
) {
  const data: Partial<DomainDNSItem> = Object.assign({}, _data);
  delete data.id;
  return request<DomainDNSCraeteOrUpdateRequest>({
    url: Api.DOMAIN_DNS.replace(':id', id.toString()),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

export function dnsUpdate(
  id: number,
  dnsId: string | number,
  data: DomainDNSItem,
  token = getToken(),
) {
  return request<DomainDNSCraeteOrUpdateRequest>({
    url: Api.DOMAIN_DNS_Item.replace(':id', id.toString()).replace(
      ':dns_id',
      dnsId.toString(),
    ),
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

export function dnsRemove(id: number, dnsId: string | number, token = getToken()) {
  return request({
    url: Api.DOMAIN_DNS_Item.replace(':id', id.toString()).replace(
      ':dns_id',
      dnsId.toString(),
    ),
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export enum DomainAcccessRole {
  ReadOnly = 0,
  ReadWrite = 1,
  Manager = 2,
  Owner = 3,
}

export interface DomainUserAccessItem {
  domain_id: number;
  domain_name: string;
  email: string;
  role: DomainAcccessRole;
  user_id: number;
  username: string;
}

export interface DomainUserAccessListResponse {
  status: 200 | number;
  data: DomainUserAccessItem[];
  errors?: string;
}

export function userList(id: number, token = getToken()) {
  return request<DomainUserAccessListResponse>({
    url: Api.DOMAIN_User.replace(':id', id.toString()),
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function userCreate(
  id: number,
  data: { user_id: number; role: DomainAcccessRole },
  token = getToken(),
) {
  return request({
    url: Api.DOMAIN_User.replace(':id', id.toString()),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  });
}

export function userRemove(id: number, userId: number, token = getToken()) {
  return request({
    url: Api.DOMAIN_User_Item.replace(':id', id.toString()).replace(
      ':user_id',
      userId.toString(),
    ),
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

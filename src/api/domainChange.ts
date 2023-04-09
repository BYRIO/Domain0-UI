import { getToken } from '@/store/token';
import request from '@/utils/request';

import { DomainCreateRequest, DomainDNSItem } from './domain';

const enum Api {
  DOMAIN_CHANGE_apply = '/v1/domain/change/myapply',
  DOMAIN_CHANGE_approve = '/v1/domain/change/myapprove',
  DOMAIN_CHANGE_item = '/v1/domain/change/:id',
}

export enum ActionType {
  Submit = 0,
  EditDNS = 1,
  EditOthers = 2,
  GrantAccess = 3,
  RevokeAccess = 4,
  Delete = 5,
}

export enum ActionStatus {
  Reviewing = 0,
  Approved = 1,
  Rejected = 2,
}

// export interface ApplyChangeItemOperation {
//   dns: DomainDNSItem;
//   domain: DomainCreateRequest;
// }

export interface ApplyChangeItem {
  ID: number;
  /** @example '2023-04-08T22:23:13.691485+08:00' */
  CreatedAt: string;
  /** @example '2023-04-08T22:23:13.691485+08:00' */
  UpdatedAt: string;
  DeletedAt: null;
  DomainId: number;
  UserId: number;
  ActionType: ActionType;
  ActionStatus: ActionStatus;
  Reason: string;
  Operation: string;
}

export interface ApplyOrApproveChangeListResponse {
  status: 200 | number;
  data: ApplyChangeItem[];
}

export function apply() {
  return request<ApplyOrApproveChangeListResponse>({
    url: Api.DOMAIN_CHANGE_apply,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function approve() {
  return request<ApplyOrApproveChangeListResponse>({
    url: Api.DOMAIN_CHANGE_approve,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function updateStatus(id: number, status: 'accept' | 'reject') {
  return request<ApplyOrApproveChangeListResponse>({
    url: Api.DOMAIN_CHANGE_item.replace(':id', id.toString()),
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    params: {
      opt: status,
    },
  });
}

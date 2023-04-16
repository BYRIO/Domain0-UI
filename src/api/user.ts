import { getToken, UserRole } from '@/store/token';
import request from '@/utils/request';

const enum Api {
  USER_Login = '/v1/user/login',
  USER_Register = '/v1/user/register',

  USER = '/v1/user',
  USER_Item = '/v1/user/:id',
}

export interface LoginResponse {
  status: 200 | number;
  data: string;
  errors?: string;
}

export function login(data: { username: string; password: string }) {
  return request<LoginResponse>({
    url: Api.USER_Login,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      user: data.username,
      pass: data.password,
    }).toString(),
  });
}

export function register(data: { email: string; password: string }) {
  return request<LoginResponse>({
    url: Api.USER_Register,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      email: data.email,
      pass: data.password,
    }).toString(),
  });
}

export interface UserInfoItem {
  CreatedAt: string;
  DeletedAt: null;
  Domains: null;
  Email: string;
  ID: number;
  Name: string;
  Role: UserRole;
  StuId: { String: string; Valid: boolean };
  UpdatedAt: string;
}

export interface UserInfoResponse {
  status: 200 | number;
  data: UserInfoItem;
  errors?: string;
}

export function detail(id: number, token = getToken()) {
  return request<UserInfoResponse>({
    url: Api.USER_Item.replace(':id', id.toString()),
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface UserInfoUpdateRequest {
  email: string;
  password: string;
  stuid: string;
  name: string;
  role: UserRole;
}

export function update(
  id: number,
  data: Partial<UserInfoUpdateRequest>,
  token = getToken(),
) {
  return request({
    url: Api.USER_Item.replace(':id', id.toString()),
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== ''),
    ),
  });
}

export interface UserInfoListResponse {
  status: 200 | number;
  data: UserInfoItem[];
  errors?: string;
}

export function list(token = getToken()) {
  return request<UserInfoListResponse>({
    url: Api.USER,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function remove(id: number, token = getToken()) {
  return request({
    url: Api.USER_Item.replace(':id', id.toString()),
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function callback(code: string, state: string) {
  return request<LoginResponse>({
    url: '/v1/user/callback',
    method: 'GET',
    params: {
      code,
      state,
    },
  });
}

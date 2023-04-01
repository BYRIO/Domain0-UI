import request from '@/utils/request';

const enum Api {
  USER_Login = '/v1/user/login',
  USER_Register = '/v1/user/register',
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

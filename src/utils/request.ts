// import { message } from 'antd';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// 环境
// const env = process.env.NDOE_ENV || 'development';

const BASE_URL = '/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

// // 请求拦截
// axios.interceptors.request.use((request) => {
//   // 添加token、应用信息等
//   request.headers = {
//     ...request.headers,
//     token: sessionStorage.getItem('x-viteApp-token') || '',
//   };
//   return request;
// });

// 对返回的结果做处理
// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (err) => {
//     console.log('err', err);
//   },
// );

export default instance;
export type { AxiosInstance, AxiosResponse };

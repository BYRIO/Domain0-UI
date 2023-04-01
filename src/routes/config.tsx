import React from 'react';
import { RouteObject } from 'react-router-dom';

import Authority from '@/layouts/Authority';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import Redirect from '@/pages/Redirect';

const layouts: RouteObject[] = [
  {
    path: '/',
    index: true,
    element: <Redirect />,
  },
  {
    path: '/sys',
    element: (
      <Authority>
        <BasicLayout />
      </Authority>
    ),
    // title: '系统路由',
    // exact: true,
    children: [
      {
        path: '/sys/home',
        index: true,
        element: <Redirect />,
      },
      {
        path: '/sys/domain',
        // title: '首页',
        // icon: 'home',
        // component: React.lazy(() => import('@/pages/Home')),
        async lazy() {
          const { default: Home } = await import('@/pages/Domain');
          return { Component: Home };
        },
      },
      {
        path: '/sys/about',
        // title: '关于',
        // icon: 'home',
        // lazy: () => import('@/pages/About'),
        async lazy() {
          const { default: About } = await import('@/pages/About');
          return { Component: About };
        },
      },
    ],
  },
  {
    path: '/user',
    element: <UserLayout />,
    // title: '用户路由',
    // redirect: '/user/login',
    children: [
      {
        path: '/user/login',
        index: true,
        // component: React.lazy(() => import('@/pages/User/Login')),
        // title: '登录',
        async lazy() {
          const { default: Login } = await import('@/pages/User/Login');
          return { Component: Login };
        },
      },
      {
        path: '/user/register',
        // component: 'pages/User/Register',
        // title: '注册',
        async lazy() {
          const { default: Register } = await import('@/pages/User/Register');
          return { Component: Register };
        },
      },
    ],
  },
  {
    path: '/noFond',
    // title: '页面不存在',
    // component: React.lazy(() => import('@/pages/NoFond')),
    async lazy() {
      const { default: NoFond } = await import('@/pages/NoFond');
      return { Component: NoFond };
    },
  },
];

export default layouts;

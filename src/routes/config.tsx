import {
  EditOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import { matchRoutes, RouteObject, useLocation } from 'react-router-dom';

import Authority from '@/layouts/Authority';
import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import Redirect from '@/pages/Redirect';
import { UserRole } from '@/store/token';

export const sysRoutes = [
  {
    path: '/sys/domain',
    title: '域名管理',
    icon: <GlobalOutlined />,
    hideInMenu: false,
    menuActivePath: '/sys/domain',
  },
  {
    path: '/sys/domain/:id',
    title: '域名详情(id: :id)',
    icon: <GlobalOutlined />,
    hideInMenu: true,
    menuActivePath: '/sys/domain',
    parentPath: '/sys/domain',
  },
  {
    path: '/sys/domain-change',
    title: '域名变更',
    icon: <EditOutlined />,
    hideInMenu: false,
    menuActivePath: '/sys/domain-change',
  },
  {
    path: '/sys/user-self',
    title: '个人信息',
    icon: <UserOutlined />,
    hideInMenu: false,
    menuActivePath: '/sys/user-self',
  },
  {
    path: '/sys/user',
    title: '用户管理',
    icon: <TeamOutlined />,
    menuActivePath: '/sys/user',
    role: [UserRole.Admin, UserRole.SysAdmin],
  },
];

export function useMatchedSysRoutes() {
  const location = useLocation();
  const matchedRoutes = matchRoutes(sysRoutes, location.pathname);
  const formatTitle = (title: string, params: Record<string, string | undefined>) => {
    return Object.keys(params).reduce((pre, key) => {
      return pre.replace(`:${key}`, params[key] || '');
    }, title);
  };
  const res = matchedRoutes
    ? [
        {
          ...matchedRoutes[0].route,
          path: matchedRoutes[0].pathname,
          title: formatTitle(matchedRoutes[0].route.title, matchedRoutes[0].params),
        },
      ]
    : [];

  while (res[res.length - 1]?.parentPath) {
    const parent = sysRoutes.find((r) => r.path === res[0].parentPath);
    if (parent) {
      res.push(parent);
    }
  }

  return res;
}

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
        path: '/sys/domain/:id',
        async lazy() {
          const { default: DomainDetail } = await import('@/pages/DomainDetail');
          return { Component: DomainDetail };
        },
      },
      {
        path: '/sys/domain-change',
        async lazy() {
          const { default: DomainChange } = await import('@/pages/DomainChange');
          return { Component: DomainChange };
        },
      },
      {
        path: '/sys/user-self',
        async lazy() {
          const { default: UserSelf } = await import('@/pages/UserSelf');
          return { Component: UserSelf };
        },
      },
      {
        path: '/sys/user',
        async lazy() {
          const { default: User } = await import('@/pages/UserManager');
          return { Component: User };
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

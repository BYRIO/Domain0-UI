import React from 'react';
import { Navigate } from 'react-router-dom';

import { getUserInfo } from '@/store/token';

// import useStore from '../store';

const Authority: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const userinfo = getUserInfo();
  console.log('userinfo', userinfo);

  if (!userinfo) {
    return <Navigate to="/user/login" />;
  }

  return children;
};

export default Authority;

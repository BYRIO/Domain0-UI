import { Avatar } from 'antd';
import React from 'react';

import logo from '@/assets/logo.svg';

const Logo: React.FC<{ size: number }> = ({ size = 120 }) => (
  <Avatar size={size} src={logo} />
);

export default Logo;

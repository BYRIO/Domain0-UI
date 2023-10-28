import './global.less';
import './mobile.less';

import { Spin } from 'antd';
import React, { Suspense } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';

// import Authority from '@/layouts/Authority';
import routes from '@/routes/config';

const renderRoutes = createHashRouter(routes);

const App = () => {
  return (
    <Suspense fallback={<Spin size="large" className="layout__loading" />}>
      {/* <Authority> */}
      <RouterProvider router={renderRoutes} fallbackElement={<p> loading....</p>} />
      {/* </Authority> */}
    </Suspense>
  );
};

export default App;

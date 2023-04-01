import './global.less';

import { Spin } from 'antd';
import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import Authority from '@/layouts/Authority';
import routes from '@/routes/config';

const renderRoutes = createBrowserRouter(routes);

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

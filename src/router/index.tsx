import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 导入页面组件
import Home from '../page/home';

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/home',
    element: <Home />
  }
]);

// 路由提供者组件
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
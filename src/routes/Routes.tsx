import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import Register from '../PAGES/Register/Register';
import Login from '../PAGES/Login/Login';
import Main from '../PAGES/Main/Main';
import MainLayout from '../LAYOUT/MainLayout';
import Copyright from '../PAGES/Copyright/Copyright';
import Feedback from '../PAGES/FeedBack/Feedback';
import BookDetails from '../PAGES/BookDetails/BookDetails';

export interface RouteType {
  path: string;
  element: React.ReactNode;
}

// публичные маршруты
export const routes: RouteType[] = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  // { path: '*', element: <Navigate to="/login" replace /> },
  { path: '/copyright', element: <Copyright /> },
];

// приватные маршруты (только страницы, без layout)
export const privateRoutes: RouteType[] = [
  { path: '/', element: <Main /> },
  { path: '/feedback', element: <Feedback /> },
  { path: '/publications/:id', element: <BookDetails /> },
  { path: '/copyright', element: <Copyright /> },
];

// функции для рендеринга
export const renderRoutes = () =>
  routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element} />
  ));

//  Layout применяется ко всем приватным страницам через Outlet
export const renderPrivateRoutes = () => (
  <Route element={<MainLayout />}>
    {privateRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Route>
);



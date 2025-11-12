import React from "react";
import { Navigate, Route } from "react-router-dom";
import Register from "../PAGES/Register/Register";
import Login from "../PAGES/Login/Login";
import Main from "../PAGES/Main/Main";
import MainLayout from "../LAYOUT/MainLayout";
import Copyright from "../PAGES/Copyright/Copyright";
import Feedback from "../PAGES/FeedBack/Feedback";
import BookDetails from "../PAGES/BookDetails/BookDetails";
import AllPublications from "../PAGES/AllBooks/AllPublications";
import Tags from "../PAGES/Tags/Tags";

export interface RouteType {
    path: string;
    element: React.ReactNode;
}

// публичные маршруты
export const routes: RouteType[] = [
    { path: "/", element: <Main /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/publications/:id", element: <BookDetails /> },
    { path: "/allPublications", element: <AllPublications /> },
    { path: "/copyright", element: <Copyright /> },
];

// приватные маршруты (только страницы, без layout)
export const privateRoutes: RouteType[] = [
    { path: "/feedback", element: <Feedback /> },
    { path: "/tags", element: <Tags /> },
];

export const renderRoutes = () =>
    routes.map((route, index) => <Route key={index} path={route.path} element={route.element} />);

//  Layout применяется ко всем приватным страницам через Outlet
export const renderPrivateRoutes = (isAuth: boolean) =>
    isAuth
        ? privateRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
          ))
        : null;

import React from "react";
import { Route } from "react-router-dom";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Main from "../pages/Main/Main";
import Copyright from "../pages/Copyright/Copyright";
import Feedback from "../pages/FeedBack/Feedback";
import BookDetails from "../pages/BookDetails/BookDetails";
import AllPublications from "../pages/AllBooks/AllPublications";
import Tags from "../pages/Tags/Tags";
import PublicationCreate from "../pages/PublicationCreate/PublicationCreate";
import Favourites from "../pages/Favourites/Favourites";
import Subjects from "../pages/Subjects/Subjects";

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
    { path: "/subjects", element: <Subjects /> },
    { path: "/create-publication", element: <PublicationCreate /> },
    { path: "/favourites", element: <Favourites /> },
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

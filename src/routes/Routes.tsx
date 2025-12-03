import React from "react";
import { Route, RouteProps } from "react-router-dom";
import {
    AllPublicationsPage,
    BookDetailsPage,
    CopyrightPage,
    FavouritesPage,
    FeedbackPage,
    LoginPage,
    MainPage,
    PublicationCreatePage,
    RegisterPage,
    SubjectsPage,
    TagsPage,
} from "@/pages";

// публичные маршруты
export const routes: RouteProps[] = [
    { path: "/", element: <MainPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/publications/:id", element: <BookDetailsPage /> },
    { path: "/allPublications", element: <AllPublicationsPage /> },
    { path: "/copyright", element: <CopyrightPage /> },
    { path: "/tags", element: <TagsPage /> },
    { path: "/subjects", element: <SubjectsPage /> },
];

// приватные маршруты (только страницы, без layout)
export const privateRoutes: RouteProps[] = [
    { path: "/feedback", element: <FeedbackPage /> },
    { path: "/create-publication", element: <PublicationCreatePage /> },
    { path: "/favourites", element: <FavouritesPage /> },
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

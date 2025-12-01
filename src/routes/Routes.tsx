import React from "react";
import { Route, RouteProps } from "react-router-dom";
import MainPage from "@/pages/MainPage/MainPage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";
import CopyrightPage from "@/pages/CopyrightPage/CopyrightPage";
import TagsPage from "@/pages/TagsPage/TagsPage";
import SubjectsPage from "@/pages/SubjectsPage/SubjectsPage";
import FeedbackPage from "@/pages/FeedbackPage/FeedbackPage";
import PublicationCreatePage from "@/pages/PublicationCreatePage/PublicationCreatePage";
import FavouritesPage from "@/pages/FavouritesPage/FavouritesPage";
import BookDetailsPage from "@/pages/BookDetailsPage/BookDetailsPage";
import AllPublicationsPage from "@/pages/AllPublicationsPage/AllPublicationsPage";

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

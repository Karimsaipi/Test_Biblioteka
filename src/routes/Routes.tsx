import React from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";
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
import { store } from "@/store/store";
import { openProfileOverlay } from "@/store/OverlaySlice/overlaySlice";

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
function GuestPopoverRedirectHome() {
    React.useEffect(() => {
        setTimeout(() => {
            store.dispatch(openProfileOverlay());
        }, 0);
    }, []);

    return <Navigate to="/" replace />;
}

export const renderPrivateRoutes = (isAuth: boolean) =>
    privateRoutes.map((route, index) => (
        <Route
            key={index}
            path={route.path}
            element={isAuth ? route.element : <GuestPopoverRedirectHome />}
        />
    ));

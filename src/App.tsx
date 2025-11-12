import React, { JSX } from "react";
import styles from "../src/App.module.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import { renderPrivateRoutes, renderRoutes } from "./routes/Routes";
import { useAppSelector } from "./store/hooks";
import MainLayout from "./LAYOUT/MainLayout";

export default function App(): JSX.Element {
    const isAuth = useAppSelector((state) => state.auth.isAuth);

    return (
        <div className={styles.gradientBackground}>
            <Routes>
                <Route element={<MainLayout />}>
                    {renderRoutes()}

                    {renderPrivateRoutes(isAuth)}

                    <Route
                        path="*"
                        element={
                            isAuth ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
}

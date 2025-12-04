import React, { JSX, useEffect } from "react";
import styles from "./App.module.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import { renderPrivateRoutes, renderRoutes } from "./routes/Routes";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import MainLayout from "./layout/MainLayout/MainLayout";
import { restoreLastOpened } from "./store/LastOpenedSlice/lastOpenedSlice";
import ToastHot from "./widgets/ToastHot/ToastHot";

export default function App(): JSX.Element {
    const isAuth = useAppSelector((state) => state.auth.isAuth);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(restoreLastOpened());
    }, [dispatch]);

    return (
        <>
            <div className={styles.gradientBackground}>
                <MainLayout>
                    <Routes>
                        {renderRoutes()}

                        {renderPrivateRoutes(isAuth)}

                        <Route
                            path="*"
                            element={
                                isAuth ? (
                                    <Navigate to="/" replace />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                    </Routes>
                </MainLayout>
            </div>
            <ToastHot />
        </>
    );
}

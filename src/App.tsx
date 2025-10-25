import React, { JSX, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "./hooks/redux";
import styles from '../src/App.module.scss';
import { Navigate, Route, Routes } from "react-router-dom";
import { renderPrivateRoutes, renderRoutes } from "./routes/Routes";
import { useAuth } from "./context/authContext";

export default function App(): JSX.Element {
  // const dispatch = useAppDispatch();
  // const { isAuth, user } = useAppSelector(state => state.auth);

  const { isAuth } = useAuth();


  // useEffect(() => {
  //   if (isAuth) {
  //     dispatch(fetchUsers());
  //   }
  // }, [dispatch, isAuth]);

  return (
  <div className={styles.gradientBackground}>
    <Routes>
      {!isAuth ? (
        <>
          {renderRoutes()}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {renderPrivateRoutes()}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  </div>
);
}

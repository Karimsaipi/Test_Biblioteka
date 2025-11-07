import React, { JSX, useEffect } from "react";
import styles from '../src/App.module.scss';
import { Navigate, Route, Routes } from "react-router-dom";
import { renderPrivateRoutes, renderRoutes } from "./routes/Routes";
import { useAppSelector } from "./store/hooks";
;

export default function App(): JSX.Element {
  const isAuth = useAppSelector(state => state.auth.isAuth);

  console.log("isAuth =", isAuth); 

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

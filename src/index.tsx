import React from "react";
import "./index.scss";
import App from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ErrorBoundary } from "./ui";

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </ErrorBoundary>,
);

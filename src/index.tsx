import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { bindAxiosNotifier } from "./api/axios";
import { error } from "./store/notifySlice";
import ToastHost from "./components/ToastHots/ToastHost";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
bindAxiosNotifier((msg) => store.dispatch(error(msg)));

root.render(
    <Provider store={store}>
        {/* <AuthProvider> */}
        <BrowserRouter>
            <App />
            <ToastHost />
        </BrowserRouter>
        {/* </AuthProvider> */}
    </Provider>,
);

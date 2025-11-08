import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../COMPONENTS/Header/Header";
import styles from "./MainLayout.module.scss";
import AccountModal from "../COMPONENTS/AccountModal/AccountModal";

export default function MainLayout() {
    const { pathname } = useLocation();
    const hideHeader = pathname === "/login" || pathname === "/register";

    const [openProfile, setOpenProfile] = React.useState(false);

    React.useEffect(() => setOpenProfile(false), [pathname]);

    return (
        <>
            {!hideHeader && (
                <>
                    <Header onProfileClick={() => setOpenProfile(true)} />
                    <AccountModal open={openProfile} onClose={() => setOpenProfile(false)} />
                </>
            )}
            <main className={styles.main}>
                <Outlet />
            </main>
        </>
    );
}

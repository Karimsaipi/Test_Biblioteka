import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import styles from "./MainLayout.module.scss";
import AccountModal from "../components/AccountModal/AccountModal";
import { useAppSelector } from "../store/hooks";

export default function MainLayout() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const hideHeader = pathname === "/login" || pathname === "/register";

    const [openProfile, setOpenProfile] = React.useState(false);
    const user = useAppSelector((s) => s.auth.user);

    React.useEffect(() => setOpenProfile(false), [pathname]);

    const handleProfileClick = () => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }
        setOpenProfile(true);
    };

    return (
        <>
            {!hideHeader && (
                <>
                    <Header onProfileClick={handleProfileClick} />
                    <AccountModal open={openProfile} onClose={() => setOpenProfile(false)} />
                </>
            )}
            <main className={styles.main}>
                <Outlet />
            </main>
        </>
    );
}

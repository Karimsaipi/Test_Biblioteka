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
    const lastOpenedId = useAppSelector((s) => s.lastOpened.publicationId);

    React.useEffect(() => setOpenProfile(false), [pathname]);

    const handleProfileClick = () => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }
        setOpenProfile(true);
    };

    const handleBookClick = () => {
        if (lastOpenedId) {
            navigate(`/publications/${lastOpenedId}`, { state: { openReader: true } });
        } else {
            navigate(`/allPublications`);
        }
    };
    return (
        <>
            {!hideHeader && (
                <>
                    <Header onProfileClick={handleProfileClick} onBookClick={handleBookClick} />
                    <AccountModal open={openProfile} onClose={() => setOpenProfile(false)} />
                </>
            )}
            <main className={styles.main}>
                <Outlet />
            </main>
        </>
    );
}

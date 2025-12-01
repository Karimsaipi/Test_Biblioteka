import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../HeaderLayout/HeaderLayout";
import styles from "./MainLayout.module.scss";

import { useAppSelector } from "../../store/hooks";
import SubjectsPopover from "../../components/Popover/SubjectsPopover";
import TagsPopover from "../../components/Popover/TagsPopover";
import AccountPopover from "../../components/AccountPopover/AccountPopover";

type Pop = "subjects" | "tags" | null;

const canHover = () => window.matchMedia?.("(any-hover: hover)")?.matches ?? false;

export default function MainLayout(props: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const hideHeader = pathname === "/login" || pathname === "/register";

    const user = useAppSelector((s) => s.auth.user);
    const lastOpenedId = useAppSelector((s) => s.lastOpened.publicationId);

    const [openProfile, setOpenProfile] = React.useState(false);
    const [openPop, setOpenPop] = React.useState<Pop>(null);

    React.useEffect(() => {
        setOpenProfile(false);
        setOpenPop(null);
    }, [pathname]);

    const handleProfileClick = () => {
        // Десктоп: кликом не открываем (только hover)
        if (canHover()) {
            if (!user) navigate("/login", { replace: true });
            return;
        }

        // Мобилка: toggle по клику
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        setOpenProfile((v) => !v);
        setOpenPop(null);
    };

    const handleProfileEnter = () => {
        if (!user) return;
        setOpenProfile(true);
        setOpenPop(null);
    };

    const handleProfileLeave = () => {
        setOpenProfile(false);
    };

    const handleBookClick = () => {
        if (lastOpenedId) {
            navigate(`/publications/${lastOpenedId}`, { state: { openReader: true } });
        } else {
            navigate(`/allPublications`);
        }
    };

    const closePop = () => setOpenPop(null);

    return (
        <>
            {!hideHeader && (
                <Header
                    onBookClick={handleBookClick}
                    onProfileClick={handleProfileClick}
                    onProfileEnter={handleProfileEnter}
                    onProfileLeave={handleProfileLeave}
                    onSubjectsEnter={() => {
                        setOpenPop("subjects");
                        setOpenProfile(false);
                    }}
                    onSubjectsLeave={closePop}
                    onTagsEnter={() => {
                        setOpenPop("tags");
                        setOpenProfile(false);
                    }}
                    onTagsLeave={closePop}
                    subjectsPopover={
                        <SubjectsPopover open={openPop === "subjects"} onClose={closePop} top={5} />
                    }
                    tagsPopover={
                        <TagsPopover open={openPop === "tags"} onClose={closePop} top={5} />
                    }
                    profilePopover={
                        <AccountPopover open={openProfile} onClose={() => setOpenProfile(false)} />
                    }
                />
            )}

            <main className={styles.main}>{props.children}</main>
        </>
    );
}

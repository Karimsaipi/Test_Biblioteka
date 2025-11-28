import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import styles from "./MainLayout.module.scss";
import AccountModal from "../components/AccountModal/AccountModal";
import { useAppSelector } from "../store/hooks";
import SubjectsPopover from "../components/HeaderPopover/SubjectsPopover";
import TagsPopover from "../components/HeaderPopover/TagsPopover";

type Pop = "subjects" | "tags" | null;

export default function MainLayout(props: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const hideHeader = pathname === "/login" || pathname === "/register";

    const [openProfile, setOpenProfile] = React.useState(false);
    const user = useAppSelector((s) => s.auth.user);
    const lastOpenedId = useAppSelector((s) => s.lastOpened.publicationId);

    const [openPop, setOpenPop] = React.useState<Pop>(null);

    React.useEffect(() => {
        setOpenProfile(false);
        setOpenPop(null);
    }, [pathname]);

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

    const closePop = () => setOpenPop(null);

    return (
        <>
            {!hideHeader && (
                <>
                    <Header
                        onProfileClick={handleProfileClick}
                        onBookClick={handleBookClick}
                        onSubjectsEnter={() => setOpenPop("subjects")}
                        onSubjectsLeave={closePop}
                        onTagsEnter={() => setOpenPop("tags")}
                        onTagsLeave={closePop}
                        subjectsPopover={
                            <SubjectsPopover
                                open={openPop === "subjects"}
                                onClose={closePop}
                                top={5}
                            />
                        }
                        tagsPopover={
                            <TagsPopover open={openPop === "tags"} onClose={closePop} top={5} />
                        }
                    />

                    <AccountModal open={openProfile} onClose={() => setOpenProfile(false)} />
                </>
            )}

            <main className={styles.main}>
                {props.children}
            </main>
        </>
    );
}

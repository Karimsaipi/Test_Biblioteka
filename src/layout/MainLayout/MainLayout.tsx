import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import styles from "./MainLayout.module.scss";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeProfileOverlay, toggleProfileOverlay } from "@/store/OverlaySlice/overlaySlice";
import AccountOverlay from "@/widgets/AccountOverlay/AccountOverlay";
import GuestOverlay from "@/widgets/GuestOverlay/GuestOverlay";
import Popover from "@/widgets/Popover/Popover";
import { getSubjects } from "@/api/subjects";
import { getTags } from "@/api/tags";

type Pop = "subjects" | "tags" | null;

export default function MainLayout(props: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const hideHeader = pathname === "/login" || pathname === "/register";

    const user = useAppSelector((s) => s.auth.user);
    const lastOpenedId = useAppSelector((s) => s.lastOpened.publicationId);

    const profileOpen = useAppSelector((s) => s.overlay.profileOpen);

    const [openPop, setOpenPop] = React.useState<Pop>(null);

    React.useEffect(() => {
        setOpenPop(null);
    }, [pathname]);

    const handleProfileClick = () => {
        dispatch(toggleProfileOverlay());
        setOpenPop(null);
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
                    onSubjectsEnter={() => {
                        setOpenPop("subjects");
                        dispatch(closeProfileOverlay());
                    }}
                    onSubjectsLeave={closePop}
                    onTagsEnter={() => {
                        setOpenPop("tags");
                        dispatch(closeProfileOverlay());
                    }}
                    onTagsLeave={closePop}
                    subjectsPopover={
                        <Popover
                            open={openPop === "subjects"}
                            onClose={closePop}
                            fetchItems={getSubjects}
                            queryParamName="subject"
                        />
                    }
                    tagsPopover={
                        <Popover
                            open={openPop === "tags"}
                            onClose={closePop}
                            fetchItems={getTags}
                            queryParamName="tag"
                        />
                    }
                    profileOverlay={
                        user ? (
                            <AccountOverlay
                                open={profileOpen}
                                onClose={() => dispatch(closeProfileOverlay())}
                            />
                        ) : (
                            <GuestOverlay
                                open={profileOpen}
                                onClose={() => dispatch(closeProfileOverlay())}
                            />
                        )
                    }
                />
            )}

            <main className={styles.main}>{props.children}</main>
        </>
    );
}

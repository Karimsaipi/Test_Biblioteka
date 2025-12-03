import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./HeaderLayout.module.scss";
import bookIcon from "@/assets/icons/bookIcon.png";
import favoriteIcon from "@/assets/icons/favoriteIcon.png";
import mainLogo from "@/assets/images/logo.png";
import penIcon from "@/assets/icons/pen.png";
import userIcon from "@/assets/icons/userIcon.png";
import HeaderSearch from "@/components/HeaderSearch/HeaderSearch";
import { IconButton } from "@/ui";

type HeaderProps = {
    onBookClick?: () => void;
    onProfileClick: () => void;

    onProfileEnter?: () => void;
    onProfileLeave?: () => void;
    onSubjectsEnter?: () => void;
    onSubjectsLeave?: () => void;
    onTagsEnter?: () => void;
    onTagsLeave?: () => void;

    subjectsPopover?: React.ReactNode;
    tagsPopover?: React.ReactNode;
    profilePopover?: React.ReactNode;
};

export default function HeaderLayout({
    onBookClick,
    onProfileClick,
    onProfileEnter,
    onProfileLeave,
    onSubjectsEnter,
    onSubjectsLeave,
    onTagsEnter,
    onTagsLeave,
    subjectsPopover,
    tagsPopover,
    profilePopover,
}: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Лого + нав */}
                <div className={styles.left}>
                    <NavLink to="/" className={styles.logo} aria-label="На главную">
                        <img src={mainLogo} alt="DigitalBooks.app" />
                    </NavLink>

                    <nav className={styles.nav} aria-label="Главная навигация">
                        <NavLink
                            to="/allPublications"
                            className={({ isActive }) => (isActive ? styles.active : undefined)}
                        >
                            Вся литература
                        </NavLink>

                        {/* Предметы */}
                        <div
                            className={styles.navPopoverWrap}
                            onMouseEnter={onSubjectsEnter}
                            onMouseLeave={onSubjectsLeave}
                        >
                            <NavLink
                                to="/subjects"
                                className={({ isActive }) => (isActive ? styles.active : undefined)}
                            >
                                Предметы
                            </NavLink>
                            {subjectsPopover}
                        </div>

                        {/* Тэги */}
                        <div
                            className={styles.navPopoverWrap}
                            onMouseEnter={onTagsEnter}
                            onMouseLeave={onTagsLeave}
                        >
                            <NavLink
                                to="/tags"
                                className={({ isActive }) => (isActive ? styles.active : undefined)}
                            >
                                Тэги
                            </NavLink>
                            {tagsPopover}
                        </div>

                        <NavLink
                            to="/copyright"
                            className={({ isActive }) => (isActive ? styles.active : undefined)}
                        >
                            Для правообладателей
                        </NavLink>
                    </nav>
                </div>

                {/* Поиск */}
                <HeaderSearch />

                {/* Иконки справа */}
                <div className={styles.right}>
                    <IconButton
                        icon={bookIcon}
                        alt="Последняя книга"
                        title="Последняя книга"
                        onClick={onBookClick}
                    />
                    <IconButton
                        icon={favoriteIcon}
                        alt="Закладки"
                        title="Закладки"
                        onClick={() => navigate("/favourites")}
                    />
                    <IconButton
                        icon={penIcon}
                        alt="Создание книги"
                        title="Создание книги"
                        onClick={() => navigate("/create-publication")}
                    />
                    <div
                        className={styles.profileWrap}
                        onMouseEnter={onProfileEnter}
                        onMouseLeave={onProfileLeave}
                    >
                        <IconButton
                            style={{ width: 64, height: 64 }}
                            icon={userIcon}
                            alt="Профиль"
                            title="Профиль"
                            size={64}
                            onClick={onProfileClick}
                        />
                        {profilePopover}
                    </div>
                </div>
            </div>
        </header>
    );
}

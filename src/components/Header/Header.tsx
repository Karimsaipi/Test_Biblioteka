import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import IconButton from "../../UI/IconButton/IconButton";
import bookIcon from "../../assets/icons/bookIcon.png";
import favoriteIcon from "../../assets/icons/favoriteIcon.png";
import mainLogo from "../../assets/images/logo.png";
import penIcon from "../../assets/icons/pen.png";
import userIcon from "../../assets/icons/userIcon.png";
import HeaderSearch from "../HeaderSearch/HeaderSearch";

type HeaderProps = {
    onProfileClick?: () => void;
    onBookClick?: () => void;

    onSubjectsEnter?: () => void;
    onSubjectsLeave?: () => void;
    onTagsEnter?: () => void;
    onTagsLeave?: () => void;

    subjectsPopover?: React.ReactNode;
    tagsPopover?: React.ReactNode;
};

export default function Header({
    onProfileClick,
    onBookClick,
    onSubjectsEnter,
    onSubjectsLeave,
    onTagsEnter,
    onTagsLeave,
    subjectsPopover,
    tagsPopover,
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
                    <IconButton
                        style={{ width: 64, height: 64 }}
                        icon={userIcon}
                        alt="Профиль"
                        title="Профиль"
                        size={64}
                        onClick={onProfileClick}
                    />
                </div>
            </div>
        </header>
    );
}

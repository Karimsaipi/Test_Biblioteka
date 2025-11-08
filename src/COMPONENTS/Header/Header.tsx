import React, { useCallback, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import SearchInput from "../../UI/SearchInput/SearchInput";
import IconButton from "../../UI/IconButton/IconButton";
import bookIcon from "../../assets/icons/bookIcon.png";
import favoriteIcon from "../../assets/icons/favoriteIcon.png";
import mainLogo from "../../assets/images/logo.png";
import searchIcon from "../../assets/icons/searchIcon.png";
import penIcon from "../../assets/icons/pen.png";
import userIcon from "../../assets/icons/userIcon.png"

type HeaderProps = {
  onProfileClick?: () => void;
};

export default function Header({ onProfileClick }: HeaderProps) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const v = q.trim();
      if (!v) return;
      navigate(`/search?q=${encodeURIComponent(v)}`);
    },
    [q, navigate]
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Лого + нав */}
        <div className={styles.left}>
          <NavLink to="/" className={styles.logo} aria-label="На главную">
            <img src={mainLogo} alt="DigitalBooks.app"></img>
          </NavLink>

          <nav className={styles.nav} aria-label="Главная навигация">
            <NavLink
              to="/allPublicatons"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              Вся литература
            </NavLink>
            <NavLink
              to="/subjects"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              Предметы
            </NavLink>
            <NavLink
              to="/tags"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              Тэги
            </NavLink>
            <NavLink
              to="/copyright"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              Для правообладателей
            </NavLink>
          </nav>
        </div>

        {/* Поиск */}
        <form
          className={styles.search}
          onSubmit={onSubmit}
          role="search"
          aria-label="Поиск по книгам"
        >
          <SearchInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder=""
            iconSrc={searchIcon}
          />
        </form>

        {/* Иконки справа */}
        <div className={styles.right}>
          <IconButton
            icon={bookIcon}
            alt="Библиотека"
            title="Библиотека"
            onClick={() => navigate("/library")}
          />
          <IconButton
            icon={favoriteIcon}
            alt="Закладки"
            title="Закладки"
            onClick={() => navigate("/bookmarks")}
          />
          <IconButton
            icon={penIcon}
            alt="Форма обратной связи"
            title="Форма обратной связи"
            onClick={() => navigate("/feedback")}
          />
          <IconButton 
            style={{ width: 64, height: 64 }}
            icon={userIcon}
            alt ="Профиль"
            title ="Профиль"
            size ={64}
            onClick ={onProfileClick}
          />
        </div>
      </div>
    </header>
  );
}

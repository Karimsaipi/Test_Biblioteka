import { useNavigate } from "react-router-dom";
import styles from "./GuestOverlay.module.scss";
import { BaseButton } from "@/ui";

type Props = { open: boolean; onClose: () => void };

export default function GuestPopover({ open, onClose }: Props) {
    const navigate = useNavigate();
    if (!open) return null;

    return (
        <div className={styles.popover} role="dialog" aria-label="Аккаунт">
            <div className={styles.title}>Вы не авторизованы</div>
            <div className={styles.actions}>
                <BaseButton
                    type="button"
                    className={styles.btn}
                    onClick={() => {
                        onClose();
                        navigate("/login");
                    }}
                >
                    Войти
                </BaseButton>
                <BaseButton
                    type="button"
                    className={styles.btn}
                    onClick={() => {
                        onClose();
                        navigate("/register");
                    }}
                >
                    Регистрация
                </BaseButton>
            </div>
        </div>
    );
}

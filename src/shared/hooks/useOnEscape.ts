import { useEffect, useRef } from "react";

type Options = {
    enabled?: boolean;
    capture?: boolean;
};

export function useOnEscape(onEscape: (event: KeyboardEvent) => void, options: Options = {}) {
    const { enabled = true, capture = true } = options;

    const latestHandler = useRef(onEscape);
    useEffect(() => {
        latestHandler.current = onEscape;
    }, [onEscape]);

    useEffect(() => {
        if (!enabled) return;
        if (typeof document === "undefined") return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") latestHandler.current(e);
        };

        document.addEventListener("keydown", onKeyDown, { capture });
        return () => document.removeEventListener("keydown", onKeyDown, { capture } as any);
    }, [enabled, capture]);
}

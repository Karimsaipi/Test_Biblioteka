import { useEffect, useRef } from "react";

type OutsideEvent = MouseEvent | PointerEvent | TouchEvent;

type Options = {
    enabled?: boolean;
    eventName?: "pointerdown" | "mousedown" | "click" | "touchstart";
    capture?: boolean;
};

export function useOnClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    onOutside: (event: OutsideEvent) => void,
    options: Options = {},
) {
    const { enabled = true, eventName = "pointerdown", capture = true } = options;

    const latestHandler = useRef(onOutside);
    useEffect(() => {
        latestHandler.current = onOutside;
    }, [onOutside]);

    useEffect(() => {
        if (!enabled) return;
        if (typeof document === "undefined") return;

        const handler = (event: Event) => {
            const el = ref.current;
            if (!el) return;

            const target = event.target as Node | null;
            const isInside = !!target && el.contains(target);
            if (isInside) return;

            latestHandler.current(event as OutsideEvent);
        };

        document.addEventListener(eventName, handler, { capture });
        return () => document.removeEventListener(eventName, handler, { capture } as any);
    }, [ref, enabled, eventName, capture]);
}

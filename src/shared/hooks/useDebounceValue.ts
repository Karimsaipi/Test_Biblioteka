import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 400): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    // если дебаунс не нужен — возвращаем значение сразу
    if (delay <= 0) {
        return value;
    }

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(id);
    }, [value, delay]);

    return debouncedValue;
}

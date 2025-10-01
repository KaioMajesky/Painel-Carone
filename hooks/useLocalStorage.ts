
import { useState, useEffect } from 'react';

function getValue<T,>(key: string, initialValue: T | (() => T)) {
    if (typeof window === 'undefined') {
        return initialValue instanceof Function ? initialValue() : initialValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        // Special date handling for this app
        return item ? JSON.parse(item, (k, v) => {
            if (k === 'dateTime' && typeof v === 'string' && v.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)) {
                return new Date(v);
            }
            return v;
        }) : (initialValue instanceof Function ? initialValue() : initialValue);
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return initialValue instanceof Function ? initialValue() : initialValue;
    }
}

export function useLocalStorage<T,>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => getValue(key, initialValue));

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

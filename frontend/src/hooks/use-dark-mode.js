import { useState, useEffect } from "react";

/**
 * Hook to track whether dark mode is currently active by observing the
 * 'dark' class on the documentElement (<html>).
 */
export const useDarkMode = () => {
    const [isDark, setIsDark] = useState(
        () => document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    return isDark;
};

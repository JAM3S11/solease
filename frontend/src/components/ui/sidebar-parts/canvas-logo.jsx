import React, { useRef, useEffect, memo } from "react";
import { useDarkMode } from "../../../hooks/use-dark-mode";

/**
 * A memoized canvas-based logo component that adapts to light/dark modes.
 */
export const CanvasLogo = memo(({ isBlurred }) => {
    const canvasRef = useRef(null);
    const isDark = useDarkMode();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, 40, 40);

        const gradient = ctx.createLinearGradient(0, 0, 40, 40);
        if (isBlurred) {
            gradient.addColorStop(0, "#2563EB");
            gradient.addColorStop(1, "#06B6D4");
        } else if (isDark) {
            gradient.addColorStop(0, "#60A5FA");
            gradient.addColorStop(1, "#22D3EE");
        } else {
            gradient.addColorStop(0, "#3B82F6");
            gradient.addColorStop(1, "#06B6D4");
        }

        ctx.fillStyle = gradient;

        const drawChevron = (yOffset, alpha = 1) => {
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(10, yOffset + 8);
            ctx.lineTo(20, yOffset);
            ctx.lineTo(30, yOffset + 8);
            ctx.lineTo(20, yOffset + 16);
            ctx.fill();
        };

        drawChevron(18, 0.6);
        drawChevron(10, 0.8);
        drawChevron(2, 1);
        ctx.globalAlpha = 1;
    }, [isBlurred, isDark]);

    return <canvas ref={canvasRef} width="40" height="40" className="w-9 h-9 flex-shrink-0" />;
});

CanvasLogo.displayName = "CanvasLogo";

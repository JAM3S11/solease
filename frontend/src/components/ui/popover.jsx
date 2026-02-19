import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Minimal Popover built with React state + click-outside detection.
 * Exposes the same Popover / PopoverTrigger / PopoverContent API
 * as shadcn so imports in Sidebar.jsx stay consistent.
 * No external Radix/Headless UI dependency needed.
 */

const PopoverContext = React.createContext(null);

function Popover({ children }) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef(null);

    // Close when clicking outside the popover container
    React.useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <PopoverContext.Provider value={{ open, setOpen }}>
            <div ref={containerRef} className="relative inline-block">
                {children}
            </div>
        </PopoverContext.Provider>
    );
}

const PopoverTrigger = React.forwardRef(
    ({ asChild = false, children, ...props }, ref) => {
        const { open, setOpen } = React.useContext(PopoverContext);

        const handleClick = (e) => {
            e.stopPropagation();
            setOpen((v) => !v);
            props.onClick?.(e);
        };

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children, {
                ...props,
                ref,
                onClick: handleClick,
                "aria-expanded": open,
            });
        }

        return (
            <button
                ref={ref}
                type="button"
                aria-expanded={open}
                {...props}
                onClick={handleClick}
            >
                {children}
            </button>
        );
    }
);
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(
    ({ className, side = "top", align = "end", children, ...props }, ref) => {
        const { open } = React.useContext(PopoverContext);

        if (!open) return null;

        const positionCls = {
            top: "bottom-full mb-2",
            bottom: "top-full mt-2",
            left: "right-full -mr-8",
            right: "left-full ml-8",
        }[side] ?? "bottom-full mb-2";

        const alignCls = {
            start: "left-4",
            center: "left-1/2 -translate-x-1/2",
            end: "-right-8",
        }[align] ?? "right-0";

        return (
            <div
                ref={ref}
                role="dialog"
                className={cn(
                    "absolute z-50",
                    positionCls,
                    alignCls,
                    "min-w-max rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
                    "animate-in fade-in-0 zoom-in-95",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };

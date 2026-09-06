import { useEffect, useRef } from "react";
import "./index.css";

export default function Cover() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;

        const hideTimer = setTimeout(() => divRef.current?.classList.add("hide"), 1500);
        const removeTimer = setTimeout(() => divRef.current?.remove(), 1800);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    return (
        <div className="cover" ref={divRef}>
            <span>FeedMe!</span>
        </div>
    );
}

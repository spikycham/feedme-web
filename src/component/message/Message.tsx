import { useEffect, useRef, useState } from "react";
import "./index.css";
import { MessageCircleCheck, MessageCircleWarning, MessageCircleX } from "lucide-react";

type MessageStatus = "success" | "warning" | "failed";
function StatusIcon(status: MessageStatus) {
    switch (status) {
        case "success":
            return <MessageCircleCheck className="icon success" />;
        case "warning":
            return <MessageCircleWarning className="icon warning" />;
        case "failed":
            return <MessageCircleX className="icon failed" />;
    }
}

let setMessageTitle: ((title: string) => void) | null = null;
let setMessageTimestamp: ((timestamp: number) => void) | null = null;
let setMessageStatus: ((status: MessageStatus) => void) | null = null;

export default function Message() {
    const [title, setTitle] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const [status, setStatus] = useState<MessageStatus>("success");
    setMessageTitle = setTitle;
    setMessageTimestamp = setTimestamp;
    setMessageStatus = setStatus;

    const contentRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (title === "") return;

        // Pop down animation.
        if (!contentRef.current) return;
        contentRef.current.classList.remove("hide");
        contentRef.current.classList.remove("show");
        requestAnimationFrame(() => {
            contentRef.current?.classList.add("show");
        });

        // Hide up animation.
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            contentRef.current?.classList.remove("show");
            contentRef.current?.classList.add("hide");
        }, 2000);
    }, [title, timestamp, status]);

    return (
        <div className="message">
            <div className="content" ref={contentRef}>
                {StatusIcon(status)}
                <span>{title}</span>
            </div>
        </div>
    );
}

function setMessage(title: string, status: MessageStatus) {
    if (!setMessageTitle || !setMessageTimestamp || !setMessageStatus) return;
    setMessageTitle(title);
    setMessageTimestamp(Date.now());
    setMessageStatus(status);
}
export const message = {
    success: (title: string) => setMessage(title, "success"),
    warning: (title: string) => setMessage(title, "warning"),
    failed: (title: string) => setMessage(title, "failed"),

    internal() {
        this.failed("Internal error");
    },
};

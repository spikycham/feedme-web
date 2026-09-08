import { ClipboardClock, Hamburger, ListOrdered, UserRoundPen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./index.css";

interface Tab {
    key: number;
    icon: React.ReactNode;
    title: string;
    path: string;
}

const tabs: Tab[] = [
    {
        key: 0,
        icon: <ListOrdered />,
        title: "Order",
        path: "/layout/order",
    },
    {
        key: 1,
        icon: <Hamburger />,
        title: "Food",
        path: "/layout/food",
    },
    {
        key: 2,
        icon: <ClipboardClock />,
        title: "History",
        path: "/layout/history",
    },
    {
        key: 3,
        icon: <UserRoundPen />,
        title: "Profile",
        path: "/layout/profile",
    },
];

export default function Tab() {
    const [active, setActive] = useState(0);
    const navigate = useNavigate();

    return (
        <div className="tab">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={active === tab.key ? "active" : ""}
                    onClick={() => {
                        setActive(tab.key);
                        navigate(tab.path);
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.title}</span>
                    <div className="highlight"></div>
                </button>
            ))}
        </div>
    );
}

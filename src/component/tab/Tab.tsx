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

const prevTabKey = Number(localStorage.getItem("previous_tab_key") ?? 0);
export default function Tab() {
    const [active, setActive] = useState(prevTabKey);
    const navigate = useNavigate();

    const onNavigate = (tab: Tab) => {
        setActive(tab.key);
        localStorage.setItem("previous_path", tab.path);
        localStorage.setItem("previous_tab_key", String(tab.key));
        navigate(tab.path);
    };

    return (
        <div className="tab">
            {tabs.map((tab) => (
                <button key={tab.key} className={active === tab.key ? "active" : ""} onClick={() => onNavigate(tab)}>
                    <span>{tab.icon}</span>
                    {/* <span>{tab.title}</span> */}
                    <div className="highlight"></div>
                </button>
            ))}
        </div>
    );
}

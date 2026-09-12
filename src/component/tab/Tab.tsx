import { ClipboardClock, Hamburger, ListOrdered, ShoppingCart, UserRoundPen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import "./index.css";
import Permission from "@/util/permission";
import { useUserStore } from "@/store/user.store";

interface Tab {
    key: number;
    icon: React.ReactNode;
    title: string;
    path: string;
    isShow: (role: UserRole) => boolean;
}

const tabs: Tab[] = [
    {
        key: 0,
        icon: <ListOrdered />,
        title: "Order",
        path: "/layout/order",
        isShow: (role) => Permission.IsMerchant(role),
    },
    {
        key: 1,
        icon: <Hamburger />,
        title: "Food",
        path: "/layout/food",
        isShow: (role) => Permission.IsCustomer(role) || Permission.IsMerchant(role),
    },
    {
        key: 2,
        icon: <ShoppingCart />,
        title: "Cart",
        path: "/layout/cart",
        isShow: (role) => Permission.IsCustomer(role),
    },
    // {
    //     key: 3,
    //     icon: <ClipboardClock />,
    //     title: "History",
    //     path: "/layout/history",
    //     isShow: (role) => Permission.IsCustomer(role) || Permission.IsMerchant(role),
    // },
    {
        key: 4,
        icon: <UserRoundPen />,
        title: "Profile",
        path: "/layout/profile",
        isShow: (role) => Permission.IsCustomer(role) || Permission.IsMerchant(role),
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

    const user = useUserStore((state) => state.user);

    return (
        <div className="tab">
            {tabs.map((tab) => {
                if (!tab.isShow(user.role)) return null;
                return (
                    <button
                        key={tab.key}
                        className={active === tab.key ? "active" : ""}
                        onClick={() => onNavigate(tab)}>
                        <span>{tab.icon}</span>
                        {/* <span>{tab.title}</span> */}
                        <div className="highlight"></div>
                    </button>
                );
            })}
        </div>
    );
}

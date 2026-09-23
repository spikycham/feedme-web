import { useState } from "react";
import { Outlet } from "react-router";
import useInitUser from "@/hook/useInitUser";
import { Hamburger, HandPlatter, ListOrdered, ShoppingCart, UserRoundPen } from "lucide-react";

import Loading from "@/component/loading/Loading";
import Tab from "@/component/tab/Tab";
import type { TabType } from "@/component/tab/Tab";

import Permission from "@/util/permission";

import i18n from "@/i18n";
import "./index.css";

const tabs: TabType[] = [
    {
        key: 5,
        icon: <HandPlatter />,
        title: i18n.t("current_order"),
        path: "/layout/service",
        isShow: (role) => Permission.IsMerchant(role),
    },
    {
        key: 1,
        icon: <Hamburger />,
        title: i18n.t("food_list"),
        path: "/layout/food",
        isShow: (role) => Permission.IsCustomer(role) || Permission.IsMerchant(role),
    },
    {
        key: 0,
        icon: <ListOrdered />,
        title: i18n.t("order_history"),
        path: "/layout/order",
        isShow: (role) => Permission.IsMerchant(role),
    },
    {
        key: 2,
        icon: <ShoppingCart />,
        title: i18n.t("cart"),
        path: "/layout/cart",
        isShow: (role) => Permission.IsCustomer(role),
    },
    {
        key: 4,
        icon: <UserRoundPen />,
        title: i18n.t("profile"),
        path: "/layout/profile",
        isShow: (role) => Permission.IsCustomer(role) || Permission.IsMerchant(role),
    },
];

const prevTabKey = Number(localStorage.getItem("previous_tab_key") ?? 0);
export default function Layout() {
    const loading = useInitUser();
    const [active, setActive] = useState(prevTabKey);

    if (loading) return <Loading />;
    return (
        <main className="layout">
            <section className="content">
                <Outlet />
            </section>

            <section className="footer">
                <Tab tabs={tabs} active={active} onChange={(k) => setActive(k)} />
            </section>
        </main>
    );
}

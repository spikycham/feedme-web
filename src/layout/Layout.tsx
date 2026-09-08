import { Outlet } from "react-router";
import useInitUser from "@/hook/useInitUser";

import Loading from "@/component/loading/Loading";
import Tab from "@/component/tab/Tab";

import "./index.css";

export default function Layout() {
    const loading = useInitUser();

    if (loading) return <Loading />;
    return (
        <main className="layout">
            <section className="header">
                <Outlet />
            </section>

            <section className="footer">
                <Tab />
            </section>
        </main>
    );
}

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
            <section>
                <div>layout</div>
                <Outlet />
            </section>

            <section>
                <Tab />
            </section>
        </main>
    );
}

import { Outlet } from "react-router";
import useInitUser from "@/hook/useInitUser";
import PageLoading from "@/component/page-loading/PageLoading";
import Tab from "@/component/tab/Tab";
import "./index.css";

export default function Layout() {
    const loading = useInitUser();
    // TODO: navigate to the order page when the user is a merchant.

    if (loading) return <PageLoading />;
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

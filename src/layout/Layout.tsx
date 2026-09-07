import { Outlet } from "react-router";
import useInitUser from "@/hook/useInitUser";
import PageLoading from "@/component/page-loading/PageLoading";

export default function Layout() {
    const loading = useInitUser();

    if (loading) return <PageLoading />;
    return (
        <div>
            <div>layout</div>
            <Outlet />
        </div>
    );
}

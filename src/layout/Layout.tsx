import PageLoading from "@/component/PageLoading/PageLoading";
import useInitUser from "@/hook/useInitUser";
import { Outlet } from "react-router";

export default function Layout() {
    const loading = useInitUser();

    return (
        <>
            {loading ? (
                <PageLoading />
            ) : (
                <div>
                    <div>layout</div>
                    <Outlet />
                </div>
            )}
        </>
    );
}

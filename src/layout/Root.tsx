import { Navigate, Outlet, useNavigate } from "react-router";
import net from "@/network/network";
import { message } from "@/component/message/Message";

export default function Root() {
    const navigate = useNavigate();
    net.setTokenExpireHandler(() => {
        navigate("/login");
        message.warning("Login credentials expired");
    });

    return (
        <>
            <Navigate to="/layout/order" />
            <Outlet />
        </>
    );
}

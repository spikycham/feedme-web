import { Navigate, Outlet, useNavigate } from "react-router";

import { message } from "@/component/message/Message";

import net from "@/network/network";

import i18n from "@/i18n";

export default function Root() {
    const navigate = useNavigate();
    net.setTokenExpireHandler(() => {
        navigate("/login");
        message.warning(i18n.t("token_expired"));
    });

    return (
        <>
            <Navigate to="/layout/food" />
            <Outlet />
        </>
    );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "@/store/user.store";

import fetchUserMe from "@/network/user.api";
import { getToken } from "@/util/token";

export default function useInitUser() {
    const hasToken = Boolean(getToken());
    const [loading, setLoading] = useState(hasToken);

    const setUserStore = useUserStore((state) => state.setUser);

    const navigate = useNavigate();

    // Navigate to home screen if logged in,
    // jump to login page otherwise.
    const init = async () => {
        try {
            const data = await fetchUserMe();
            setUserStore({ user: data });

            const prevPath = localStorage.getItem("previous_path") ?? "/layout/food";
            navigate(prevPath);
        } catch {
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasToken) {
            navigate("/login");
            return;
        }
        init();
    }, []);

    return loading;
}

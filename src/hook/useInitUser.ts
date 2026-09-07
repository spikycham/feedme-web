import { fetchUserMe } from "@/network/user.api";
import { useUserStore } from "@/store/user.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function useInitUser() {
    const [loading, setLoading] = useState(true);

    const setUserStore = useUserStore((state) => state.setUser);

    const navigate = useNavigate();
    // Navigate to home screen if logged in,
    // jump to login page otherwise.
    const fetch = async () => {
        try {
            const data = await fetchUserMe();
            setUserStore(data);
            navigate("/layout");
        } catch {
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    return loading;
}

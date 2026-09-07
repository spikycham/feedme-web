import { useState } from "react";
import { useNavigate } from "react-router";
import { NetworkError } from "@/network/network";
import { message } from "@/component/message/Message";
import { Loader } from "lucide-react";
import { fetchLogin } from "@/network/login.api";
import { setRefreshToken, setToken } from "@/util/token";
import { useUserStore } from "@/store/user.store";
import useInitUser from "@/hook/useInitUser";
import "./index.css";
import PageLoading from "@/component/PageLoading/PageLoading";

export default function Login() {
    const userLoading = useInitUser();

    const setUserStore = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        const form = e.currentTarget as HTMLFormElement;
        const formdata = new FormData(form);

        const account = formdata.get("account");
        const password = formdata.get("password");
        if (!account) {
            message.warning("Please enter account");
            return;
        }
        if (!password) {
            message.warning("Please enter password");
            return;
        }

        try {
            setLoading(true);
            const data = await fetchLogin({
                account: account.toString(),
                password: password.toString(),
            });

            // Set tokens
            setToken(data.token.access_token);
            setRefreshToken(data.token.refresh_token);

            // Set user store.
            setUserStore(data.user);

            message.success("Log in successfully");
            navigate("/");
        } catch (err) {
            if (err instanceof NetworkError) {
                message.failed("Incorrect account or password");
                return;
            }
            message.internal();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {userLoading ? (
                <PageLoading />
            ) : (
                <div className="login">
                    <section className="header">
                        <h1>Log in</h1>
                        <p>Welcome back, please enter login credentials to continue</p>
                    </section>

                    <section>
                        <form className="form" onSubmit={login}>
                            <input name="account" placeholder="Enter Account" />
                            <input name="password" placeholder="Password" type="password" />

                            <button className={"submit " + (loading ? "loading" : "")} type="submit">
                                {loading && <Loader className="loader" />}
                                <span>Log in</span>
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}

import { useState } from "react";
import { useUserStore } from "@/store/user.store";
import { useNavigate } from "react-router";

import { message } from "@/component/message/Message";
import useInitUser from "@/hook/useInitUser";

import { NetworkError } from "@/network/network";
import fetchLogin from "@/network/login.api";

import Loading from "@/component/loading/Loading";
import Button from "@/component/button/Button";

import { setRefreshToken, setToken } from "@/util/token";

import "./index.css";
import i18n from "@/i18n";

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
            setUserStore({ user: data.user });

            message.success("Log in successfully");
            navigate("/layout/food");
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

    if (userLoading) return <Loading />;
    return (
        <div className="login">
            <section className="header">
                <h1>{i18n.t("log_in")}</h1>
                <p>{i18n.t("welcome_back")}</p>
            </section>

            <section>
                <form className="form" onSubmit={login}>
                    <input name="account" placeholder={i18n.t("enter_account")} />
                    <input name="password" placeholder={i18n.t("enter_password")} type="password" />

                    <Button htmlType="submit" title={i18n.t("log_in")} loading={loading} />
                </form>
            </section>
        </div>
    );
}

import { useEffect } from "react";
import { useNavigate } from "react-router";
import net from "@/util/network";
import "./index.css";
import { message } from "@/components/message/Message";

export default function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        // Navigate to home screen if logged in.
    }, []);

    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formdata = new FormData(form);

        const account = formdata.get("account");
        const password = formdata.get("password");

        message.success(Math.random().toString(16).slice(2, 10));
        try {
            const data = await net.post<ResponseLogin>("/api/auth/login", {
                account,
                password,
            });
            console.log(data);
        } catch {
        } finally {
        }
    };

    return (
        <div className="login">
            <section className="header">
                <h1>Log in</h1>
                <p>Welcome back, please enter login credentials to continue</p>
            </section>

            <section>
                <form className="form" onSubmit={login}>
                    <input placeholder="Enter Account" />
                    <input placeholder="Password" />
                    <button className="forget-password">Forget Password?</button>

                    <button className="submit">Log in</button>
                </form>
            </section>
        </div>
    );
}

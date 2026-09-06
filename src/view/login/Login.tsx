import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import net, { NetworkError } from "@/util/network";
import { message } from "@/components/message/Message";
import { Loader } from "lucide-react";
import "./index.css";

export default function Login() {
    // TODO: navigate to the home when token is valid.
    const navigate = useNavigate();
    useEffect(() => {
        // Navigate to home screen if logged in.
    }, []);

    const [loading, setLoading] = useState(false);
    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (loading) return;

        const form = e.currentTarget as HTMLFormElement;
        const formdata = new FormData(form);

        const account = formdata.get("account");
        const password = formdata.get("password");

        try {
            const data = await net.post<ResponseLogin>("/api/auth/login", {
                account,
                password,
            });
            // TODO: remove this log.
            console.log(data);
            message.success("Log in successfully");
            navigate("/home");
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
    );
}

import { useEffect } from "react";
import { useNavigate } from "react-router";
import "./index.css";
import { Lock, User } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        // const timer = setTimeout(() => navigate("/home"), 1000);
        // return () => {
        //     clearTimeout(timer);
        // };
    }, []);

    const login = (e: React.FormEvent<HTMLFormElement>) => {};

    return (
        <div className="login">
            <div />
            <main className="panel">
                <section className="form">
                    <section className="header">
                        <p className="title">Let's eat something</p>
                        <p className="para">Good too see you back</p>
                    </section>
                    <form onSubmit={login}>
                        <div className="input">
                            <User />
                            <input id="username" placeholder="Username" />
                        </div>
                        <div className="input">
                            <Lock />
                            <input id="password" placeholder="Password" />
                        </div>
                    </form>
                </section>

                <section className="button">
                    <button>SIGN IN</button>
                </section>
            </main>
        </div>
    );
}

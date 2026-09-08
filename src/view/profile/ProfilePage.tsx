import { useUserStore } from "@/store/user.store";
import "./index.css";

export default function ProfilePage() {
    // account: "",
    // avatar_uri: "",
    // created_at: -1,
    // name: "",
    // profile_background_uri: "",
    // role: 0,
    // user_id: "",

    const user = useUserStore((state) => state.user);
    const mixAccount = (account: string) => {
        const len = account.length;
        // The backend should constraint the length of account for at least 8.
        if (len < 4) return account;

        const start = account.slice(0, 4);
        const last = account.slice(len - 4);

        let res = start;
        for (let i = 4; i < len - 4; i++) {
            res += "*";
        }
        res += last;
        return res;
    };

    return (
        // TODO: use the profile background uri as the background-image.
        <div className="profile">
            <section className="header">
                <div className="info">
                    <div className="avatar">
                        <img />
                    </div>
                    <h1>
                        <span className="name">{user.name} </span>
                        <span className="id">
                            {mixAccount(user.account)} | {user.user_id.slice(0, 8)}
                        </span>
                    </h1>
                </div>
            </section>

            <section>
                <button className="edit">Edit Profile</button>
            </section>
        </div>
    );
}

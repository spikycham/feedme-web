import { useState } from "react";
import { SquarePen } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import Modal from "@/component/modal/Modal";
import "./index.css";
import fetchUpdateUser, { MissBodyError } from "@/network/update-username.api";
import { message } from "@/component/message/Message";

export default function ProfilePage() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const mixAccount = (account: string) => {
        const len = account.length;
        // The backend should constraint the length of account for at least 8.
        if (len < 4) return account;

        const start = account.slice(0, 3);
        const last = account.slice(len - 4);

        let res = start;
        for (let i = 3; i < len - 4; i++) {
            res += "*";
        }
        res += last;
        return res;
    };

    const [showEditName, setShowEditName] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [loadingEditName, setLoadingEditName] = useState(false);

    return (
        <>
            <div className="profile">
                <section className="header">
                    <div className="info">
                        <div className="avatar">
                            <img />
                        </div>
                        <h1>
                            <p className="name">
                                <span>{user.name}</span>
                                <SquarePen
                                    className="edit"
                                    onClick={() => {
                                        setEditName(user.name);
                                        setShowEditName(true);
                                    }}
                                />
                            </p>
                            <span className="id">
                                {mixAccount(user.account)} | {user.user_id.slice(0, 8)}
                            </span>
                        </h1>
                    </div>
                </section>

                <section>
                    <p>Waiting for developing...</p>
                </section>
            </div>

            <Modal
                show={showEditName}
                onShow={(show) => setShowEditName(show)}
                title="Rename"
                description="Enter your new username."
                loading={loadingEditName}
                onConfirm={async () => {
                    try {
                        setLoadingEditName(true);

                        await fetchUpdateUser({ new_username: editName });
                        setUser({ user: { ...user, name: editName } });

                        setShowEditName(false);
                        message.success("Update username successfully");
                    } catch (err) {
                        if (err instanceof MissBodyError) {
                            message.warning("Missing name");
                            return;
                        }
                        message.internal();
                    } finally {
                        setLoadingEditName(false);
                    }
                }}
            >
                <input
                    className="rename"
                    placeholder="Enter Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                />
            </Modal>
        </>
    );
}

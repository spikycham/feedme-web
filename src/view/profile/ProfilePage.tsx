import { useState } from "react";
import { useUserStore } from "@/store/user.store";
import { message } from "@/component/message/Message";
import { Ban, SquarePen } from "lucide-react";
import Modal from "@/component/modal/Modal";
import fetchUpdateProfile, { MissBodyError } from "@/network/update-profile.api";
import "./index.css";

const MODAL_TITLES = ["Select Avatar", "Select Background"];

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

    // Edit username.
    const [showEditName, setShowEditName] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [loadingEditName, setLoadingEditName] = useState(false);

    const showEditNameModal = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        setEditName(user.name);
        setShowEditName(true);
    };

    // Edit images, including avatar and background.
    const [editImgType, setEditImgType] = useState<0 | 1>(0); // 0: avatar, 1: background
    const [editImgModalTitle, setEditImgModalTitle] = useState(MODAL_TITLES[0]);
    const [showEditImg, setShowEditImg] = useState(false);
    const [editImgSrc, setEditImgSrc] = useState("");
    const [loadingEditImg, setLoadingEditImg] = useState(false);

    const showEditImgModal = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setEditImgModalTitle(MODAL_TITLES[editImgType]);
        setEditImgSrc(editImgType === 0 ? user.avatar_uri : user.profile_background_uri);
        setShowEditImg(true);
    };

    return (
        <>
            <div className="profile">
                <section className="header" onClick={showEditImgModal}>
                    <div className="info">
                        <div className="avatar" onClick={showEditImgModal}>
                            <img />
                        </div>

                        <h1>
                            <p className="name">
                                <span>{user.name}</span>
                                <SquarePen className="edit" onClick={showEditNameModal} />
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

                        await fetchUpdateProfile({ new_username: editName });
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
                    className="edit-rename"
                    placeholder="Enter Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                />
            </Modal>

            <Modal
                show={showEditImg}
                onShow={(show) => setShowEditImg(show)}
                title={editImgModalTitle}
                description="Upload an image by clicking the image."
                loading={loadingEditImg}
                onConfirm={async () => {
                    try {
                        setLoadingEditImg(true);

                        const bodys = [
                            {
                                new_avatar_uri: editImgSrc,
                            },
                            {
                                new_profile_background_uri: editImgSrc,
                            },
                        ];
                        await fetchUpdateProfile(bodys[editImgType]);
                        setUser({ user: { ...user, ...bodys[editImgType] } });

                        setShowEditImg(false);
                        const msgs = ["Update avatar successfully", "Update background successfully"];
                        message.success(msgs[editImgType]);
                    } catch (err) {
                        if (err instanceof MissBodyError) {
                            message.warning("Missing image");
                            return;
                        }
                    } finally {
                        setLoadingEditImg(false);
                    }
                }}
            >
                <div className="edit-input">
                    <label htmlFor="edit-img">{editImgSrc === "" ? <NoImg /> : <img src={editImgSrc} />}</label>
                    <input
                        id="edit-img"
                        className="edit-input"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) {
                                message.warning("No photo selected");
                                return;
                            }

                            const blob = new Blob([file], { type: file.type });
                            const url = URL.createObjectURL(blob);

                            const formdata = new FormData();
                            formdata.set("file", blob);

                            // TODO: implement this
                            try {
                            } catch (err) {
                            } finally {
                            }

                            setEditImgSrc(url);
                        }}
                    />
                </div>
            </Modal>
        </>
    );
}

function NoImg() {
    return (
        <div className="no-img">
            <Ban className="icon" />
            <span>No Image</span>
        </div>
    );
}

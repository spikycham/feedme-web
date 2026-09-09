import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "@/store/user.store";
import { message } from "@/component/message/Message";

import { Ban, SquarePen } from "lucide-react";
import Modal from "@/component/modal/Modal";
import Loading from "@/component/loading/Loading";
import Button from "@/component/button/Button";

import fetchUpdateProfile, { MissBodyError } from "@/network/update-profile.api";
import fetchUploadFile from "@/network/upload-file.api";
import fetchLogout from "@/network/logout.api";

import { removeRefreshToken, removeToken } from "@/util/token";

import "./index.css";

const MODAL_TITLES = ["Select Avatar", "Select Background"];

export default function ProfilePage() {
    // User profile displays.
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

    const onConfirmEditName = async () => {
        if (user.name === editName) {
            message.warning("Same username");
            setShowEditName(false);
            return;
        }

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
    };

    // Edit images, including avatar and background.
    const [showEditImg, setShowEditImg] = useState(false);
    const [editImgType, setEditImgType] = useState<0 | 1>(0);
    const [editImgSrc, setEditImgSrc] = useState("");

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingEditImg, setLoadingEditImg] = useState(false);

    const onChangeImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            message.warning("No photo selected");
            return;
        }

        const formdata = new FormData();
        formdata.set("file", file);

        try {
            setLoadingUpload(true);

            const resp = await fetchUploadFile(formdata);
            setEditImgSrc(resp.url);
        } catch {
            message.failed("Failed to upload photo");
        } finally {
            setLoadingUpload(false);
        }
    };

    const onConfirmEditImg = async () => {
        if (user.avatar_uri === editImgSrc || user.profile_background_uri === editImgSrc) {
            message.warning("Same picture");
            setShowEditImg(false);
            return;
        }

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

            const newState = [
                {
                    avatar_uri: editImgSrc,
                },
                {
                    profile_background_uri: editImgSrc,
                },
            ];
            setUser({ user: { ...user, ...newState[editImgType] } });

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
    };

    // Log out.
    const [loadingLogout, setLoadingLogout] = useState(false);
    const navigate = useNavigate();
    const onLogout = async () => {
        try {
            setLoadingLogout(true);
            await fetchLogout();

            removeToken();
            removeRefreshToken();

            navigate("/login");
            message.success("Logged out");
        } catch {
            message.internal();
        } finally {
            setLoadingLogout(false);
        }
    };

    return (
        <>
            <div className="profile">
                <section
                    className="header"
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditImgType(1);
                        setEditImgSrc(user.profile_background_uri);
                        setShowEditImg(true);
                    }}
                >
                    <div className="info">
                        <div
                            className="avatar"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditImgType(0);
                                setEditImgSrc(user.avatar_uri);
                                setShowEditImg(true);
                            }}
                        >
                            {user.avatar_uri !== "" && <img src={user.avatar_uri} />}
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

                    {user.profile_background_uri !== "" && <img src={user.profile_background_uri} />}
                </section>

                <section>
                    <p>Waiting for developing...</p>
                </section>

                <section className="logout">
                    <Button title="Log out" loading={loadingLogout} onClick={onLogout} />
                </section>
            </div>

            <Modal
                show={showEditName}
                onShow={(show) => setShowEditName(show)}
                title="Rename"
                description="Enter your new username."
                loading={loadingEditName}
                onConfirm={onConfirmEditName}
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
                title={MODAL_TITLES[editImgType]}
                description="Upload picture by clicking the photo."
                loading={loadingEditImg}
                onConfirm={onConfirmEditImg}
            >
                <div className="edit-input">
                    <label htmlFor="edit-img">
                        {loadingUpload ? (
                            <div className="loading">
                                <Loading />
                            </div>
                        ) : editImgSrc === "" ? (
                            <NoImg />
                        ) : (
                            <img src={editImgSrc} />
                        )}
                    </label>
                    <input
                        id="edit-img"
                        className="edit-input"
                        type="file"
                        accept="image/*"
                        onChange={onChangeImgFile}
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
            <span>No Picture Set</span>
        </div>
    );
}

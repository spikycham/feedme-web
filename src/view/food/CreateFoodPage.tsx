import { useState } from "react";

import { message } from "@/component/message/Message";
import Back from "@/component/back/Back";
import Button from "@/component/button/Button";

import fetchUploadFile from "@/network/upload-file.api";

import i18n from "@/i18n";

export default function CreateFoodPage() {
    const [loadingUploadImg, setLoadingUploadImg] = useState(false);
    const [imgUri, setImgUri] = useState("");

    const onChangeImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            message.warning(i18n.t("no_photo_selected"));
            return;
        }

        const formdata = new FormData();
        formdata.set("file", file);

        try {
            setLoadingUploadImg(true);

            const resp = await fetchUploadFile(formdata);
            setImgUri(resp.url);
        } catch {
            message.failed(i18n.t("failed_to_upload_photo"));
        } finally {
            setLoadingUploadImg(false);
        }
    };

    const handleSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <form className="create-food" onSubmit={handleSubmitForm}>
            <section className="header">
                <Back />
                <h2>$$Add new meal</h2>
            </section>

            <section className="img">
                {loadingUploadImg ? (
                    <UploadImgLoading />
                ) : (
                    <>
                        <label className="upload-img" htmlFor="upload-img">
                            {imgUri === "" ? <div>wait for uploading...</div> : <div>image</div>}
                        </label>
                        <input
                            id="upload-img"
                            type="file"
                            accept="image/*"
                            onChange={onChangeImgFile}
                        />
                    </>
                )}
            </section>

            <section className="display-info"></section>

            <section className="cook-info"></section>

            <Button title="$$提交" htmlType="submit" />
        </form>
    );
}

function UploadImgLoading() {
    return <div>loading...</div>;
}

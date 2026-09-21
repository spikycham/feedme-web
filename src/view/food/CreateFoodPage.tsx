import { useState } from "react";

import { message } from "@/component/message/Message";
import Back from "@/component/back/Back";
import Button from "@/component/button/Button";

import fetchUploadFile from "@/network/upload-file.api";

import i18n from "@/i18n";
import { Ban, Loader } from "lucide-react";

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

    // Form items.
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [price, setPrice] = useState(0); // request field name is "prize"
    const [requiredTime, setRequiredTime] = useState(0);
    const [category, setCategory] = useState(0);

    const handleSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <form className="create-food" onSubmit={handleSubmitForm}>
            <section className="header">
                <Back />
                <h2>$$添加菜品</h2>
            </section>

            <section className="img">
                {loadingUploadImg ? (
                    <UploadImgLoading />
                ) : (
                    <>
                        <label className="upload-img" htmlFor="upload-img">
                            {imgUri === "" ? (
                                <div className="wait">
                                    <Ban size={20} />
                                    <span>$$点击上传...</span>
                                </div>
                            ) : (
                                imgUri !== "" && <img src={imgUri} />
                            )}
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

            <section className="display-info">
                <h3>$$展示信息</h3>
                <FormItem label="$$菜名" value={name} onChange={(v) => setName(v)} />
                <FormItem label="$$菜品描述" value={detail} onChange={(v) => setDetail(v)} />
                <FormItem label="$$标价" value={price} onChange={(v) => setPrice(v)} />
                <FormItem label="$$需要时间 (s)" value={price} onChange={(v) => setPrice(v)} />
                {/* TODO: select the category */}
            </section>

            <section className="cook-info"></section>

            <Button title="$$提交" htmlType="submit" />
        </form>
    );
}

function UploadImgLoading() {
    return (
        <div className="loading-img">
            <Loader size={20} />
            <span>$$加载中...</span>
        </div>
    );
}

interface FormItemProps<T extends string | number> {
    label: string;
    value: T;
    onChange: (v: T) => void;
}
function FormItem<T extends string | number>(props: FormItemProps<T>) {
    const isNumber = typeof props.value === "number";

    return (
        <div className="form-item">
            <span>{props.label}</span>
            <input
                type={isNumber ? "number" : "text"}
                value={props.value}
                onChange={(e) => {
                    const v = e.target.value as T;
                    if (isNumber && Number(v) <= 0) {
                        props.onChange(0 as T);
                        return;
                    }

                    if (isNumber) {
                        props.onChange(Number(v) as T);
                        return;
                    }

                    props.onChange(v);
                }}
            />
        </div>
    );
}

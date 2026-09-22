import { useState } from "react";
import { Ban, Loader } from "lucide-react";

import { message } from "@/component/message/Message";
import Back from "@/component/back/Back";
import Button from "@/component/button/Button";
import Select, { type Option } from "@/component/select/Select";

import { foodCategoryMap } from "./category";

import fetchUploadFile from "@/network/upload-file.api";

import i18n from "@/i18n";

const categoryOptions: Option<number>[] = foodCategoryMap.map((c) => ({
    key: c.key,
    label: c.name,
    value: c.key,
}));

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
    const [price, setPrice] = useState("0"); // request field name is "prize"
    const [requiredTime, setRequiredTime] = useState("0");
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
                <FormItem label="$$菜名" type="text" value={name} onChange={(v) => setName(v)} />
                <FormItem
                    label="$$菜品描述"
                    type="text"
                    value={detail}
                    onChange={(v) => setDetail(v)}
                />
                <FormItem
                    label="$$标价"
                    type="number"
                    value={price}
                    onChange={(v) => setPrice(v)}
                />
                <FormItem
                    label="$$需要时间 (sec)"
                    type="number"
                    value={requiredTime}
                    onChange={(v) => setRequiredTime(v)}
                />

                <div className="form-item">
                    <span>$$菜品种类</span>
                    <Select
                        options={categoryOptions}
                        value={category}
                        onChange={(v) => setCategory(v)}
                    />
                </div>
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

interface FormItemProps {
    label: string;
    value: string;
    type: "text" | "number";
    onChange: (v: string) => void;
}
function FormItem(props: FormItemProps) {
    return (
        <div className="form-item">
            <span>{props.label}</span>
            <input
                type={props.type}
                value={props.value}
                onChange={(e) => {
                    const v = e.target.value;

                    if (props.type === "text") {
                        props.onChange(v);
                        return;
                    }

                    const parsed = parseFloat(v);
                    if (Number.isNaN(parsed) || parsed < 0) {
                        props.onChange("0");
                        return;
                    }

                    if (parsed >= 10000) {
                        props.onChange("9999");
                        return;
                    }

                    props.onChange(String(parsed));
                }}
            />
        </div>
    );
}

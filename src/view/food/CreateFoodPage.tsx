import { useRef, useState } from "react";
import { Ban, Loader, Plus, X } from "lucide-react";

import { message } from "@/component/message/Message";
import Back from "@/component/back/Back";
import Button from "@/component/button/Button";
import Select, { type Option } from "@/component/select/Select";
import Modal from "@/component/modal/Modal";

import { foodCategoryMap } from "./category";

import fetchUploadFile from "@/network/upload-file.api";
import fetchCreateFood, { CreateFoodBody } from "@/network/create-food.api";

import i18n from "@/i18n";
import { NetworkError } from "@/network/network";

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
    const [loadingCreate, setLoadingCreate] = useState(false);

    // Display informations.
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [price, setPrice] = useState("0"); // request field name is "prize"
    const [requiredTime, setRequiredTime] = useState("0"); // input min, need sec
    const [category, setCategory] = useState(0);

    // Ingredients.
    const [showAddIng, setShowAddIng] = useState(false);
    const [currIng, setCurrIng] = useState("");

    const [ings, setIngs] = useState<{ key: number; label: string }[]>([]);
    const ingKeyRef = useRef(0);

    // Cook steps.
    const [steps, setSteps] = useState<FoodStep[]>([]);
    const stepKeyRef = useRef(0);

    const handleSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (name === "" || detail === "" || requiredTime === "0") {
            message.warning("missing_fields");
            return;
        }

        const body = new CreateFoodBody({
            name,
            detail,
            prize: Number(price),
            required_time: Number(requiredTime),
            category,
        });
        body.addImg(imgUri);
        body.addIngs(ings.map((v) => v.label));
        body.addSteps(
            steps.map((v, idx) => ({
                sort: idx,
                detail: v.detail,
            })),
        );

        try {
            setLoadingCreate(true);
            await fetchCreateFood(body.body);
        } catch (err) {
            if (err instanceof NetworkError) {
                message.failed(i18n.t("failed_to_create_food"));
                return;
            }
            message.internal();
        } finally {
            setLoadingCreate(false);
        }
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
                    label="$$需要时间 (min)"
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

            <section className="ing-info">
                <h3>{i18n.t("ingredients")}</h3>

                <div className="content">
                    {ings.map((ing) => (
                        <div
                            className="ing"
                            key={ing.key}
                            onClick={() => {
                                setIngs((prev) => {
                                    const newState = [...prev];
                                    const idx = newState.findIndex((s) => s.key === ing.key);
                                    if (idx === -1) return newState;

                                    newState.splice(idx, 1);
                                    return newState;
                                });
                            }}
                        >
                            <span>{ing.label}</span>
                            <X size={20} />
                        </div>
                    ))}

                    <div className="add-ing" onClick={() => setShowAddIng(true)}>
                        <Plus size={20} />
                        <span>{i18n.t("add_ingredient")}</span>
                    </div>
                </div>
            </section>

            <section className="step-info">
                <h3>{i18n.t("steps")}</h3>
                {steps.map((step, idx) => (
                    <div className="step" key={step.sort}>
                        <span>{idx + 1}.&nbsp;</span>
                        <input
                            value={step.detail}
                            placeholder={i18n.t("please_input")}
                            onChange={(e) =>
                                setSteps((prev) => {
                                    const newState = [...prev];
                                    const target = newState.find((s) => s.sort === step.sort);
                                    if (!target) return newState;
                                    target.detail = e.target.value;
                                    return newState;
                                })
                            }
                        />
                    </div>
                ))}

                <div
                    className="step-add"
                    onClick={() => {
                        setSteps((prev) => {
                            const newState = [...prev];
                            newState.push({ sort: stepKeyRef.current++, detail: "" });
                            return newState;
                        });
                    }}
                >
                    <Plus size={20} />
                    <span>{i18n.t("add_step")}</span>
                </div>
            </section>

            <Button title="$$提交" htmlType="submit" loading={loadingCreate} />

            <Modal
                show={showAddIng}
                onShow={(show) => setShowAddIng(show)}
                title={i18n.t("add_ingredient")}
                loading={false}
                onConfirm={() => {
                    if (currIng === "") {
                        message.warning(i18n.t("please_input"));
                        return;
                    }

                    setIngs((prev) => {
                        const newState = [...prev];
                        newState.push({ key: ingKeyRef.current++, label: currIng });
                        return newState;
                    });
                    setCurrIng("");
                    setShowAddIng(false);
                }}
                onCancel={() => setCurrIng("")}
            >
                <input
                    className="add-ing"
                    placeholder={i18n.t("please_input")}
                    value={currIng}
                    onChange={(e) => setCurrIng(e.target.value)}
                />
            </Modal>
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
                placeholder={i18n.t("please_input")}
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFoodsStore } from "@/store/food.store";
import { useOrdersStore } from "@/store/order.store";

import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";
import Modal from "@/component/modal/Modal";
import Button from "@/component/button/Button";

import { NetworkError } from "@/network/network";
import fetchOrderList from "@/network/order-list.api";
import fetchUpdateOrderStatus from "@/network/update-order-status.api";

import { getDateTimeBySec, getMinBySec } from "@/util/time";

import i18n from "@/i18n";
import "./index.css";
import Title from "@/component/title/Title";

export default function CurrentOrder() {
    const foods = useFoodsStore((state) => state.foods);
    const orders = useOrdersStore((state) => state.orders);

    const [loadingPage, setLoadingPage] = useState(false);
    const setOrders = useOrdersStore((state) => state.setOrders);

    useEffect(() => {
        if (orders.length !== 0) return;

        const init = async () => {
            if (orders.length > 0) return;

            setLoadingPage(true);

            try {
                const data = await fetchOrderList();
                setOrders(data.list);
            } catch (err) {
                if (err instanceof NetworkError) {
                    message.failed(i18n.t("failed_to_fetch_order_list"));
                    return;
                }
                message.internal();
            } finally {
                setLoadingPage(false);
            }
        };

        init();
    }, []);

    // Actions.
    const [showModal, setShowModal] = useState(false);
    const [actionModalTitle, setActionModalTitle] = useState("Confirm to finish?");
    const [actionModalDescription, setActionModalDescription] = useState("Confirm to finish?");
    const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);

    const [updateStatusId, setUpdateStatusId] = useState("");
    const [updateStatusValue, setUpdateStatusValue] = useState<OrderStatus>(0);

    const updateOrederStatus = useOrdersStore((state) => state.updateOrderStatus);
    const navigate = useNavigate();

    // For animation.
    const filterted = orders
        .filter((o) => o.status === 0)
        .sort((a, b) => b.created_at - a.created_at);
    const [offset, setOffset] = useState(0);

    return (
        <>
            <Title title={i18n.t("current_order")} />
            <div className="service">
                <h2>{i18n.t("current_order_prompt")}</h2>
                {loadingPage ? (
                    <Loading />
                ) : (
                    <div className="card-container">
                        {filterted[offset] ? (
                            <section
                                className="card"
                                onDoubleClick={(e) => {
                                    setOffset((prev) => {
                                        if (e.clientX > window.innerWidth / 2) {
                                            return (prev + 1) % filterted.length;
                                        }
                                        if (prev === 0) {
                                            return filterted.length - 1;
                                        }
                                        return prev - 1;
                                    });
                                }}
                            >
                                <header>
                                    <h2>Order: #{filterted[offset].order_id.slice(0, 4)}</h2>
                                    <p>
                                        {i18n.t("food_count", {
                                            count: filterted[offset].foods.length,
                                        })}
                                        &nbsp;|&nbsp;{i18n.t("order_by", { name: "Cham" })}
                                        &nbsp;|&nbsp;
                                        {getDateTimeBySec(filterted[offset].created_at)}
                                    </p>
                                </header>

                                <main>
                                    {filterted[offset].foods.map((orderFood) => {
                                        const food = foods.find(
                                            (f) => f.food_id === orderFood.food_id,
                                        );

                                        if (!food) return null;

                                        return (
                                            <div
                                                className="food"
                                                key={orderFood.food_id}
                                                onClick={() =>
                                                    navigate(
                                                        `/layout/food/detail/${orderFood.food_id}`,
                                                    )
                                                }
                                            >
                                                <div className="photo">
                                                    {food.image_uris[0] && (
                                                        <img src={food.image_uris[0]} />
                                                    )}
                                                </div>
                                                <div className="info">
                                                    <h3>{food.name}</h3>
                                                    <span>
                                                        {i18n.t("spend_time")}:&nbsp;
                                                        {(
                                                            Number(
                                                                getMinBySec(food.required_time),
                                                            ) * orderFood.count
                                                        ).toFixed(0)}
                                                        min
                                                    </span>
                                                    <span>
                                                        {i18n.t("quantity")}: {orderFood.count}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </main>

                                <footer>
                                    <h2>{i18n.t("wait_for_finish")}</h2>
                                    <div className="actions">
                                        <Button
                                            title={i18n.t("action_reject")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUpdateStatusId(filterted[offset].order_id);
                                                setUpdateStatusValue(1);
                                                setActionModalTitle(i18n.t("action"));
                                                setActionModalDescription(
                                                    i18n.t("reject_cook_prompt"),
                                                );
                                                setShowModal(true);
                                            }}
                                        />
                                        <Button
                                            title={i18n.t("action_finish")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUpdateStatusId(filterted[offset].order_id);
                                                setUpdateStatusValue(2);
                                                setActionModalTitle(i18n.t("action"));
                                                setActionModalDescription(
                                                    i18n.t("finish_cook_prompt"),
                                                );
                                                setShowModal(true);
                                            }}
                                        />
                                    </div>
                                </footer>
                            </section>
                        ) : (
                            <p>{i18n.t("no_order")}</p>
                        )}
                    </div>
                )}
            </div>

            <Modal
                show={showModal}
                onShow={setShowModal}
                title={actionModalTitle}
                description={actionModalDescription}
                loading={loadingUpdateStatus}
                onConfirm={async () => {
                    setLoadingUpdateStatus(true);
                    try {
                        if (updateStatusId === "") return;
                        await fetchUpdateOrderStatus({
                            order_id: updateStatusId,
                            status: updateStatusValue,
                        });
                        updateOrederStatus(updateStatusId, updateStatusValue);
                        if (updateStatusValue === 1) {
                            message.success(i18n.t("reject_order"));
                        } else {
                            message.success(i18n.t("finish_order"));
                        }
                    } catch (err) {
                        if (err instanceof NetworkError) {
                            message.failed(i18n.t("failed_to_update_order_status"));
                            return;
                        }
                        message.internal();
                    } finally {
                        setLoadingUpdateStatus(false);
                        setShowModal(false);
                    }
                }}
            />
        </>
    );
}

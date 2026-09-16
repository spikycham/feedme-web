import { useEffect, useState } from "react";
import { useFoodsStore } from "@/store/food.store";
import { useOrdersStore } from "@/store/order.store";

import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";
import Button from "@/component/button/Button";
import Modal from "@/component/modal/Modal";

import { NetworkError } from "@/network/network";
import fetchOrderList from "@/network/order-list.api";
import { getDateTimeBySec, getMinBySec } from "@/util/time";

import fetchUpdateOrderStatus from "@/network/update-order-status.api";

import i18n from "@/i18n";
import "./index.css";

const orderStatusMap = [
    {
        label: i18n.t("status_pending"),
        color: "var(--color-yellow)",
    },
    {
        label: i18n.t("status_rejected"),
        color: "var(--color-red)",
    },
    {
        label: i18n.t("status_done"),
        color: "var(--color-green)",
    },
];

export default function OrderPage() {
    const foods = useFoodsStore((state) => state.foods);
    const orders = useOrdersStore((state) => state.orders);

    const [loadingPage, setLoadingPage] = useState(false);
    const setOrders = useOrdersStore((state) => state.setOrders);

    useEffect(() => {
        const init = async () => {
            if (orders.length > 0) return;

            setLoadingPage(true);

            try {
                const data = await fetchOrderList();
                setOrders(data.list);
            } catch (err) {
                if (err instanceof NetworkError) {
                    message.failed("Failed to fetch order list");
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

    return (
        <>
            {loadingPage ? (
                <Loading />
            ) : (
                <div className="order-list">
                    <ul className="list">
                        {orders
                            .sort((a, b) => b.created_at - a.created_at)
                            .map((order) => (
                                <li key={order.order_id} className="item">
                                    <section className="header">
                                        <h3>Order #: {order.order_id.slice(0, 4)}</h3>
                                        <p>
                                            {i18n.t("food_count", { count: order.foods.length })} |
                                            &nbsp;{i18n.t("order_by", { name: "Cham" })} |&nbsp;
                                            {getDateTimeBySec(order.created_at)}
                                        </p>
                                    </section>

                                    <BreakLine />

                                    <section className="info">
                                        <p>
                                            <span className="title">{i18n.t("status")}:</span>
                                            <span
                                                style={{
                                                    color: orderStatusMap[order.status].color,
                                                }}>
                                                {orderStatusMap[order.status].label}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="title">
                                                {i18n.t("total_expense")}:
                                            </span>
                                            <span>
                                                {i18n.t("money_sign")}
                                                {order.amount.toFixed(2)}
                                            </span>
                                        </p>
                                    </section>

                                    <BreakLine />

                                    <section className="content">
                                        {order.foods.map((orderFood) => {
                                            const food = foods.find(
                                                (f) => f.food_id === orderFood.food_id,
                                            );

                                            if (!food) return null;

                                            return (
                                                <div className="food" key={orderFood.food_id}>
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
                                    </section>

                                    {order.status === 0 && (
                                        <>
                                            <BreakLine />

                                            <section className="action">
                                                <Button
                                                    title={i18n.t("action_reject")}
                                                    onClick={() => {
                                                        setUpdateStatusId(order.order_id);
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
                                                    onClick={() => {
                                                        setUpdateStatusId(order.order_id);
                                                        setUpdateStatusValue(2);
                                                        setActionModalTitle(i18n.t("action"));
                                                        setActionModalDescription(
                                                            i18n.t("finish_cook_prompt"),
                                                        );
                                                        setShowModal(true);
                                                    }}
                                                />
                                            </section>
                                        </>
                                    )}
                                </li>
                            ))}
                    </ul>
                </div>
            )}

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
                    } catch (err) {
                        if (err instanceof NetworkError) {
                            message.failed("Failed to update order status");
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

function BreakLine() {
    return <div className="break-line"></div>;
}

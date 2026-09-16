import { useEffect, useState } from "react";
import { useFoodsStore } from "@/store/food.store";

import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";
import Button from "@/component/button/Button";
import Modal from "@/component/modal/Modal";

import { NetworkError } from "@/network/network";
import fetchOrderList from "@/network/order-list.api";
import { getDateTimeBySec, getMinBySec } from "@/util/time";

import fetchUpdateOrderStatus from "@/network/update-order-status.api";

import "./index.css";
import { useOrdersStore } from "@/store/order.store";
import i18n from "@/i18n";

const orderStatusMap = [
    {
        label: "Pending",
        color: "var(--color-yellow)",
    },
    {
        label: "Rejected",
        color: "var(--color-red)",
    },
    {
        label: "Done",
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
                                <li
                                    key={order.order_id}
                                    className="item">
                                    <section className="header">
                                        <h3>Order #: {order.order_id.slice(0, 4)}</h3>
                                        <p>
                                            {order.foods.length} Foods | By Cham |{" "}
                                            {getDateTimeBySec(order.created_at)}
                                        </p>
                                    </section>

                                    <BreakLine />

                                    <section className="info">
                                        <p>
                                            <span className="title">Status:</span>
                                            <span
                                                style={{
                                                    color: orderStatusMap[order.status].color,
                                                }}>
                                                {orderStatusMap[order.status].label}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="title">Total:</span>
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
                                                <div
                                                    className="food"
                                                    key={orderFood.food_id}>
                                                    <div className="photo">
                                                        {food.image_uris[0] && (
                                                            <img src={food.image_uris[0]} />
                                                        )}
                                                    </div>
                                                    <div className="info">
                                                        <h3>{food.name}</h3>
                                                        <span>
                                                            Time:&nbsp;
                                                            {(
                                                                Number(
                                                                    getMinBySec(food.required_time),
                                                                ) * orderFood.count
                                                            ).toFixed(0)}
                                                            min
                                                        </span>
                                                        <span>Quantity: {orderFood.count}</span>
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
                                                    title="Reject"
                                                    onClick={() => {
                                                        setUpdateStatusId(order.order_id);
                                                        setUpdateStatusValue(1);
                                                        setActionModalTitle("Action");
                                                        setActionModalDescription(
                                                            "Reject food request?",
                                                        );
                                                        setShowModal(true);
                                                    }}
                                                />
                                                <Button
                                                    title="Finish"
                                                    onClick={() => {
                                                        setUpdateStatusId(order.order_id);
                                                        setUpdateStatusValue(2);
                                                        setActionModalTitle("Action");
                                                        setActionModalDescription(
                                                            "Finish cooking?",
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

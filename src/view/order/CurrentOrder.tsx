import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFoodsStore } from "@/store/food.store";
import { useOrdersStore } from "@/store/order.store";

import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";
import Modal from "@/component/modal/Modal";
import Button from "@/component/button/Button";
import Title from "@/component/title/Title";

import { NetworkError } from "@/network/network";
import fetchOrderList from "@/network/order-list.api";
import fetchUpdateOrderStatus from "@/network/update-order-status.api";

import { getDateTimeBySec, getMinBySec } from "@/util/time";

import i18n from "@/i18n";
import "./index.css";

export default function CurrentOrder() {
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

    const filtered = orders
        .filter((o) => o.status === 0)
        .sort((a, b) => b.created_at - a.created_at);
    const [offset, setOffset] = useState(0);
    const next1 = filtered.length > 1 ? filtered[(offset + 1) % filtered.length] : getFakeOrder();
    const next2 = filtered.length > 2 ? filtered[(offset + 2) % filtered.length] : getFakeOrder();

    const [orderAction, setOrderAction] = useState<{ id: string; status: OrderStatus } | null>(
        null,
    );
    const [showModal, setShowModal] = useState(false);
    const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);

    const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus);

    return (
        <>
            <Title title={i18n.t("current_order")} />
            <div className="service">
                {loadingPage ? (
                    <Loading />
                ) : (
                    <div className="card-container">
                        <Card
                            order={filtered[offset] ?? getFakeOrder()}
                            onAction={(id, status) => {
                                setShowModal(true);
                                setOrderAction({ id, status });
                            }}
                        />
                        <Card order={next1} isLeft />
                        <Card order={next2} isRight />
                        // TODO: previous and next order.
                        <button>left</button>
                    </div>
                )}
            </div>

            <Modal
                show={showModal}
                onShow={setShowModal}
                title={i18n.t("action")}
                description={
                    orderAction?.status === 1
                        ? i18n.t("reject_cook_prompt")
                        : i18n.t("finish_cook_prompt")
                }
                loading={loadingUpdateStatus}
                onConfirm={async () => {
                    if (!orderAction) return;

                    setLoadingUpdateStatus(true);
                    try {
                        await fetchUpdateOrderStatus({
                            order_id: orderAction.id,
                            status: orderAction.status,
                        });

                        updateOrderStatus(orderAction.id, orderAction.status);
                        if (orderAction.status === 1) {
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

interface CardProps {
    order: Order;
    isLeft?: boolean;
    isRight?: boolean;
    onAction?: (id: string, status: OrderStatus) => void;
}
function Card(props: CardProps) {
    const foods = useFoodsStore((state) => state.foods);
    const navigate = useNavigate();

    const clsn = props.isLeft ? "card-left" : props.isRight ? "card-right" : "card";
    return (
        <section
            className={clsn}
            onClickCapture={(e) => {
                if (props.isLeft || props.isRight) {
                    e.stopPropagation();
                }
            }}
        >
            <header>
                <h2>Order: #{props.order.order_id.slice(0, 4)}</h2>
                <p>
                    {i18n.t("food_count", {
                        count: props.order.foods.length,
                    })}
                    &nbsp;|&nbsp;{i18n.t("order_by", { name: "Cham" })}
                    &nbsp;|&nbsp;
                    {getDateTimeBySec(props.order.created_at ?? new Date().valueOf())}
                </p>
            </header>

            <main>
                {props.order.foods.length === 0 ? (
                    <p>{i18n.t("no_order")}</p>
                ) : (
                    props.order.foods.map((orderFood) => {
                        const food = foods.find((f) => f.food_id === orderFood.food_id);

                        if (!food) return null;

                        return (
                            <div
                                className="food"
                                key={orderFood.food_id}
                                onClick={() => navigate(`/layout/food/detail/${orderFood.food_id}`)}
                            >
                                <div className="photo">
                                    {food.image_uris[0] && <img src={food.image_uris[0]} />}
                                </div>
                                <div className="info">
                                    <h3>{food.name}</h3>
                                    <span>
                                        {i18n.t("spend_time")}:&nbsp;
                                        {(
                                            Number(getMinBySec(food.required_time)) *
                                            orderFood.count
                                        ).toFixed(0)}
                                        min
                                    </span>
                                    <span>
                                        {i18n.t("quantity")}: {orderFood.count}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            <footer>
                <div className="actions">
                    <Button
                        title={i18n.t("action_reject")}
                        onClick={() => {
                            props.onAction?.(props.order.order_id, 1);
                        }}
                    />
                    <Button
                        title={i18n.t("action_finish")}
                        onClick={() => {
                            props.onAction?.(props.order.order_id, 2);
                        }}
                    />
                </div>
            </footer>
        </section>
    );
}

function getFakeOrder(): Order {
    return {
        order_id: Math.random().toString(32),
        status: 0,
        amount: Math.random() * 50,
        created_at: Date.now(),
        done_at: -1,
        comment: "",
        commented_at: -1,
        comment_deleted_at: -1,
        foods: [],
    };
}

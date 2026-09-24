import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFoodsStore } from "@/store/food.store";
import { useOrdersStore } from "@/store/order.store";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";
import Modal from "@/component/modal/Modal";
import Button from "@/component/button/Button";
import Title from "@/component/title/Title";

import { getDateTimeBySec, getMinBySec, getTimeAndPeriodBySec } from "@/util/time";

import { NetworkError } from "@/network/network";
import fetchOrderList from "@/network/order-list.api";
import fetchUpdateOrderStatus from "@/network/update-order-status.api";

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
                    <>
                        <div className="welcome-container">
                            {/* <Welcome
                                timestamp={now - 1000}
                                content={i18n.t("welcome_cook", { name: user.name })}
                            /> */}
                            <Welcome timestamp={now} content={texts[textIdx]} />
                        </div>

                        <section>
                            <section className="card-container">
                                <Card order={filtered[offset] ?? getFakeOrder()} />
                                <Card order={next1} isLeft />
                                <Card order={next2} isRight />

                                <button
                                    className="action left"
                                    onClick={() =>
                                        setOffset((prev) => {
                                            if (prev === filtered.length - 1) return 0;
                                            return prev + 1;
                                        })
                                    }
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    className="action right"
                                    onClick={() => {
                                        setOffset((prev) => {
                                            if (prev === 0) return filtered.length - 1;
                                            return prev - 1;
                                        });
                                    }}
                                >
                                    <ChevronRight />
                                </button>
                            </section>

                            <section className="actions">
                                <h3>
                                    {i18n.t("current_order_id")}: #
                                    {filtered[offset]?.order_id.slice(0, 4) ?? "xxxx"}
                                </h3>
                                <p>{i18n.t("please_confirm_order")}</p>
                                <div className="buttons">
                                    <Button
                                        title={i18n.t("action_reject")}
                                        onClick={() => {
                                            if (!filtered[offset]) {
                                                message.warning(i18n.t("no_order_select"));
                                                return;
                                            }

                                            setShowModal(true);
                                            setOrderAction({
                                                id: filtered[offset]?.order_id,
                                                status: 1,
                                            });
                                        }}
                                    />
                                    <Button
                                        title={i18n.t("action_finish")}
                                        onClick={() => {
                                            if (!filtered[offset]) {
                                                message.warning(i18n.t("no_order_select"));
                                                return;
                                            }

                                            setShowModal(true);
                                            setOrderAction({
                                                id: filtered[offset].order_id,
                                                status: 2,
                                            });
                                        }}
                                    />
                                </div>
                            </section>
                        </section>
                    </>
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
                        setOffset(0);
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

interface WelcomeProps {
    content: string;
    timestamp: number;
}
const texts = [
    "欢迎来到今日厨房！看看有什么新订单，选一道喜欢的料理，用你的厨艺完成今天的挑战吧！",
    "今天的订单已经到位！挑选一道你拿手的料理，认真完成它，看看能收获多少好评吧！",
    "订单来了！选择一道你想做的料理，发挥你的厨艺，把今天的每一份餐点都做好！",
    "准备好了吗？今天又有新的订单等你完成，选好料理，开始你的厨师挑战吧！",
];
const textIdx = Math.floor(Math.random() * texts.length);
function Welcome(props: WelcomeProps) {
    return (
        <div className="welcome">
            <section className="avatar">
                <img src="https://assets.devcham.xyz/feedme/6b26f1047d42c5ce9f1decb11d186ac1.png" />
            </section>
            <section className="chat">
                <p>
                    <span>Dev Cham&nbsp;</span>
                    <span className="time">{getTimeAndPeriodBySec(props.timestamp)}</span>
                </p>
                <div className="msg">
                    <p>{props.content}</p>
                </div>
            </section>
        </div>
    );
}

interface CardProps {
    order: Order;
    isLeft?: boolean;
    isRight?: boolean;
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
                <p className="amount">
                    {i18n.t("total_expense")}: {i18n.t("money_sign")}
                    {props.order.amount.toFixed(2)}
                </p>
                <p>
                    {props.order.foods.length === 0
                        ? i18n.t("order_by", { name: "No" })
                        : i18n.t("order_by", { name: "Cham" })}
                </p>
            </footer>
        </section>
    );
}

const now = Date.now().valueOf() / 1000;
function getFakeOrder(): Order {
    return {
        order_id: "xxxx",
        status: 0,
        amount: 0,
        created_at: now,
        done_at: -1,
        comment: "",
        commented_at: -1,
        comment_deleted_at: -1,
        foods: [],
    };
}

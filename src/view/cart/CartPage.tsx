import { useState } from "react";
import { useFoodsStore } from "@/store/food.store";
import { useCartStore } from "@/store/cart.store";

import { ClipboardCheck, Trash } from "lucide-react";
import { message } from "@/component/message/Message";
import Modal from "@/component/modal/Modal";
import OrderAction from "../food/Action";

import { NetworkError } from "@/network/network";
import fetchCreateOrder from "@/network/create-order.api";
import type { RequestCreateOrder } from "@/network/create-order.api";

import i18n from "@/i18n";
import "./index.css";
import Title from "@/component/title/Title";

export default function CartPage() {
    const [showPay, setShowPay] = useState(false);
    const [loadingPay, setLoadingPay] = useState(false);

    // Display food details.
    const foods = useFoodsStore((state) => state.foods);
    const getFoodDetail = (id: string) => {
        return foods.find((f) => f.food_id === id);
    };

    // Cart actions.
    const clearOne = useCartStore((state) => state.clearOne);
    const clearAll = useCartStore((state) => state.clearAll);

    // Submit pay.
    const amount = useCartStore((state) => state.amount);
    const cartFoods = useCartStore((state) => state.foods);
    const body: RequestCreateOrder = {
        amount,
        foods: [],
    };
    for (const [id, count] of cartFoods.entries()) {
        body.foods.push({ food_id: id, count: count });
    }

    const submitPay = async () => {
        if (amount === 0) {
            message.warning(i18n.t("cart_empty_prompt"));
            setShowPay(false);
            return;
        }

        setLoadingPay(true);
        try {
            await fetchCreateOrder(body);
            clearAll();
            message.success(i18n.t("order_created_success"));
        } catch (err) {
            console.log(err);

            if (err instanceof NetworkError) {
                message.failed(i18n.t("order_create_failed"));
                return;
            }
            message.internal();
        } finally {
            setLoadingPay(false);
            setShowPay(false);
        }
    };

    return (
        <>
            <Title title={i18n.t("cart")} />
            <div className="cart">
                <section>
                    {cartFoods.size === 0 ? (
                        <h1 className="empty">
                            <span>{i18n.t("cart_empty_prompt")},</span>
                            <span>
                                &nbsp;&nbsp;&nbsp;&nbsp;{i18n.t("lets_get_your")}
                                <strong>{i18n.t("cart_food_prompt")}</strong>!
                            </span>
                        </h1>
                    ) : (
                        <ul className="list">
                            <li className="item total">
                                <span>{i18n.t("total_expense")}:</span>
                                <span className="price">
                                    {i18n.t("money_sign")}
                                    {amount.toFixed(2)}
                                </span>
                            </li>

                            {[...cartFoods.entries()].map(([id, count]) => {
                                const food = getFoodDetail(id);
                                if (!food) return null;

                                return (
                                    <li key={id} className="item">
                                        <section className="info">
                                            <div className="photo">
                                                {food.image_uris[0] && (
                                                    <img src={food.image_uris[0]} />
                                                )}
                                            </div>
                                            <div className="text">
                                                <h3>{food.name}</h3>
                                            </div>
                                        </section>
                                        <section className="actions">
                                            <OrderAction
                                                food_id={food.food_id}
                                                name={food.name}
                                                price={food.prize}
                                                count={count}
                                            />

                                            <button
                                                className="clear"
                                                onClick={() => clearOne(food.food_id, food.prize)}
                                            >
                                                <Trash />
                                            </button>
                                        </section>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                <button className="pay" onClick={() => setShowPay(true)}>
                    <ClipboardCheck />
                </button>
            </div>

            <Modal
                show={showPay}
                onShow={setShowPay}
                title={i18n.t("pay_for_meals")}
                loading={loadingPay}
                onConfirm={submitPay}
            >
                <span>
                    {i18n.t("total_expense")}: {i18n.t("money_sign")}
                    {amount.toFixed(2).padStart(5, "0")}
                </span>
            </Modal>
        </>
    );
}

// show: boolean;
// onShow: (show: boolean) => void;
// title: string;
// description?: string;
// loading: boolean;
// onConfirm?: () => void;
// onCancel?: () => void;
// children?: React.ReactNode;

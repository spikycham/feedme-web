import { useState } from "react";
import { useCartStore } from "@/store/cart.store";

import { ClipboardCheck } from "lucide-react";
import Modal from "@/component/modal/Modal";

import fetchCreateOrder from "@/network/create-order.api";
import type { RequestCreateOrder } from "@/network/create-order.api";

import "./index.css";
import { NetworkError } from "@/network/network";
import { message } from "@/component/message/Message";

export default function CartPage() {
    const [showPay, setShowPay] = useState(false);
    const [loadingPay, setLoadingPay] = useState(false);

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
            message.warning("No meal in cart");
            setShowPay(false);
            return;
        }

        setLoadingPay(true);
        try {
            await fetchCreateOrder(body);
        } catch (err) {
            if (err instanceof NetworkError) {
                message.failed("Failed to pay");
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
            <div className="cart">
                <section className="list"></section>

                <button className="pay" onClick={() => setShowPay(true)}>
                    <ClipboardCheck />
                </button>
            </div>

            <Modal
                show={showPay}
                onShow={setShowPay}
                title="Pay for meals?"
                loading={loadingPay}
                onConfirm={submitPay}>
                <span>Total expense: ${amount.toFixed(2).padStart(5, "0")}</span>
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

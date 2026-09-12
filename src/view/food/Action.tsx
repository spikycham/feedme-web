import { useCartStore } from "@/store/cart.store";
import { message } from "@/component/message/Message";

interface Props {
    food_id: string;
    name: string;
    price: number;
}

export default function OrderAction(props: Props) {
    const cartFoods = useCartStore((state) => state.foods);
    const addCart = useCartStore((state) => state.add);
    const removeCart = useCartStore((state) => state.remove);

    return (
        <div className="action">
            <p className="price">${props.price.toFixed(2)}</p>
            <div onClick={(e) => e.stopPropagation()}>
                <div className="buttons">
                    <button
                        className="rmv"
                        onClick={() => {
                            removeCart(props.food_id, props.price);
                            message.success(`Removed ${props.name}`);
                        }}>
                        -
                    </button>
                    <span>{(cartFoods.get(props.food_id) ?? 0).toString().padStart(2, "0")}</span>
                    <button
                        className="add"
                        onClick={() => {
                            addCart(props.food_id, props.price);
                            message.success(`Added ${props.name} to cart`);
                        }}>
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

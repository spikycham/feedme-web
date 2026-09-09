import Loading from "@/component/loading/Loading";
import { message } from "@/component/message/Message";
import fetchFoodList from "@/network/food-list.api";
import { NetworkError } from "@/network/network";
import { useFoodsStore } from "@/store/food.store";
import { useEffect, useState } from "react";

export default function FoodPage() {
    const foods = useFoodsStore((state) => state.foods);
    const loadedFoods = foods.length !== 0;
    const setFoods = useFoodsStore((state) => state.setFoods);

    const [loading, setLoading] = useState(!loadedFoods);

    const init = async () => {
        if (loadedFoods) return;

        try {
            const data = await fetchFoodList();
            setFoods(data.list);
        } catch (err) {
            if (err instanceof NetworkError) {
                message.failed("Faield to request foods data");
                return;
            }
            message.internal();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : foods.length === 0 ? (
                <NoFood />
            ) : (
                <div className="food-list">
                    <ul>
                        {foods.map((food) => (
                            <li key={food.food_id}>{food.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

function NoFood() {
    return <div>No Food Found</div>;
}

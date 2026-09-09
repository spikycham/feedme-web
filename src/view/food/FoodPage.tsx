import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFoodsStore } from "@/store/food.store";

import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";

import { NetworkError } from "@/network/network";
import fetchFoodList from "@/network/food-list.api";

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

    const navigate = useNavigate();

    return (
        <>
            {loading ? (
                <Loading />
            ) : foods.length === 0 ? (
                <NoFood />
            ) : (
                <ul className="food-list">
                    {foods.map((food) => {
                        console.log(food);
                        return (
                            <li key={food.food_id} onClick={() => navigate("/layout/food/detail/" + food.food_id)}>
                                {food.name}
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}

function NoFood() {
    return <div>No Food Found</div>;
}

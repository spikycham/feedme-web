import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFoodsStore } from "@/store/food.store";

import { PlusSquare, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";

import { NetworkError } from "@/network/network";
import fetchFoodList from "@/network/food-list.api";
import Permission from "@/util/permission";
import { useUserStore } from "@/store/user.store";
import { useCartStore } from "@/store/cart.store";

export default function FoodPage() {
    const foods = useFoodsStore((state) => state.foods);
    const loadedFoods = foods.length !== 0;
    const setFoods = useFoodsStore((state) => state.setFoods);

    const [loading, setLoading] = useState(!loadedFoods);

    // Search and filter.
    const [search, setSearch] = useState("");
    // TODO: filter foods by category.
    // TODO: but i guess i can just display the choices instead of open a new modal or something...
    // const [filter, setFilter] = useState(-1);
    const filteredFoods = foods.filter((food) =>
        food.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );

    useEffect(() => {
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

        init();
    }, [loadedFoods, setFoods]);

    const navigate = useNavigate();

    const user = useUserStore((state) => state.user);

    const addCart = useCartStore((state) => state.add);

    return (
        <>
            {loading ? (
                <Loading />
            ) : foods.length === 0 ? (
                <NoFood />
            ) : (
                <main className="food-list">
                    <h1>
                        <span>
                            Get Your <strong>Best</strong>
                        </span>
                        <span>
                            <strong>Food</strong> Around You
                        </span>
                    </h1>

                    <div className="search">
                        <label htmlFor="food-search">
                            <Search />
                        </label>
                        <input
                            id="food-search"
                            placeholder="Search your favorite food"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="filter">
                            <SlidersHorizontal />
                        </div>
                    </div>

                    <ul>
                        {filteredFoods.map((food) => {
                            return (
                                <li
                                    key={food.food_id}
                                    onClick={() => navigate("/layout/food/detail/" + food.food_id)}>
                                    <div className="photo">
                                        {food.image_uris[0] && <img src={food.image_uris[0]} />}
                                    </div>
                                    <div className="name">
                                        <h3>{food.name}</h3>
                                        <p>
                                            ${food.prize.toFixed(2)} | {food.sold_count} Sold
                                        </p>
                                    </div>

                                    {Permission.IsCustomer(user.role) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addCart(food.food_id, food.prize);
                                                message.success(`Add ${food.name} to cart`);
                                            }}>
                                            <div className="hl"></div>
                                            <div className="vl"></div>
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </main>
            )}
        </>
    );
}

function NoFood() {
    return <div>No Food Found</div>;
}

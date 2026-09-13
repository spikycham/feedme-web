import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "@/store/user.store";
import { useFoodsStore } from "@/store/food.store";

import { Search, Beef, Cake, Hamburger, LeafyGreen, Shrimp, Soup, Wheat, Wine } from "lucide-react";
import { message } from "@/component/message/Message";
import Loading from "@/component/loading/Loading";
import OrderAction from "./Action";

import { NetworkError } from "@/network/network";
import fetchFoodList from "@/network/food-list.api";

import Permission from "@/util/permission";

import "./index.css";

interface FoodCategoryMap {
    key: number;
    name: string;
    Icon: React.ReactNode;
    color: string;
}
const foodCategoryMap: FoodCategoryMap[] = [
    {
        key: 0,
        name: "Staple Food",
        Icon: <Wheat />,
        color: "var(--color-yellow)",
    },
    {
        key: 1,
        name: "Vegetable",
        Icon: <LeafyGreen />,
        color: "var(--color-green)",
    },
    {
        key: 2,
        name: "Meat",
        Icon: <Beef />,
        color: "var(--color-red)",
    },
    {
        key: 3,
        name: "Seafood",
        Icon: <Shrimp />,
        color: "var(--color-blue)",
    },
    {
        key: 4,
        name: "Soup",
        Icon: <Soup />,
        color: "var(--color-maroon)",
    },
    {
        key: 5,
        name: "Dessert",
        Icon: <Cake />,
        color: "var(--color-pink)",
    },
    {
        key: 6,
        name: "Drink",
        Icon: <Wine />,
        color: "var(--color-orange)",
    },
    {
        key: 7,
        name: "Other",
        Icon: <Hamburger />,
        color: "var(--color-fg-gray)",
    },
];

export default function FoodPage() {
    const foods = useFoodsStore((state) => state.foods);
    const loadedFoods = foods.length !== 0;
    const setFoods = useFoodsStore((state) => state.setFoods);

    const [loading, setLoading] = useState(!loadedFoods);

    // Search and filter.
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Set<number>>(new Set());
    const filteredFoods = foods.filter(
        (food) =>
            food.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
            (filter.size === 0 ? true : filter.has(food.category)),
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
                    </div>

                    <div className="filter">
                        <button className="item active" onClick={() => setFilter(new Set())}>
                            Reset
                        </button>

                        {foodCategoryMap.map((item) => (
                            <button
                                key={item.key}
                                className={"item" + (filter.has(item.key) ? " active" : "")}
                                style={{ color: item.color }}
                                onClick={() =>
                                    setFilter((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(item.key)) {
                                            next.delete(item.key);
                                            return next;
                                        }
                                        next.add(item.key);
                                        return next;
                                    })
                                }>
                                <span>{item.Icon}</span>
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>

                    <ul>
                        {filteredFoods.map((food) => {
                            return (
                                <li
                                    key={food.food_id}
                                    onClick={() => navigate("/layout/food/detail/" + food.food_id)}>
                                    <section className="info">
                                        <div className="photo">
                                            {food.image_uris[0] && <img src={food.image_uris[0]} />}
                                        </div>
                                        <div className="text">
                                            <h3>{food.name}</h3>
                                            <p>{food.sold_count} Sold</p>
                                        </div>
                                    </section>

                                    {Permission.IsCustomer(user.role) && (
                                        <OrderAction
                                            food_id={food.food_id}
                                            name={food.name}
                                            price={food.prize}
                                        />
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

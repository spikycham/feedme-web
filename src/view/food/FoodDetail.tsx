import { useParams } from "react-router";
import { useFoodsStore } from "@/store/food.store";

import { Beef, Cake, CircleDollarSign, Hamburger, LeafyGreen, Shrimp, Soup, Star, Wheat, Wine } from "lucide-react";

import Carousel from "@/component/carousel/Carousel";

import "./index.css";

// type FoodCategory = "staple food" | "vegetable" | "meat" | "seafood" | "soup" | "dessert" | "drink" | "other"
const foodCategoryMap = [
    {
        name: "Staple Food",
        Icon: <Wheat />,
    },
    {
        name: "Vegetable",
        Icon: <LeafyGreen />,
    },
    {
        name: "Meat",
        Icon: <Beef />,
    },
    {
        name: "Seafood",
        Icon: <Shrimp />,
    },
    {
        name: "Soup",
        Icon: <Soup />,
    },
    {
        name: "Dessert",
        Icon: <Cake />,
    },
    {
        name: "Drink",
        Icon: <Wine />,
    },
    {
        name: "Other",
        Icon: <Hamburger />,
    },
];

export default function FoodDetail() {
    const { id } = useParams();
    const foods = useFoodsStore((state) => state.foods);
    const food = foods.find((food) => food.food_id === id);

    const getMinBySec = (sec: number) => {
        return (sec / 60).toFixed(0);
    };
    const getDateTimeBySec = (sec: number) => {
        const time = new Date(sec * 1000);

        const y = time.getFullYear();
        const m = time.getMonth().toString().padStart(2, "0");
        const d = time.getDate().toString().padStart(2, "0");

        const h = time.getHours().toString().padStart(2, "0");
        const mi = time.getMinutes().toString().padStart(2, "0");
        const s = time.getSeconds().toString().padStart(2, "0");

        return `${y}-${m}-${d} ${h}:${mi}:${s}`;
    };

    if (!food) return null;

    // TODO: when a comment is added, there should be a notification to the merchant!
    return (
        <div className="food-detail">
            <Carousel srcs={food.image_uris} />

            <h1>{food.name}</h1>
            <p>{food.detail}</p>

            <section>
                <h3>- Attributes</h3>
                <div className="info">
                    <div className="txt">
                        <div>{food.sold_count} Sold</div>
                        <div>{getMinBySec(food.required_time)} Min</div>
                    </div>

                    <div className="ic">
                        <div>
                            <CircleDollarSign />
                            <span>{food.prize}</span>
                        </div>
                        <div>
                            <Star /> {food.rate}
                        </div>
                        <div>
                            {foodCategoryMap[food.category].Icon} {foodCategoryMap[food.category].name}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3>- Ingredients</h3>
                <div className="ig-container">
                    {food.ingredients.map((ig) => (
                        <span className="ingredient" key={ig}>
                            {ig}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h3>- Steps</h3>
                {food.steps.map((step) => (
                    <p key={step.sort}>
                        {step.sort}. {step.detail}
                    </p>
                ))}
            </section>

            <section>
                <h3>- Comments</h3>
                <div className="cm-container">
                    {food.comments.map((c) => (
                        <p>
                            <span>{getDateTimeBySec(c.created_at)}</span>
                            <span>{c.detail}</span>
                        </p>
                    ))}
                </div>
            </section>
        </div>
    );
}

import { useParams } from "react-router";
import { useFoodsStore } from "@/store/food.store";
import Carousel from "@/component/carousel/Carousel";
import "./index.css";

export default function FoodDetail() {
    const { id } = useParams();
    const foods = useFoodsStore((state) => state.foods);
    const food = foods.find((food) => food.food_id === id);

    if (!food) return null;

    return (
        <div className="food-detail">
            <Carousel srcs={food.image_uris} />
            <h1>{food.name}</h1>
            <p>{food.food_id}</p>
            <div>food detail</div>
        </div>
    );
}

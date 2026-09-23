import { useParams } from "react-router";
import { useUserStore } from "@/store/user.store";
import { useFoodsStore } from "@/store/food.store";

import { Star } from "lucide-react";

import Permission from "@/util/permission";
import { getDateTimeBySec } from "@/util/time";

import i18n from "@/i18n";
import "./index.css";
import Title from "@/component/title/Title";

// type FoodCategory = "staple food" | "vegetable" | "meat" | "seafood" | "soup" | "dessert" | "drink" | "other"

export default function FoodDetail() {
    const { id } = useParams();
    const foods = useFoodsStore((state) => state.foods);
    const food = foods.find((food) => food.food_id === id);

    const user = useUserStore((state) => state.user);

    if (!food) return null;

    // TODO: when a comment is added, there should be a notification to the merchant!
    return (
        <>
            <Title title={food.name} hasBack />
            <div className="food-detail">
                {food.image_uris[0] && (
                    <div className="photo">
                        <img src={food.image_uris[0]} />
                    </div>
                )}

                <div className="desc">
                    {/* <span className="min">{getMinBySec(food.required_time)} Min</span> */}
                    <div className="info">
                        <section>
                            <span className="rate">
                                <Star />
                                &nbsp;{food.rate} {i18n.t("rating")}
                            </span>
                            <span className="sold">
                                &nbsp;({food.sold_count} {i18n.t("sold_count")})
                            </span>
                        </section>
                        <section>
                            <span className="price">
                                {i18n.t("money_sign")}
                                {food.prize}
                            </span>
                            <span className="avg">/{i18n.t("average")}</span>
                        </section>
                    </div>
                    <p>{food.detail}</p>
                </div>

                {Permission.IsMerchant(user.role) && (
                    <>
                        <section>
                            <h3>{i18n.t("ingredients")}</h3>
                            <div className="ig-container">
                                {food.ingredients.map((ig) => (
                                    <span className="ingredient" key={ig}>
                                        {ig}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3>{i18n.t("steps")}</h3>
                            {food.steps.map((step) => (
                                <p key={step.sort}>
                                    {step.sort + 1}. {step.detail}
                                </p>
                            ))}
                        </section>
                    </>
                )}

                {food.comments.length > 0 && (
                    <section>
                        <h3>{i18n.t("comments")}</h3>
                        <div className="cm-container">
                            {food.comments.map((c) => (
                                <p key={c.comment_id}>
                                    <span>{getDateTimeBySec(c.created_at)}</span>
                                    <span>{c.detail}</span>
                                </p>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

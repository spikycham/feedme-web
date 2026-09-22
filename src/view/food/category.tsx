import { Beef, Cake, Hamburger, LeafyGreen, Shrimp, Soup, Wheat, Wine } from "lucide-react";
import i18n from "@/i18n";

interface FoodCategoryMap {
    key: number;
    name: string;
    Icon: React.ReactNode;
    color: string;
}
export const foodCategoryMap: FoodCategoryMap[] = [
    {
        key: 0,
        name: i18n.t("staple_food"),
        Icon: <Wheat />,
        color: "var(--color-yellow)",
    },
    {
        key: 1,
        name: i18n.t("vegetable"),
        Icon: <LeafyGreen />,
        color: "var(--color-green)",
    },
    {
        key: 2,
        name: i18n.t("meat"),
        Icon: <Beef />,
        color: "var(--color-red)",
    },
    {
        key: 3,
        name: i18n.t("seafood"),
        Icon: <Shrimp />,
        color: "var(--color-blue)",
    },
    {
        key: 4,
        name: i18n.t("soup"),
        Icon: <Soup />,
        color: "var(--color-maroon)",
    },
    {
        key: 5,
        name: i18n.t("dessert"),
        Icon: <Cake />,
        color: "var(--color-pink)",
    },
    {
        key: 6,
        name: i18n.t("drink"),
        Icon: <Wine />,
        color: "var(--color-orange)",
    },
    {
        key: 7,
        name: i18n.t("other_food"),
        Icon: <Hamburger />,
        color: "var(--color-fg-gray)",
    },
];

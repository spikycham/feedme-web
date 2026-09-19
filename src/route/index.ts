import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";

import Login from "@/view/login/Login";

import Root from "@/layout/Root";
import Layout from "@/layout/Layout";

import OrderPage from "@/view/order/OrderPage";
import CurrentOrder from "@/view/order/CurrentOrder";
import FoodPage from "@/view/food/FoodPage";
import ProfilePage from "@/view/profile/ProfilePage";
import FoodDetail from "@/view/food/FoodDetail";
import CartPage from "@/view/cart/CartPage";

const routes: RouteObject[] = [
    {
        path: "/",
        Component: Root,
        children: [
            {
                path: "/login",
                Component: Login,
            },
            {
                path: "/layout",
                Component: Layout,
                children: [
                    {
                        path: "order",
                        Component: OrderPage,
                    },
                    {
                        path: "service",
                        Component: CurrentOrder,
                    },
                    {
                        path: "food",
                        Component: FoodPage,
                    },
                    {
                        path: "food/detail/:id",
                        Component: FoodDetail,
                    },
                    {
                        path: "cart",
                        Component: CartPage,
                    },
                    {
                        path: "profile",
                        Component: ProfilePage,
                    },
                ],
            },
        ],
    },
];

export const router = createBrowserRouter(routes);

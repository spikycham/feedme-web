import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";

import Login from "@/view/login/Login";

import Root from "@/layout/Root";
import Layout from "@/layout/Layout";

import OrderPage from "@/view/order/OrderPage";
import FoodPage from "@/view/food/FoodPage";
import HistoryPage from "@/view/history/HistoryPage";
import ProfilePage from "@/view/profile/ProfilePage";

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
                        path: "food",
                        Component: FoodPage,
                    },
                    {
                        path: "history",
                        Component: HistoryPage
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

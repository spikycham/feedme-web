import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";

import Login from "@/view/login/Login";

import Layout from "@/layout/Layout";
import Home from "@/view/home/Home";

const routes: RouteObject[] = [
    {
        path: "/login",
        Component: Login,
    },
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: Home
            }
        ]
    },
];

export const router = createBrowserRouter(routes);

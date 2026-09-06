import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";

import Login from "@/view/login/Login";
import Home from "@/view/home/Home";

const routes: RouteObject[] = [
    {
        path: "/",
        Component: Login,
    },
    {
        path: "/home",
        Component: Home,
    },
];

export const router = createBrowserRouter(routes);

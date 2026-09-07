import { RouterProvider } from "react-router";
import { router } from "@/route";

import Cover from "@/view/cover/Cover";
import Message from "@/component/message/Message";

export default function App() {
    return (
        <>
            <Cover />
            <Message />
            <RouterProvider router={router} />
        </>
    );
}

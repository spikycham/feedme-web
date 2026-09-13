import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/route";

import Cover from "@/view/cover/Cover";
import Message from "@/component/message/Message";
import fetchSubscription from "./network/subscription.api";

const VAPID_PUBLIC_KEY =
    "BJE0T6g_aie9OY9ImL3JJexBHZiX-_rjfk1i3jSQH6ppidd1a7FO8ux5wupYAL5jMC8m-_RMnkkmPRTV-59dxQY";
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const base64String = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = atob(base64String);
    const buffer = new ArrayBuffer(rawData.length);
    const output = new Uint8Array(buffer);

    for (let i = 0; i < rawData.length; i++) {
        output[i] = rawData.charCodeAt(i);
    }

    return output;
}

export default function App() {
    useEffect(() => {
        const initNotification = async () => {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                return;
            }

            await navigator.serviceWorker.register("/pwa/sw.js");
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            await fetchSubscription(subscription);
        };

        initNotification();
    }, []);

    return (
        <>
            <Cover />
            <Message />
            <RouterProvider router={router} />
        </>
    );
}

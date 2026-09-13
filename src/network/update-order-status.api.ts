import net from "./network";

interface Request {
    order_id: string;
    status: number;
}

export default async function fetchUpdateOrderStatus(body: Request) {
    return await net.put("/api/order/status", body);
}

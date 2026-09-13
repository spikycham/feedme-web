import net from "./network";

interface Response {
    list: Order[];
}

export default async function fetchOrderList(): Promise<Response> {
    return await net.get("/api/order/list");
}

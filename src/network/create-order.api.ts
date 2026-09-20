import net from "./network";

interface OrderFood {
    food_id: string;
    count: number;
}

export interface RequestCreateOrder {
    amount: number;
    foods: OrderFood[];
}

export default async function fetchCreateOrder(body: RequestCreateOrder) {
    const { foods, amount } = body;

    const data = await net.post<RequestCreateOrder, {}>("api/order", {
        foods,
        amount,
    });
    return data;
}

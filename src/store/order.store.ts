import { create } from "zustand";

interface State {
    orders: Order[];
}

type Action = {
    setOrders: (list: Order[]) => void;
    updateOrderStatus: (id: string, status: OrderStatus) => void;
};

export const useOrdersStore = create<State & Action>()((set) => ({
    orders: [],

    setOrders: (orders) => set({ orders }),
    updateOrderStatus: (id, status) =>
        set((state) => {
            const newState = { ...state };

            const order = newState.orders.find((o) => o.order_id === id);
            if (!order) return state;

            order.status = status;
            order.done_at = Date.now() / 1000;
            return newState;
        }),
}));

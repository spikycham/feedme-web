import { create } from "zustand";

interface State {
    foods: Map<string, number>;
    amount: number;
}

type Action = {
    add: (id: string, unitPrice: number) => void;
    remove: (id: string, unitPrice: number) => void;
    clear: () => void;
};

const INIT_CART_STATE: State = {
    foods: new Map(),
    amount: 0,
};

export const useCartStore = create<State & Action>()((set) => ({
    ...INIT_CART_STATE,

    add: (id, unitPrice) =>
        set((state) => {
            const foods = new Map(state.foods);
            foods.set(id, (foods.get(id) ?? 0) + 1);

            const amount = state.amount + unitPrice;
            return { foods, amount };
        }),
    remove: (id, unitPrice) =>
        set((state) => {
            const foods = new Map(state.foods);
            const curr = foods.get(id);
            if (!curr) return { foods, amount: state.amount };
            foods.set(id, foods.get(id)! - 1);

            const amount = state.amount - unitPrice;
            return { foods, amount };
        }),
    clear: () => {
        return { ...INIT_CART_STATE };
    },
}));

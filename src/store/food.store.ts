import { create } from "zustand";

interface State {
    foods: Food[];
}

type Action = {
    setFoods: (list: Food[]) => void;
}

export const useFoodsStore = create<State & Action>()(set => ({
    foods: [],
    
    setFoods: (foods) => set({ foods }),
}));
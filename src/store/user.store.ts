import { create } from "zustand";

type State = User;

type Action = {
    setUser: (user: State) => void;
    clearUser: () => void;
}

const INITIAL_USER_STORE: State = {
    "account": "",
    "avatar_uri": "",
    "name": "",
    "role": 0,
    "user_id": "",
}

export const useUserStore = create<State & Action>()(set => ({
    ...INITIAL_USER_STORE,
    
    setUser: (user) => set(() => user),
    clearUser: () => set(() => INITIAL_USER_STORE),
}));
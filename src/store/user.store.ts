import { create } from "zustand";

interface State {
    user: User;
}

type Action = {
    setUser: (user: State) => void;
    clearUser: () => void;
}

const INITIAL_USER_STATE: State = {
    user: {
        account: "",
        avatar_uri: "",
        name: "",
        role: 0,
        user_id: "",
    }
}

export const useUserStore = create<State & Action>()(set => ({
    ...INITIAL_USER_STATE,
    
    setUser: (user) => set(() => user),
    clearUser: () => set(() => INITIAL_USER_STATE),
}));
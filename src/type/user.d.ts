interface User {
    account: string;
    avatar_uri: string;
    created_at: number;
    name: string;
    profile_background_uri: string;
    role: number; // 0: customer, 1: merchant
    user_id: string;
}

type UserRole = "customer" | "merchant"

interface Token {
    access_token: string;
    refresh_token: string;
}
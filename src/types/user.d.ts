interface User {
    user_id: string;
    name: string;
    account: string;
    role: number; // 0: customer, 1: merchant
    avatar_uri: string;
    user_id: string;
}

interface Token {
    access_token: string;
    refresh_token: string;
}

interface ResponseLogin {
    token: Token;
    user: User;
}

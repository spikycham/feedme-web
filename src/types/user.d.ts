interface User {
    user_id: string;
    name: string;
    account: string;
    // 0: customer, 1: merchant
    role: number;
    avatar_uri: string;
}

interface Token {
    access_token: string;
    refresh_token: string;
}

interface ResponseLogin {
    token: Token;
    user: User;
}

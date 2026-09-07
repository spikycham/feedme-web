import net from "./network";

export interface Request {
    account: string;
    password: string;
}

export interface Response {
    token: Token;
    user: User;
}

export async function fetchLogin(body: Request): Promise<Response> {
    const { account, password } = body;

    const data = (await net.post<Request, Response>("/api/auth/login", {
        account,
        password,
    })) as Response;
    return data;
}

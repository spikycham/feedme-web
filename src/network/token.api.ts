import { getRefreshToken } from "@/util/token";

interface Request {
    refresh_token: string;
}

interface Tokens {
    access_token: string;
    refresh_token: string;
}

interface Response {
    data: Tokens
}

export async function fetchToken() {
    const body: Request = {
        refresh_token: getRefreshToken()
    }

    // TODO: the base url.
    const resp = await fetch("http://localhost:5000/api/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data: Response = await resp.json();
    return data.data;
}
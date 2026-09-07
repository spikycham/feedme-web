import { getRefreshToken } from "@/util/token";
import { BASE_URL } from "./network";

interface Request {
    refresh_token: string;
}

interface Tokens {
    access_token: string;
    refresh_token: string;
}

interface Response {
    data: Tokens;
}

export async function fetchToken() {
    const body: Request = {
        refresh_token: getRefreshToken(),
    };

    const resp = await fetch(new URL("/api/auth/token", BASE_URL), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data: Response = await resp.json();
    return data.data;
}

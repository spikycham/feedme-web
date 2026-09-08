import { getToken, setRefreshToken, setToken } from "@/util/token";
import { fetchToken } from "./token.api";

interface ResponseStruct<T extends object> {
    data: T;
}

interface InterceptionConfig<T extends object> {
    path: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: T;
    headers?: Headers;
}

export class NetworkError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }
}

class Network {
    base: URL;
    cb: (() => void) | null = null;

    constructor(base: string) {
        this.base = new URL(base);
    }

    private validateStatus(status: number) {
        if (status === 401) return;
        if (status < 200 || status > 299) throw new NetworkError("response error");
    }
    private setDefaultHeaders(headers: Headers): Headers {
        if (!headers.get("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        headers.set("Authorization", "Bearer " + getToken());
        return headers;
    }

    // Intercepte after the request, used for refresh tokens.
    private async intercept<B extends object, R extends object>(
        config: InterceptionConfig<B>,
        status: number,
    ): Promise<R | null> {
        if (status !== 401) return null;

        // Get the new access token and refresh token.
        try {
            const { access_token, refresh_token } = await fetchToken();
            setToken(access_token);
            setRefreshToken(refresh_token);
        } catch {
            this.cb?.();
            return null;
        }

        // Resend the original request again.
        const { path, headers, body } = config;
        headers?.set("Authorization", "Bearer " + getToken());
        switch (config.method) {
            case "GET":
                return await this.get(path, headers);
            case "POST":
                return await this.post<B, R>(path, body as B, headers);
            case "PUT":
                await this.put(path, body as B, headers);
                return null;
            case "PATCH":
                await this.patch(path, body as B, headers);
                return null;
            case "DELETE":
                await this.delete(path, body as B, headers);
                return null;
        }
    }
    public setTokenExpireHandler(cb: () => void) {
        this.cb = cb;
    }

    // Main methods of http requests.
    public async get<T extends object>(path: string, headers?: Headers): Promise<T> {
        const url = new URL(path, this.base);
        headers = this.setDefaultHeaders(headers ?? new Headers());

        const resp = await fetch(url, {
            method: "GET",
            headers,
        });
        this.validateStatus(resp.status);

        const intercepted = await this.intercept(
            {
                path,
                method: "GET",
                headers,
            },
            resp.status,
        );
        if (intercepted !== null) {
            return intercepted as T;
        }

        const data = (await resp.json()) as ResponseStruct<T>;
        return data.data;
    }

    public async post<B extends object, R extends object>(
        path: string,
        body: B,
        headers?: Headers,
    ): Promise<R | null> {
        const url = new URL(path, this.base);
        if (body instanceof FormData) {
            headers = new Headers();
            headers.set("Authorization", "Bearer " + getToken());
        } else {
            headers = this.setDefaultHeaders(headers ?? new Headers());
        }

        const resp = await fetch(url, {
            method: "POST",
            headers,
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
        this.validateStatus(resp.status);

        const intercepted = await this.intercept<B, R>(
            {
                path,
                method: "GET",
                headers,
            },
            resp.status,
        );
        if (intercepted !== null) {
            return intercepted;
        }

        const data = (await resp.json()) as ResponseStruct<R> | null;
        if (!data) return null;
        return data.data;
    }

    public async put<B extends object>(path: string, body: B, headers?: Headers) {
        const url = new URL(path, this.base);
        headers = this.setDefaultHeaders(new Headers());

        const resp = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(body),
        });
        this.validateStatus(resp.status);

        await this.intercept(
            {
                path,
                method: "GET",
                headers,
            },
            resp.status,
        );
    }

    public async patch<B extends object>(path: string, body: B, headers?: Headers) {
        const url = new URL(path, this.base);
        headers = this.setDefaultHeaders(new Headers());

        const resp = await fetch(url, {
            method: "PATCH",
            headers,
            body: JSON.stringify(body),
        });
        this.validateStatus(resp.status);

        await this.intercept(
            {
                path,
                method: "GET",
                headers,
            },
            resp.status,
        );
    }

    public async delete<B extends object>(path: string, body: B, headers?: Headers) {
        const url = new URL(path, this.base);
        headers = this.setDefaultHeaders(new Headers());

        const resp = await fetch(url, {
            method: "DELETE",
            headers,
            body: JSON.stringify(body),
        });
        this.validateStatus(resp.status);

        await this.intercept(
            {
                path,
                method: "GET",
                headers,
            },
            resp.status,
        );
    }
}

export const BASE_URL = "https://food.devcham.xyz";
const net = new Network(BASE_URL);
export default net;

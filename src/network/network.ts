interface ResponseStruct<T extends object> {
    data: T;
}

export class NetworkError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }
}

class Network {
    base: URL;

    constructor(base: string) {
        this.base = new URL(base);
    }

    private validateStatus(status: number) {
        if (status < 200 || status > 299) throw new NetworkError("response error");
    }
    private setDefaultHeaders(headers: Headers): Headers {
        if (!headers.get("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        return headers;
    }

    public async get<T extends object>(path: string, headers?: Headers): Promise<T> {
        const url = new URL(path, this.base);
        this.setDefaultHeaders(headers ?? new Headers());

        const resp = await fetch(url, { 
            method: "GET",
            headers 
        });
        this.validateStatus(resp.status);

        const data = (await resp.json()) as ResponseStruct<T>;
        return data.data;
    }

    // TODO: how about sending a form item like a file?
    public async post<B extends object, R extends object>(
        path: string,
        body: B,
        headers?: Headers,
    ): Promise<R | null> {
        const url = new URL(path, this.base);
        this.setDefaultHeaders(headers ?? new Headers());

        const resp = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        this.validateStatus(resp.status);

        const data = (await resp.json()) as ResponseStruct<R> | null;
        if (!data) return null;
        return data.data;
    }

    public async put<B extends object>(path: string, body: B) {
        const url = new URL(path, this.base);
        const headers = this.setDefaultHeaders(new Headers());

        const resp = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(body),
        });
        this.validateStatus(resp.status);
    }

    public async patch<B extends object>(path: string, body: B) {
        const url = new URL(path, this.base);
        const headers = this.setDefaultHeaders(new Headers());

        const resp = await fetch(url, {
            method: "PATCH",
            headers,
            body: JSON.stringify(body),
        });
        this.validateStatus(resp.status);
    }

    public async delete<B extends object>(path: string, body: B) {
        const url = new URL(path, this.base);
        const headers = this.setDefaultHeaders(new Headers());

        const resp = await fetch(url, {
            method: "DELETE",
            headers,
            body: JSON.stringify(body),
        });
        this.validateStatus(resp.status);
    }
}

const net = new Network("http://localhost:5000");
export default net;

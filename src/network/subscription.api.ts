import net from "./network";

export default async function fetchSubscription<T extends object>(body: T) {
    const data = await net.post<T, {}>("/api/push/subscribe", body);
    return data;
}

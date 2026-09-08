import net from "./network";

export default async function fetchLogout() {
    await net.post<{}, {}>("/api/auth/login", {});
}

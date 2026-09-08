import net from "./network";

export async function fetchLogout() {
    await net.post<{}, {}>("/api/auth/login", {});
}

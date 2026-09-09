import { getRefreshToken } from "@/util/token";
import net from "./network";

interface Request {
    refresh_token: string;
}

export default async function fetchLogout() {
    await net.post<Request, {}>("/api/auth/logout", {
        refresh_token: getRefreshToken()
    });
}

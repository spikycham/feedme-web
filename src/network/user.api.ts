import { getToken } from "@/util/token";
import net from "./network";

type Response = User;

export async function fetchUserMe(): Promise<Response> {
    const headers = new Headers();
    headers.set("Authorization", "Bearer " + getToken());

    return await net.get<Response>("/api/user/me", headers);
}

import net from "./network";

type Response = User;

export default async function fetchUserMe(): Promise<Response> {
    return await net.get<Response>("/api/user/me");
}

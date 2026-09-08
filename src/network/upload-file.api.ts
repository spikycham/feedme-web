import net from "./network";

interface Response {
    url: string;
}

export default async function fetchUploadFile(body: FormData): Promise<Response> {
    return (await net.post<FormData, Response>("/api/file", body)) as Response;
}

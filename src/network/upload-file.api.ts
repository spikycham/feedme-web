interface Response {
    url: string
}

// TODO: implement post to send formdata
export default async function fetchUploadFile(body: FormData): Response {
    return await net.post()
}
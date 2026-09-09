import net from "./network"

interface Response{
    list: Food[]
}

export default async function fetchFoodList(): Promise<Response> {
    return await net.get("/api/food/list");
}
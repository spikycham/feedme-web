import net from "./network";

interface CreateFoodBasicProps {
    name: string;
    detail: string;
    prize: number;
    required_time: number;
    category: number;
}

type RequestCreateFood = CreateFoodBasicProps & {
    image_uris?: string[];
    ingredients?: string[];
    steps?: FoodStep[];
}

export default async function fetchCreateFood(body: RequestCreateFood) {
    const data = await net.post<RequestCreateFood, {}>("api/food", body);
    return data;
}


export class CreateFoodBody {
    body: RequestCreateFood
    constructor(opts: CreateFoodBasicProps) {
        const { name, detail, prize, required_time, category } = opts;
        this.body = { name, detail, prize, required_time, category };
    }

    public addImg(imgUri: string) {
        this.body.image_uris = [imgUri];
    }
    public addIngs(ings: string[]) {
        this.body.ingredients = ings;
    }
    public addSteps(steps: FoodStep[]) {
        this.body.steps = steps;
    }
}
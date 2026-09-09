interface Food {
    food_id: string;
    name: string;
    detail: string;
    prize: number;
    rate: number // [0.0, 5.0]
    required_time: number;
    sold_count: number;
    image_uris: string[];
    ingredients: string[];
    category: number;
    created_at: number;
    deleted_at: number;
    steps: [];
    comments: [];
}

interface FoodStep {
    sort: number;
    detail: string;
}
interface FoodComment {
    commend_id: string;
    detail: string;
    created_at: string;
    deleted_at: string;
}

type FoodCategory = "staple food" | "vegetable" | "meat" | "seafood" | "soup" | "dessert" | "drink" | "other"
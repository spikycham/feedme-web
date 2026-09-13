interface OrderFood {
    food_id: string;
    count: number;
}

interface Order {
    order_id: string;
    status: OrderStatus;
    amount: number;
    created_at: number;
    done_at: number;
    comment: string;
    commented_at: number;
    comment_deleted_at: number;
    foods: OrderFood[];
}

// Status: pending, rejected, done.
type OrderStatus = 0 | 1 | 2;

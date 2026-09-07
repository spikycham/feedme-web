import { useUserStore } from "@/store/user.store";

export default function Home() {
    const name = useUserStore((state) => state.name);
    const id = useUserStore((state) => state.user_id);

    return (
        <>
            <div>Home</div>
            <div>Hello, {name}!</div>
            <div>User ID: {id}.</div>
        </>
    );
}

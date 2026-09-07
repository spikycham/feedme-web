import { useUserStore } from "@/store/user.store";

export default function Home() {
    const name = useUserStore((state) => state.name);

    return (
        <>
            <div>Home</div>
            <div>Hello, {name}!</div>
        </>
    );
}

import { useUserStore } from "@/store/user.store";

export default function ProfilePage() {
    const user = useUserStore((state) => state.user);

    return (
        <>
            <div>{user.account}</div>
            <div></div>
        </>
    );
}

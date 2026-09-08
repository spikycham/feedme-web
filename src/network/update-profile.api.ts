import net from "./network";

interface Request {
    new_avatar_uri?: string;
    new_username?: string;
    new_password?: string;
    new_profile_background_uri?: string;
}

export class MissBodyError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }
}

export default async function fetchUpdateProfile(body: Request) {
    if (!body.new_avatar_uri&& !body.new_username && !body.new_profile_background_uri  && !body.new_password) {
        throw new MissBodyError("failed to update user profile")
    }
    return await net.patch("/api/user/profile", body);
}
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change_this"
);

export async function getAuthUser() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) return null;

        const { payload } = await jwtVerify(token, JWT_SECRET);

        return {
            id: payload.userId as string,
            email: payload.email as string,
            name: payload.name as string,
            customId: payload.customId as string,
        };
    } catch (error: any) {
        console.error("Auth error:", error.message);
        return null;
    }
}

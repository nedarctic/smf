"use server"

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getAuthTokens() {
    const username = process.env.DB_USER;
    const password = process.env.DB_PASS;

    const res = await fetch(`${process.env.DJANGO_API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    if (!res.ok) {
        throw new Error("Failed to authenticate.");
    }

    const data = await res.json();

    return data;
}

export async function setTokens(access: string, refresh: string) {
    "use server"
    
    const cookieStore = await cookies();

    cookieStore.set("access_token", access, {
        httpOnly: true,
        secure: true,
        path: "/",
    });

    cookieStore.set("refresh_token", refresh, {
        httpOnly: true,
        secure: true,
        path: "/",
    });
}

export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();

    let accessToken = cookieStore.get("access_token")?.value;
    let refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken || !refreshToken) {
        const tokens = await getAuthTokens();

        setTokens(tokens.access, tokens.refresh);

        accessToken = tokens.access;
        refreshToken = tokens.refresh;
        
    }

    if (!accessToken) return null;

    const isValid = await isTokenValid(accessToken);

    if (isValid) return accessToken;

    if (!refreshToken) return null;

    const refreshed = await refreshAccessToken(refreshToken);

    if (!refreshed) return null;

    const newAccessToken = refreshed.access;

    cookieStore.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
    });

    return newAccessToken;
}

export async function isTokenValid(token: string): Promise<boolean> {
    try {
        const decoded: any = jwt.decode(token);
        if (!decoded?.exp) return false;

        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch {
        return false;
    }
}

export async function refreshAccessToken(refreshToken: string) {
    try {
        const res = await fetch(
            `${process.env.DJANGO_API_URL}/api/auth/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
            }
        );

        if (!res.ok) return null;

        return await res.json();
    } catch {
        return null;
    }
}
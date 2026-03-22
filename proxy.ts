import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function Proxy(
    req: NextRequest
) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET!
    });

    if (pathname.startsWith("/dashboard") && (!token || token.type !== "admin")) {
        const signInUrl = new URL("/login", req.url);
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next();
}
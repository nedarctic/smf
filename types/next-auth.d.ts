import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        
        incidentId?: string;
        incidentIdDisplay?: string;
        user: {
            id: string;
            type: "admin" | "handler" | "incident";
        } & DefaultSession[user];
    }

    interface User {
        id: string;
        type: "handler" | "admin" | "incident";
        incidentId?: string;
        incidentIdDisplay?: string;
    }
}
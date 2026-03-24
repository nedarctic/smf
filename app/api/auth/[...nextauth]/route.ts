import NextAuth, { type AuthOptions } from "next-auth";
import bcrypt from 'bcrypt';
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from 'argon2';
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || user.role !== "Admin") return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.password!);
                
                if (!passwordMatch) return null;

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                    type: "admin",
                };
            },
        }),
        CredentialsProvider({
            id: "handler-access",
            name: "Handler Access",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || user.role !== "Handler") return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.password!);

                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    type: "handler",
                };
            },
        }),
        CredentialsProvider({
            id: "incident-access",
            name: "Incident Access",
            credentials: {
                incidentId: { label: "Incident ID", type: "text" },
                secretCode: { label: "Secret Code", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.incidentId || !credentials.secretCode) return null;
                
                // 1. find incident
                const incident = await prisma.incident.findUnique({
                    where: { incidentIdDisplay: credentials.incidentId }
                })

                if (!incident) return null;

                // 2. verify secret code

                try {
                    const isValid = await argon2.verify(
                        incident.secretCodeHash,
                        credentials.secretCode.trim() + process.env.INCIDENT_SECRET_PEPPER!
                    );

                    if (!isValid) {
                        return null;
                    }
                } catch (err) {
                    console.error("Error:", err);
                    return null;
                }

                // 3. return pseudo-user
                return {
                    id: incident.id,
                    incidentId: incident.id,
                    incidentIdDisplay: incident.incidentIdDisplay,
                    type: "incident"
                };
            },
        }),
    ],
    callbacks: {

        async jwt({ user, token }) {

            if (user && user.type === "admin") {
                token.id = user.id;
                token.type = user.type;
            }

            if (user && user.type === "handler") {
                token.id = user.id;
                token.type = user.type;
            }

            if (user && user.type === "incident") {
                token.id = user.id;
                token.type = user.type;
                token.incidentId = user.incidentId;
                token.incidentIdDisplay = user.incidentIdDisplay;
            }


            return token;
        },

        async session({ session, token }) {

            if (token && token.type == 'admin') {
                session.user.id = token.id;
                session.user.type = 'admin';
            }

            if (token && token.type == 'handler') {
                session.user.id = token.id;
                session.user.type = 'handler';
            }

            if (token && token.type == 'incident') {
                session.user.type = 'incident';
                session.incidentId = (token as any).incidentId;
                session.incidentIdDisplay = (token as any).incidentIdDisplay;
            }

            return session;
        }
    },
    session: {
        strategy: "jwt",
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
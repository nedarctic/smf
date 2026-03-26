"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { z } from 'zod';

export const strongPasswordSchema = z
    .string()
    .min(8, "Password must be longer than 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character")

const formSchema = z
    .object({
        password: strongPasswordSchema,
        confirmPassword: z.string(),
    })
    .refine(
        data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }
    )

export default function AcceptInvitePage() {

    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string>("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")

        const result = formSchema.safeParse({ password, confirmPassword });

        if (!result.success) {
            const firstError =
                result.error.issues[0]?.message || "Invalid input";
            setError(firstError);
            return;
        }

        const res = await fetch("/api/handler/activate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        if (res.ok) {
            router.push("/handler/invite/accept/complete");
        } else {
            alert("Activation failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center 
        w-full min-h-screen gap-4 py-16">
            <p className="text-xl font-bold">SemaFacts Account Activation</p>
            <form className="flex flex-col gap-6 lg:w-1/3 w-full" onSubmit={handleSubmit}>
                <h1>Set password to activate your SemaFacts account.</h1>
                <FieldGroup>
                    <Field>
                        <div className="flex items-center">
                            <FieldLabel htmlFor="password">New Password</FieldLabel>

                        </div>
                        <Input onChange={e => setPassword(e.target.value)}
                            id="password" type="password" required />
                    </Field>
                    <Field>
                        <div className="flex items-center">
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>

                        </div>
                        <Input onChange={e => setConfirmPassword(e.target.value)}
                            id="confirmPassword" type="password" required />
                    </Field>
                </FieldGroup>
                {error && (<p className="text-sm font-normal 
                text-red-600">{error}</p>)}
                <Button className="w-full" type="submit">Activate</Button>
            </form>
        </div>
    );
}
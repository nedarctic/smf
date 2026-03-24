"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { sendPasswordResetLink } from "@/actions/team.actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            try {
                await sendPasswordResetLink(email);
                setOpen(true);
            } catch (err: any) {
                setOpen(true);
                setError(err);
            }
        });
        
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={pending}>
                            {pending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Success Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Check your email</DialogTitle>
                        <DialogDescription>
                            If an account with that email exists, you will receive a password
                            reset link in your inbox shortly.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button onClick={() => {
                            router.push("/");
                            setOpen(false)
                        }} className="w-full">
                            Okay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

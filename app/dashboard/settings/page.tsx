"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";
import { updateSettings } from "@/actions/settings.actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function SettingsPage() {
    const [pending, startTransition] = useTransition();

    // Company
    const [companyName, setCompanyName] = useState("");

    // Account
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Password
    const [password, setPassword] = useState("");

    // SLA
    const [slaDays, setSlaDays] = useState<number>(7);

    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState<string>("");

    const handleSave = () => {
        startTransition(async () => {
            try {
                const res = await updateSettings({
                    companyName,
                    name,
                    email,
                    password,
                    slaDays,
                });

                if (res?.error) {
                    console.error(res.error);
                    return;
                }

                setSuccess("Settings updated successfully.");
                setOpen(true);
            } catch (err) {
                console.error(err);
            }
        });
    };

    return (
        <div className="min-h-screen flex justify-center py-10">
            <div className="flex flex-col gap-6 p-6 w-11/12 lg:w-2/3">

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Success</DialogTitle>
                            <DialogDescription>
                                {success}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end">
                            <Button onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                
                {/* Company Settings */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Company</CardTitle>
                        <CardDescription>
                            Manage your organization details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Input
                            placeholder="Company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Update your personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Input
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>
                            Manage your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* SLA Settings */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Incident SLA</CardTitle>
                        <CardDescription>
                            Set default resolution time for incidents
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Input
                            type="number"
                            value={slaDays}
                            onChange={(e) => setSlaDays(Number(e.target.value))}
                        />
                        <p className="text-sm text-muted-foreground">
                            Incidents will be expected to be resolved within this number of days.
                        </p>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={pending}>
                        {pending ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
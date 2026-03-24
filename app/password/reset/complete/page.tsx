"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function InviteCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">
            Reset Password Successful
          </CardTitle>
          <CardDescription>
            Your password has been successfully reset.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            You can now sign in and start using the platform. You’ll be redirected automatically in a few seconds.
          </p>

          <Button
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function TrackIncidentPage() {
  const [incidentId, setIncidentId] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("incident-access", {
      incidentId,
      secretCode,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid Incident ID or Secret Code.");
      setLoading(false);
      return;
    }

    window.location.href = "track/incident";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40 px-6 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Track an Incident
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your Incident ID and Secret Code to securely access your report. You can view updates, check status, and communicate with investigators.
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Access your report</CardTitle>
            <CardDescription>
              Your details are required to view the incident status.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Incident ID */}
              <div className="space-y-2">
                <Label htmlFor="incidentId">Incident ID</Label>
                <Input
                  id="incidentId"
                  placeholder="e.g. INC-AB3K9Q"
                  value={incidentId}
                  onChange={(e) => setIncidentId(e.target.value)}
                  required
                />
              </div>

              {/* Secret Code */}
              <div className="space-y-2">
                <Label htmlFor="secretCode">Secret Code</Label>
                <Input
                  id="secretCode"
                  type="password"
                  placeholder="Enter your secret code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? "Verifying..." : "Track incident"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Helper text */}
        <p className="text-center text-xs text-muted-foreground">
          Lost your secret code? For security reasons, it cannot be recovered.
        </p>
      </div>
    </main>
  );
}
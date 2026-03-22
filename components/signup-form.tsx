"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { useTransition } from "react";
import { useRouter } from "next/navigation"
import { inviteUser } from "@/actions/team.actions"
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>();

  const isFormValid = name.trim() !== "" && email.trim() !== "";

  const addNewMemberHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        await inviteUser({ name, email });

        setSuccess("Invite successfully sent.");
        setName("");
        setEmail("");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error occurred");
        }
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Add a new team member</CardTitle>
          <CardDescription>
            Enter the new team member's email below to send them an invite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addNewMemberHandler}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value.trim())}
                  id="name" type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Button disabled={!isFormValid || pending} type="submit">
                  {pending ? "Sending..." : "Send invite"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

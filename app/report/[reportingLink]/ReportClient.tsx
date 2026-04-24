"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Category = {
  id: string;
  createdAt: Date;
  companyId: string;
  categoryName: string;
};

export default function ReportClient({
  reportingPageLink,
  companyId,
  title,
  introContent,
  policyUrl,
  reportingPageUrl,
  categories,
  logoUrl,
}: {
  reportingPageLink?: string;
  companyId: string;
  title: string | null;
  introContent: string | null;
  policyUrl: string | null;
  reportingPageUrl: string | null;
  categories?: Category[];
  logoUrl: string | null;
}) {
  return (
    <main className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        {logoUrl && (
          <div className="flex justify-center">
            <Image
              src={logoUrl}
              width={100}
              height={100}
              priority
              unoptimized
              alt="Company logo"
              className="h-12 md:h-16 object-contain"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">
          {title || "Reporting Portal"}
        </h1>

        <p className="mt-6 max-w-2xl text-muted-foreground text-md leading-relaxed">
          You can report concerns confidentially or anonymously. All reports are handled independently by Semafacts. We do not tolerate retaliation against anyone who raises a concern in good faith.

        </p>

        <p className="mt-4 max-w-xl text-muted-foreground text-sm md:text-base">
          Reports can be submitted anonymously and are handled by authorized
          investigators only.
        </p>

        {policyUrl && (
          <a
            href={policyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 text-sm underline text-primary"
          >
            View reporting policy
          </a>
        )}
      </section>

      {/* Action Cards */}
      <section className="flex items-center justify-center w-full px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          {/* Submit Report */}
          <Card className="flex flex-col justify-between min-h-[320px]">
            <CardHeader>
              <CardTitle>Submit a Report</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Report incidents such as corruption, harassment, abuse of power,
                safety violations, or unethical conduct.
              </p>

              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Anonymous reporting supported</li>
                <li>No login required</li>
                <li>Secure and encrypted submission</li>
              </ul>

              <Button asChild className="w-full mt-6">
                <Link
                  href={`/report/${reportingPageLink}/${companyId}`}
                >
                  Start a Report
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Track Report */}
          <Card className="flex flex-col justify-between min-h-[320px]">
            <CardHeader>
              <CardTitle>Track an Existing Report</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you’ve already submitted a report, you can check its status
                or communicate securely with investigators.
              </p>

              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Use your report reference code</li>
                <li>View updates and responses</li>
                <li>Maintain anonymity</li>
              </ul>

              <Button asChild variant="secondary" className="w-full mt-6">
                <Link href={`/report/${reportingPageLink}/track`}>
                  Track a Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-6 py-24 bg-muted/40">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-light">
            How Reporting Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Submit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Provide details about the incident. You may attach evidence and
                  choose to remain anonymous.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Authorized investigators review the report securely and may ask
                  follow-up questions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Appropriate action is taken based on findings, while protecting
                  the reporter’s identity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="w-full px-6 py-16 border-t">
        <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">
          This platform is designed to protect whistleblowers, ensure fairness,
          and promote accountability. Retaliation against reporters is strictly
          prohibited.
        </p>
      </section>
    </main>
  );
}
import AcceptInvitePage from "./AcceptInvitePage";
import { Suspense } from "react";
import { PasswordResetSkeleton } from "@/components/skeletons/PasswordResetSkeleton";

export default async function PasswordResetPage () {
    return (
        <Suspense fallback={PasswordResetSkeleton()}>
            <AcceptInvitePage />
        </Suspense>
    );
}
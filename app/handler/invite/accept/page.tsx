import { Suspense } from "react";
import AcceptInviteClient from "./AcceptInvitePage"
import AccountActivationSkeleton from "@/components/skeletons/AccountActivationSkeleton";

export default function Page() {
  return (
    <Suspense fallback={AccountActivationSkeleton()}>
      <AcceptInviteClient />
    </Suspense>
  );
}
import { Suspense } from "react";
import AcceptInviteClient from "./AcceptInvitePage"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInviteClient />
    </Suspense>
  );
}
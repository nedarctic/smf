import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import { getCompanyId } from "@/lib/helpers"

export default async function CreateMemberPage() {

  const companyId = await getCompanyId()
  .then(res => res.data!)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 self-center font-medium">
        </Link>
        <SignupForm />
      </div>
    </div>
  )
}

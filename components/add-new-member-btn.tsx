"use client"

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export function AddNewMemberBtn() {
    const router = useRouter();

    return (
        <Button variant={"secondary"} 
        onClick={() => router.push("/dashboard/team/create")}
        >Add new member<PlusIcon className="ml-2" size={18} />
        </Button>
    )
}
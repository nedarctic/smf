import { getCompanyId, getPaginatedHandlers } from "@/lib/helpers";
import { AppBreadcrumb } from "@/components/breadcrumb";
import { SearchHandlersInput } from "@/components/search-handlers-input";
import { TablePagination } from "@/components/table-pagination";
import { HandlersTable } from "@/components/handlers-table";
import { AddNewMemberBtn } from "@/components/add-new-member-btn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function IncidentsPage({ searchParams }: {
    searchParams:
    Promise<{
        query: string;
        sort: "name" | "date";
        page: string;
    }>
}) {

    const session = await getServerSession(authOptions);
    const companyId = await getCompanyId().then(res => res.data!)
    console.log("company id inside team page:", companyId);

    const { query, sort } = await searchParams;
    const page = (await searchParams).page ? (await searchParams).page : "1";

    const { data, total, totalPages } = await
        getPaginatedHandlers({ query, sort, page: parseInt(page), pageSize: 10 });

    return (
        <div className="flex flex-col items-center 
        justify-center min-h-screen w-full px-10 py-16">
            <div className="flex flex-col items-start 
            gap-8 w-11/12">
                <div className="flex items-center justify-between w-full">
                    <AppBreadcrumb
                        items={[
                            { label: "Home", href: "/dashboard" },
                            { label: "Team", href: "/dashboard/team" },
                        ]}
                    />
                    <AddNewMemberBtn />

                </div>
                <SearchHandlersInput />
                <HandlersTable handlers={data} />
                <TablePagination totalPages={totalPages} />
            </div>
        </div>
    )
}
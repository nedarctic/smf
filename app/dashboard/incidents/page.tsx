import { IncidentsTable } from "@/components/incidents-table"
import { getPaginatedIncidents } from "@/lib/helpers";
import { AppBreadcrumb } from "@/components/breadcrumb";
import { SearchInput } from "@/components/search-input";
import { TablePagination } from "@/components/table-pagination";

export default async function IncidentsPage({ searchParams }: {
    searchParams:
    Promise<{
        query: string;
        sort: "category" | "date" | "unassigned";
        page: string;
    }>
}) {

    const { query, sort } = await searchParams;
    const page = (await searchParams).page ? (await searchParams).page : "1";

    const { data, total, totalPages } = await 
    getPaginatedIncidents({ query, sort, page: parseInt(page), pageSize: 10 });

    return (
        <div className="flex flex-col items-center 
        justify-center min-h-screen w-full px-10 py-16">
            <div className="flex flex-col items-start 
            gap-8 w-4/5">
                <AppBreadcrumb
                    items={[
                        { label: "Home", href: "/dashboard" },
                        { label: "Incidents", href: "/dashboard/incidents" },
                    ]}
                />
                <SearchInput />
                <IncidentsTable incidents={data} />
                <TablePagination totalPages={totalPages} />
            </div>
        </div>
    )
}
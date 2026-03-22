import { AppBreadcrumb } from "@/components/breadcrumb";
import { getUserById, getIncidentsByHandler } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChangeUserRoleDialog } from "@/components/change-user-role-dialogue";
import { DeactivateUserDialog } from "@/components/deactivate-user-dialogue";
import Link from "next/link";
import { ReinviteHandler } from "@/components/send-reinvite-dialogue";

export default async function ({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;

  const user = await getUserById(memberId);
  const incidents = await getIncidentsByHandler(memberId);

  if (!user) {
    return <p className="p-10">User not found</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* Breadcrumb */}
      <AppBreadcrumb
        items={[
          { label: "Home", href: "/dashboard" },
          { label: "Team", href: "/dashboard/team" },
          { label: "Team Member" },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            {user.name || "Unnamed User"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{user.role}</Badge>
          <Badge variant="secondary">{user.status}</Badge>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* User details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 text-sm">

              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{user.name || "-"}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">{user.role}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium">{user.status}</p>
              </div>

              <div className="col-span-2">
                <p className="text-muted-foreground">Joined</p>
                <p className="font-medium">
                  {user.createdAt.toLocaleString()}
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Assigned incidents */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Incidents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">

              {incidents.length === 0 ? (
                <p className="text-muted-foreground">
                  No incidents assigned
                </p>
              ) : (
                incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <Link href={`/dashboard/incidents/${incident.id}`} className="flex items-center justify-between w-full">
                    <div>
                      <p className="font-medium">
                        {incident.incidentIdDisplay}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {incident.category}
                      </p>
                    </div>

                    <Badge variant="outline">
                      {incident.status}
                    </Badge>
                    </Link>
                  </div>
                ))
              )}

            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">

              <ChangeUserRoleDialog user={user} />

              {user.status === "Inactive" && <ReinviteHandler user={user} />}

              <DeactivateUserDialog userId={user.id} />

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
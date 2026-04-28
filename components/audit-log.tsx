"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { FileText } from "lucide-react";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  description?: string | null;
  createdAt: Date;
  user?: { name?: string | null } | null;
  incident?: { incidentIdDisplay?: string | null } | null;
};

export function AuditLog({ logs }: { logs: AuditLog[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Log</CardTitle>
      </CardHeader>

      <CardContent>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm font-medium">No activity yet</p>
            <p className="text-xs">
              Actions in the system will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={log.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{log.action}</Badge>
                        <Badge variant="outline">{log.entityType}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {log.description}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {log.user?.name ?? "System"}
                        {log.incident?.incidentIdDisplay
                          ? ` • Incident ${log.incident.incidentIdDisplay}`
                          : ""}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {index !== logs.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
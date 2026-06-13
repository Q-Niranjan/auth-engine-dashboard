"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Permission, Role } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import {
    ShieldCheck,
    Plus,
    Loader2,
    ChevronRight,
    Info,
    Shield
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TenantRolesPage() {
    const { activeTenantId } = useAuthStore();

    const { data: roles, isLoading } = useQuery<Role[]>({
        queryKey: ["tenantRoles", activeTenantId],
        queryFn: async () => {
            const { data } = await apiClient.get<Role[]>(`/tenants/${activeTenantId}/roles`);
            return data;
        },
        enabled: !!activeTenantId,
    });

    if (!activeTenantId) return <div className="p-8 text-center text-muted-foreground">Select an organization first.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organization Roles</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage permissions for members within this organization.
                    </p>
                </div>
                <Button className="rounded-xl shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Create Role
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="md:col-span-3 flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    roles?.map((role) => (
                        <Card key={role.id} className="shadow-sm border-muted hover:border-primary/20 transition-all group overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-primary/5 text-primary border-primary/10">
                                        {role.name}
                                    </Badge>
                                    <Shield className="h-3 w-3 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <CardTitle className="text-lg mt-2 capitalize">{role.name}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2 min-h-[32px]">
                                    {role.description || `Standard permissions for ${role.name}s in this tenant.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Scopes
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions?.length > 0 ? (
                                            role.permissions.slice(0, 4).map((p: Permission) => (
                                                <Badge key={p.id} variant="secondary" className="text-[9px] px-1.5 py-0 font-mono">
                                                    {p.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground italic">No specific scopes defined.</span>
                                        )}
                                        {role.permissions?.length > 4 && (
                                            <Badge variant="ghost" className="text-[9px] px-1.5 py-0">
                                                +{role.permissions.length - 4} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <div className="px-6 py-3 bg-muted/30 border-t border-muted flex justify-between items-center text-[10px] text-muted-foreground mt-auto">
                                <span className="font-mono">ID: {role.id.slice(0, 8)}</span>
                                <Button variant="ghost" size="sm" className="h-7 text-[10px] px-3 rounded-lg hover:bg-background">
                                    Settings <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <div className="p-4 bg-muted/40 border border-muted rounded-2xl flex gap-4">
                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold">Role Propagation</p>
                    <p className="text-xs text-muted-foreground">
                        Permissions granted via these roles apply only to resources owned by this organization.
                        Users can have different roles across different organizations they belong to.
                    </p>
                </div>
            </div>
        </div>
    );
}

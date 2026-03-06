"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
    ShieldAlert,
    Plus,
    Trash2,
    ShieldCheck,
    Loader2,
    Lock,
    ChevronRight,
    Info
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

export default function PlatformRolesPage() {
    const queryClient = useQueryClient();
    const [newRole, setNewRole] = useState({ name: "", description: "" });

    // 1. Fetch Roles
    const { data: roles, isLoading } = useQuery({
        queryKey: ["globalRoles"],
        queryFn: async () => {
            const { data } = await apiClient.get("/platform/roles");
            return data;
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Roles</h1>
                    <p className="text-muted-foreground mt-1">
                        Define global permissions and administrative roles.
                    </p>
                </div>
                <Button className="rounded-xl">
                    <Plus className="mr-2 h-4 w-4" /> Create Role
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="md:col-span-3 flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    roles?.map((role: any) => (
                        <Card key={role.id} className="shadow-sm border-muted hover:border-primary/20 transition-all group">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-primary/5 text-primary border-primary/10">
                                        {role.name}
                                    </Badge>
                                    <Lock className="h-3 w-3 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <CardTitle className="text-lg mt-2">{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2 min-h-[32px]">
                                    {role.description || "No description provided for this system role."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Permissions
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions?.slice(0, 5).map((p: string) => (
                                            <Badge key={p} variant="secondary" className="text-[9px] px-1.5 py-0">
                                                {p}
                                            </Badge>
                                        ))}
                                        {role.permissions?.length > 5 && (
                                            <Badge variant="ghost" className="text-[9px] px-1.5 py-0">
                                                +{role.permissions.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <div className="px-6 py-3 bg-muted/30 border-t border-muted flex justify-between items-center text-[10px] text-muted-foreground mt-auto">
                                <span>{role.id.slice(0, 13)}...</span>
                                <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                                    Edit <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Dynamic Permissions</p>
                    <p className="text-xs text-muted-foreground">
                        Roles defined here are "Global Roles". Tenant-level roles can be inherited or overridden
                        within individual organization settings.
                    </p>
                </div>
            </div>
        </div>
    );
}

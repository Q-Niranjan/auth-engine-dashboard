"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/errors";
import { UserResponse } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import {
    UserPlus,
    Trash2,
    MoreVertical,
    Loader2,
    Search,
    Filter
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

export default function TenantUsersPage() {
    const queryClient = useQueryClient();
    const { activeTenantId } = useAuthStore();
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // 1. Fetch Users
    const { data: users, isLoading } = useQuery<UserResponse[]>({
        queryKey: ["tenantUsers", activeTenantId],
        queryFn: async () => {
            if (!activeTenantId) return [];
            const { data } = await apiClient.get<UserResponse[]>(`/tenants/${activeTenantId}/users`);
            return data;
        },
        enabled: !!activeTenantId,
    });

    // 2. Invite User
    const inviteMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post(`/tenants/${activeTenantId}/users`, {
                email: inviteEmail,
                role_name: inviteRole,
            });
        },
        onSuccess: () => {
            toast.success(`Invite sent to ${inviteEmail}`);
            setIsInviteOpen(false);
            setInviteEmail("");
            queryClient.invalidateQueries({ queryKey: ["tenantUsers", activeTenantId] });
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "Failed to send invitation"));
        },
    });

    // 3. Remove User
    const removeMutation = useMutation({
        mutationFn: async (userId: string) => {
            await apiClient.delete(`/tenants/${activeTenantId}/users/${userId}`);
        },
        onSuccess: () => {
            toast.success("User removed from organization");
            queryClient.invalidateQueries({ queryKey: ["tenantUsers", activeTenantId] });
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error, "Failed to remove user"));
        },
    });

    if (!activeTenantId) {
        return <div className="p-8 text-center text-muted-foreground">Please select an organization first.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Members who have access to this organization.
                    </p>
                </div>

                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl shadow-lg shadow-primary/20">
                            <UserPlus className="mr-2 h-4 w-4" /> Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Invite a team member</DialogTitle>
                            <DialogDescription>
                                Send an invitation to join this organization. They will receive an email with instructions.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Initial Role</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                    <option value="owner">Owner</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => inviteMutation.mutate()}
                                disabled={inviteMutation.isPending || !inviteEmail.includes("@")}
                                className="w-full sm:w-auto"
                            >
                                {inviteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Invitation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users by email..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <Card className="shadow-sm overflow-hidden border-muted">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Added</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map((user) => (
                                <TableRow key={user.id} className="group transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{user.email}</span>
                                                <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">{user.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px] h-5">
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="cursor-pointer">View profile</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">Edit permissions</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive cursor-pointer"
                                                    onClick={() => {
                                                        if (confirm(`Are you sure you want to remove ${user.email} from this organization?`)) {
                                                            removeMutation.mutate(user.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!users || users.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No users found in this organization.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}

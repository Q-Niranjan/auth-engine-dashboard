"use client"
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { format, parseISO, isValid } from "date-fns";
import {
    ShieldAlert,
    ShieldCheck,
    Mail,
    Smartphone,
    User as UserIcon,
    Calendar,
    Clock,
    Shield,
    Briefcase,
    Globe,
    Pencil,
    Link2,
    Lock,
    Send,
    Loader2,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileForm } from "./edit-profile-form";
import { toast } from "sonner";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

const PROVIDER_ICONS: Record<string, any> = {
    google: FaGoogle,
    github: FaGithub,
    microsoft: FaMicrosoft,
};

const PROVIDER_COLORS: Record<string, string> = {
    google: "text-red-500",
    github: "text-foreground",
    microsoft: "text-blue-600",
};

export default function MeProfilePage() {
    const { user, activeTenantId } = useAuthStore();
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { data: linkedAccounts, isLoading: isLoadingAccounts } = useQuery({
        queryKey: ["linkedOAuthAccounts"],
        queryFn: async () => {
            const { data } = await apiClient.get("/auth/oauth/accounts");
            return data;
        },
        enabled: !!user,
    });

    const hasPassword = user?.auth_strategies?.includes("email_password");

    const setPasswordMutation = useMutation({
        mutationFn: async (password: string) => {
            await apiClient.post("/auth/set-password", {
                new_password: password,
                confirm_password: confirmPassword
            });
        },
        onSuccess: () => {
            toast.success("Password set successfully!");
            setIsSetPasswordOpen(false);
            setNewPassword("");
            setConfirmPassword("");
            queryClient.invalidateQueries({ queryKey: ["verifyUser"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to set password");
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post("/auth/update-password", {
                current_password: currentPassword,
                new_password: newPassword
            });
        },
        onSuccess: () => {
            toast.success("Password updated successfully!");
            setIsChangePasswordOpen(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to update password");
        },
    });

    const resendVerificationMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post("/auth/request-token", {
                email: user?.email,
                action_type: "email_verification",
                tenant_id: activeTenantId,
            });
        },
        onSuccess: () => {
            toast.success("Verification email sent! Check your inbox.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to send verification email");
        },
    });

    if (!user) return null;

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "Never";
        const date = parseISO(dateString);
        return isValid(date) ? format(date, "PPP p") : "Invalid Date";
    };

    const getInitials = () => {
        if (!user.first_name && !user.last_name) return user.username?.[0]?.toUpperCase() || "U";
        return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
    };

    return (
        <div className="mx-auto max-w-6xl pb-10">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg shrink-0">
                    <AvatarImage src={user.avatar_url || ""} alt={user.username || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight truncate">
                        {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-muted-foreground mt-0.5">@{user.username}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"} className="capitalize">
                            {user.status.toLowerCase()}
                        </Badge>
                        {user.mfa_enabled && (
                            <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20">
                                <ShieldCheck className="h-3 w-3 mr-1" /> MFA Enabled
                            </Badge>
                        )}
                    </div>
                </div>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 shrink-0">
                            <Pencil className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>Update your personal information and profile settings.</DialogDescription>
                        </DialogHeader>
                        <EditProfileForm onSuccess={() => setIsEditOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* ── Main Layout: left content + right sidebar ── */}
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

                {/* ── LEFT COLUMN ── */}
                <div className="space-y-6 min-w-0">

                    {/* Personal Information */}
                    <Card className="shadow-sm border-muted/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Personal Information</CardTitle>
                            </div>
                            <CardDescription>Your core identity details on the platform</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</p>
                                    <p className="text-sm font-medium">{user.first_name || "—"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</p>
                                    <p className="text-sm font-medium">{user.last_name || "—"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</p>
                                    <p className="text-sm font-medium font-mono text-primary">@{user.username || "—"}</p>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                                {/* Email */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</p>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        <p className="text-sm font-medium truncate">{user.email}</p>
                                    </div>
                                    {user.is_email_verified ? (
                                        <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-normal text-xs">
                                            <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                                        </Badge>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="w-fit bg-amber-500/10 text-amber-600 border-amber-500/20 font-normal text-xs">
                                                <ShieldAlert className="h-3 w-3 mr-1" /> Unverified
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-primary px-2"
                                                onClick={() => resendVerificationMutation.mutate()}
                                                disabled={resendVerificationMutation.isPending}
                                            >
                                                {resendVerificationMutation.isPending
                                                    ? <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                    : <Send className="h-3 w-3 mr-1" />}
                                                Resend
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</p>
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        <p className="text-sm font-medium">{user.phone_number || "Not provided"}</p>
                                    </div>
                                    {user.phone_number && (
                                        user.is_phone_verified ? (
                                            <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-normal text-xs">
                                                <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="w-fit bg-amber-500/10 text-amber-600 border-amber-500/20 font-normal text-xs">
                                                <ShieldAlert className="h-3 w-3 mr-1" /> Unverified
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Linked Accounts */}
                    <Card className="shadow-sm border-muted/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Link2 className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Linked Accounts</CardTitle>
                            </div>
                            <CardDescription>Social accounts linked for quick sign-in</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingAccounts ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                            ) : linkedAccounts && linkedAccounts.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {linkedAccounts.map((account: any) => {
                                        const Icon = PROVIDER_ICONS[account.provider] || Globe;
                                        const colorClass = PROVIDER_COLORS[account.provider] || "text-muted-foreground";
                                        return (
                                            <div
                                                key={account.provider}
                                                className="flex items-center gap-3 p-3 rounded-lg border border-muted bg-muted/10"
                                            >
                                                <div className="p-2 rounded-md bg-background border shrink-0">
                                                    <Icon className={`h-4 w-4 ${colorClass}`} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold capitalize">{account.provider}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {account.email || account.provider_user_id}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] shrink-0">
                                                    Connected
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic text-center py-6">
                                    No linked social accounts yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Platform Roles */}
                    <Card className="shadow-sm border-muted/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Platform Roles & Access</CardTitle>
                            </div>
                            <CardDescription>Your permissions and assigned roles across tenants</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-muted/50">
                                {user.roles && user.roles.length > 0 ? (
                                    user.roles.map((roleAssignment: any, idx: number) => (
                                        <div key={idx} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                                    <Shield className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{roleAssignment.role.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5 max-w-xs line-clamp-2">
                                                        {roleAssignment.role.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full">
                                                    <Globe className="h-3 w-3" />
                                                    <span className="font-mono">{roleAssignment.tenant_id}</span>
                                                </div>
                                                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                                                    Level {roleAssignment.role.level}
                                                </Badge>
                                                <Badge variant="outline" className="bg-muted border-muted-foreground/20 text-xs">
                                                    {roleAssignment.role.scope}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-10 text-center text-muted-foreground">
                                        <Briefcase className="h-8 w-8 mx-auto opacity-20 mb-3" />
                                        <p className="text-sm font-medium">No roles assigned yet.</p>
                                        <p className="text-xs opacity-70 mt-1">Contact an administrator for access.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
                {/* ── END LEFT COLUMN ── */}

                {/* ── RIGHT SIDEBAR ── */}
                <div className="space-y-6">

                    {/* Account Timeline */}
                    <Card className="shadow-sm border-muted/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Account Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Member Since</p>
                                    <p className="text-sm font-medium mt-0.5">{formatDate(user.created_at)}</p>
                                </div>
                            </div>
                            <Separator className="opacity-40" />
                            <div className="flex gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Activity</p>
                                    <p className="text-sm font-medium mt-0.5">{formatDate(user.last_login_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="shadow-sm border-muted/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">Security</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* MFA row */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Two-Step Verification</p>
                                    <p className="text-xs text-muted-foreground">Secure your account with MFA</p>
                                </div>
                                {user.mfa_enabled ? (
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 shrink-0">On</Badge>
                                ) : (
                                    <Badge variant="secondary" className="shrink-0">Off</Badge>
                                )}
                            </div>

                            <Separator className="opacity-40" />

                            {/* Password row */}
                            {!hasPassword ? (
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Password</p>
                                        <p className="text-xs text-muted-foreground">None set</p>
                                    </div>
                                    <Dialog open={isSetPasswordOpen} onOpenChange={setIsSetPasswordOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-7 text-xs shrink-0">
                                                <Lock className="mr-1 h-3 w-3" /> Set
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Set Account Password</DialogTitle>
                                                <DialogDescription>
                                                    Add a password to enable email/password login alongside your social logins.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">New Password</label>
                                                    <Input type="password" placeholder="Enter a strong password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Confirm Password</label>
                                                    <Input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    onClick={() => setPasswordMutation.mutate(newPassword)}
                                                    disabled={setPasswordMutation.isPending || !newPassword || newPassword.length < 8 || newPassword !== confirmPassword}
                                                >
                                                    {setPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Set Password
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Password</p>
                                        <p className="text-xs text-muted-foreground">Email & password active</p>
                                    </div>
                                    <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-7 text-xs shrink-0">
                                                <Lock className="mr-1 h-3 w-3" /> Change
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Update Password</DialogTitle>
                                                <DialogDescription>
                                                    Enter your current password and a new one to update your credentials.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Current Password</label>
                                                    <Input type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">New Password</label>
                                                    <Input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Confirm New Password</label>
                                                    <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    onClick={() => changePasswordMutation.mutate()}
                                                    disabled={changePasswordMutation.isPending || !currentPassword || !newPassword || newPassword.length < 8 || newPassword !== confirmPassword}
                                                >
                                                    {changePasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Update Password
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}

                            <Separator className="opacity-40" />

                            {/* Auth methods */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Auth Methods</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {user.auth_strategies.map((strategy: string) => (
                                        <Badge key={strategy} variant="secondary" className="text-xs px-2 py-0.5 bg-primary/5 text-primary border-primary/10">
                                            {strategy.replace("_", " ")}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                {/* ── END RIGHT SIDEBAR ── */}

            </div>
        </div>
    );
}
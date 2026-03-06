"use client"
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
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
    Settings
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileForm } from "./edit-profile-form";

export default function MeProfilePage() {
    const { user } = useAuthStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    if (!user) return null; // AuthGuard handles the redirect

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
        <div className="mx-auto max-w-5xl space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={user.avatar_url || ""} alt={user.username || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        @{user.username} • Manage your identity and see your access across the platform.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Pencil className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Update your personal information and profile settings.
                                    </DialogDescription>
                                </DialogHeader>
                                <EditProfileForm onSuccess={() => setIsEditOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Personal Information */}
                <Card className="lg:col-span-2 shadow-sm border-muted/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-primary" />
                            <CardTitle>Personal Information</CardTitle>
                        </div>
                        <CardDescription>
                            Your core identity details on the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</span>
                                <p className="text-base font-medium">{user.first_name || "—"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</span>
                                <p className="text-base font-medium">{user.last_name || "—"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</span>
                                <p className="text-base font-medium text-primary font-mono">{user.username || "—"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</span>
                                <div>
                                    <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"} className="capitalize">
                                        {user.status.toLowerCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</span>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-base font-medium">{user.email}</p>
                                    </div>
                                    {user.is_email_verified ? (
                                        <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1 font-normal">
                                            <ShieldCheck className="h-3 w-3" /> Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="w-fit bg-amber-500/10 text-amber-600 border-amber-500/20 flex items-center gap-1 font-normal">
                                            <ShieldAlert className="h-3 w-3" /> Action Required
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</span>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-base font-medium">{user.phone_number || "Not provided"}</p>
                                    </div>
                                    {user.phone_number && (
                                        user.is_phone_verified ? (
                                            <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1 font-normal">
                                                <ShieldCheck className="h-3 w-3" /> Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="w-fit bg-amber-500/10 text-amber-600 border-amber-500/20 flex items-center gap-1 font-normal">
                                                <ShieldAlert className="h-3 w-3" /> Unverified
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Metadata */}
                <Card className="shadow-sm border-muted/50 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Account Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Member Since</p>
                                <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Last Activity</p>
                                <p className="text-sm font-medium">{formatDate(user.last_login_at)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Access */}
                <Card className="shadow-sm border-muted/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Security & Access</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/50">
                            <div className="space-y-0.5">
                                <p className="text-sm font-semibold">Two-Step Verification</p>
                                <p className="text-xs text-muted-foreground">Secure your account with MFA</p>
                            </div>
                            {user.mfa_enabled ? (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600">Enabled</Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-muted text-muted-foreground border-muted">Disabled</Badge>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Active Authentication Methods
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {user.auth_strategies.map((strategy) => (
                                    <Badge key={strategy} variant="secondary" className="px-3 py-1 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors">
                                        {strategy.replace("_", " ").toUpperCase()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Roles & Tenants */}
                <Card className="lg:col-span-2 shadow-sm border-muted/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                <CardTitle>Platform Roles & Access</CardTitle>
                            </div>
                        </div>
                        <CardDescription>
                            Your permissions and assigned roles across tenants
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 p-0">
                        <div className="divide-y divide-muted/50">
                            {user.roles && user.roles.length > 0 ? (
                                user.roles.map((roleAssignment, idx) => (
                                    <div key={idx} className="p-6 hover:bg-muted/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    <Shield className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg leading-none">{roleAssignment.role.name}</p>
                                                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                                        {roleAssignment.role.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 md:items-end">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                                                <Globe className="h-3.5 w-3.5" />
                                                <span className="font-medium">Tenant:</span>
                                                <span className="font-mono text-foreground tracking-tight">{roleAssignment.tenant_id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs font-semibold">
                                                    Level {roleAssignment.role.level}
                                                </Badge>
                                                <Badge variant="outline" className="bg-muted border-muted-foreground/20 text-xs font-semibold">
                                                    {roleAssignment.role.scope} Scope
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    <Briefcase className="h-10 w-10 mx-auto opacity-20 mb-4" />
                                    <p className="font-medium">No roles assigned yet.</p>
                                    <p className="text-sm opacity-70">Contact an administrator for access.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

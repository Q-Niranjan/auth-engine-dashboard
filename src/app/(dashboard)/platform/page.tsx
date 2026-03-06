"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
    Building2,
    Users2,
    ShieldAlert,
    Activity,
    TrendingUp,
    Server,
    Database,
    Globe
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function PlatformOverviewPage() {
    // 1. Fetch Global Stats
    const { data: tenants } = useQuery({
        queryKey: ["allTenants"],
        queryFn: async () => {
            const { data } = await apiClient.get("/platform/tenants");
            return data;
        },
    });

    const { data: users } = useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            const { data } = await apiClient.get("/platform/users");
            return data;
        },
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Global state of the AuthEngine instance.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-muted shadow-sm group hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Tenants</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{tenants?.length || 0}</div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                            <TrendingUp className="h-3 w-3" /> +12% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-muted shadow-sm group hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Global Users</CardTitle>
                        <Users2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{users?.length || 0}</div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                            <TrendingUp className="h-3 w-3" /> +5.2% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-muted shadow-sm group hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-muted-foreground">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-500">Optimal</div>
                        <p className="text-[10px] text-muted-foreground mt-1">API Latency: 42ms</p>
                    </CardContent>
                </Card>

                <Card className="border-muted shadow-sm group hover:border-primary/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Storage Used</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12.4 GB</div>
                        <Progress value={45} className="h-1 mt-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* System Info */}
                <Card className="md:col-span-1 border-muted shadow-sm bg-muted/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" />
                            System Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-muted">
                            <span className="text-xs text-muted-foreground">Engine Version</span>
                            <Badge variant="secondary" className="text-[10px]">v1.4.2-stable</Badge>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-muted">
                            <span className="text-xs text-muted-foreground">Environment</span>
                            <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-500">Production</Badge>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-xs text-muted-foreground">Region</span>
                            <span className="text-xs font-medium flex items-center gap-1">
                                <Globe className="h-3 w-3" /> US-East-1
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Tenants */}
                <Card className="md:col-span-2 border-muted shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Recent Tenants
                        </CardTitle>
                        <CardDescription>Latest organizations onboarded to the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tenants?.slice(0, 5).map((t: any) => (
                                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-muted">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center font-bold text-primary shadow-sm">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{t.name}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground">{t.slug}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="secondary" className="text-[10px] h-5 mb-1">Active</Badge>
                                        <p className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

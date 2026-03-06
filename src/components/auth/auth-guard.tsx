"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { AuthResponse } from "@/lib/types";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { accessToken, user, setUser, logout } = useAuthStore();
    const [isMounting, setIsMounting] = useState(true);

    // Avoid hydration mismatches by not rendering auth-dependent state until mounted
    useEffect(() => {
        setIsMounting(false);
    }, []);

    // Fetch the current user on mount to verify token is still valid
    const { isLoading: isVerifying } = useQuery({
        queryKey: ["verifyUser", accessToken],
        queryFn: async () => {
            if (!accessToken) return null;
            try {
                const { data } = await apiClient.get<AuthResponse["user"]>("/me");
                if (data) {
                    setUser(data);
                }
                return data;
            } catch (error) {
                logout();
                return null;
            }
        },
        // Only attempt verification if we think we are logged in
        enabled: !!accessToken && !isMounting,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (!isMounting && !isVerifying && !accessToken) {
            // User is not logged in, redirect to login with return path
            const returnTo = encodeURIComponent(pathname);
            router.push(`/login?returnTo=${returnTo}`);
        }
    }, [accessToken, isMounting, isVerifying, pathname, router]);

    // Handle various loading states
    if (isMounting || isVerifying) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If not mounted or not verified, render nothing while redirect handles it
    if (!accessToken || !user) {
        return null;
    }

    return <>{children}</>;
}

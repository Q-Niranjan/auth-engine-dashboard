"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
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
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setIsMounting(false);

        const persistApi = useAuthStore.persist;
        if (!persistApi) {
            setHasHydrated(true);
            return;
        }

        if (persistApi.hasHydrated()) {
            setHasHydrated(true);
        }

        return persistApi.onFinishHydration(() => {
            setHasHydrated(true);
        });
    }, []);

    const { isLoading: isVerifying } = useQuery({
        queryKey: ["verifyUser", accessToken],
        queryFn: async () => {
            if (!accessToken) return null;
            try {
                const { data } = await apiClient.get<AuthResponse["user"]>("/me/");
                if (data) {
                    setUser(data);
                }
                return data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    logout();
                }
                return null;
            }
        },
        enabled: !!accessToken && !isMounting && hasHydrated,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (!hasHydrated || isMounting || isVerifying) return;

        if (!accessToken) {
            const returnTo = encodeURIComponent(pathname);
            router.push(`/login?returnTo=${returnTo}`);
        }
    }, [accessToken, hasHydrated, isMounting, isVerifying, pathname, router]);

    const waitingForAuth = isMounting || !hasHydrated;
    const waitingForVerify = isVerifying && !user;

    if (waitingForAuth || waitingForVerify) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!accessToken || !user) {
        return null;
    }

    return <>{children}</>;
}

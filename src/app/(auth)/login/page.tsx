"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, Mail, Loader2 } from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";

import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { AuthResponse, OAuthLoginResponse } from "@/lib/types";
import { FaGithub, FaGoogle } from "react-icons/fa";


import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get("returnTo") || "/me";
    const { setTokens, setUser } = useAuthStore();

    const [authMethod, setAuthMethod] = useState<"password" | "webauthn">("password");

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (values: z.infer<typeof loginSchema>) => {
            const { data } = await apiClient.post<AuthResponse>("/auth/login", {
                email: values.email,
                password: values.password,
            });
            return data;
        },
        onSuccess: (data) => {
            setTokens(data.access_token, data.refresh_token);
            if (data.user) {
                setUser(data.user);
            }
            toast.success("Successfully logged in!");
            router.push(returnTo);
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.detail || "Invalid email or password."
            );
        },
    });

    // TODO WebAuthn integration here
    const handleWebAuthnLogin = async () => {
        toast.info("WebAuthn login is coming soon.");
    };

    const handleSocialLogin = (provider: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        // Redirect to backend OAuth initiation
        window.location.href = `${baseUrl}/auth/oauth/${provider}/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
    };

    function onSubmit(values: z.infer<typeof loginSchema>) {
        loginMutation.mutate(values);
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-muted">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Sign In</CardTitle>
                    <CardDescription>
                        Choose your preferred sign in method
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={authMethod === "password" ? "default" : "outline"}
                            className="w-full"
                            onClick={() => setAuthMethod("password")}
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Password
                        </Button>
                        <Button
                            variant={authMethod === "webauthn" ? "default" : "outline"}
                            className="w-full"
                            onClick={() => setAuthMethod("webauthn")}
                        >
                            <KeyRound className="mr-2 h-4 w-4" />
                            Passkey
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or sign in with email
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl hover:bg-muted/50 transition-all border-muted-foreground/20"
                            onClick={() => handleSocialLogin("google")}
                        >
                            <FaGoogle className="h-4 w-4 text-red-500" />
                            <span className="font-medium">Google</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl hover:bg-muted/50 transition-all border-muted-foreground/20"
                            onClick={() => handleSocialLogin("authengine")}
                        >
                            <FaGithub className="h-4 w-4" />
                            <span className="font-medium">AuthEngine</span>
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Traditional Sign In
                            </span>
                        </div>
                    </div>

                    {authMethod === "password" ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Password</FormLabel>
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loginMutation.isPending}
                                >
                                    {loginMutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Sign In
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <div className="rounded-lg border border-border bg-muted p-4 text-center text-sm text-muted-foreground">
                                Sign in securely and quickly using your device's fingerprint, face scan, or screen lock.
                            </div>
                            <Button onClick={handleWebAuthnLogin} className="w-full" size="lg">
                                <KeyRound className="mr-2 h-5 w-5" />
                                Sign in with Passkey
                            </Button>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

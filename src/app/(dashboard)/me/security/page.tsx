"use client";

import { ShieldCheck, KeyRound, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasskeyManagement from "@/components/security/PasskeyManagement";
import MFAManagement from "@/components/security/MFAManagement";

export default function SecuritySettingsPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Enhance your account security with Multi-Factor Authentication and Passkeys.
                </p>
            </div>

            <Tabs defaultValue="mfa" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="mfa" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" /> Two-Factor
                    </TabsTrigger>
                    <TabsTrigger value="passkeys" className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" /> Passkeys
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mfa" className="space-y-6">
                    <MFAManagement />
                </TabsContent>

                <TabsContent value="passkeys" className="space-y-6">
                    <PasskeyManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}

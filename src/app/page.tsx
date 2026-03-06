"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Users,
  Zap,
  Globe,
  Fingerprint,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (accessToken) {
      router.push("/me");
    }
  }, [accessToken, router]);

  if (!isMounted || accessToken) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 px-4 lg:px-8 h-20 flex items-center border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center space-x-3 group" href="/">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter">Auth Engine</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors" href="/login">
              Sign In
            </Link>
            <Button asChild size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20">
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-48 lg:py-64 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)_0%,transparent_50%)] opacity-[0.08]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />

          <div className="container px-4 md:px-6 mx-auto relative">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-4xl mx-auto">
                <Badge variant="outline" className="py-1 px-4 text-xs font-bold tracking-widest uppercase border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
                  v1.4 Status: Stable
                </Badge>
                <h1 className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  The Future of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] animate-gradient whitespace-nowrap">Identity Engine.</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed font-medium animate-in fade-in duration-1000 delay-300">
                  Enterprise-grade authentication that feels like magic. Passkey-native, multi-tenant,
                  and designed for developers who value speed and security.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 animate-in fade-in duration-1000 delay-500">
                <Button asChild size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25 group transition-all hover:scale-105 active:scale-95">
                  <Link href="/register">
                    Deploy Instance <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold border-muted-foreground/20 hover:bg-muted/50 transition-all">
                  <Link href="/login">Platform Console</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full py-24 border-t border-border/40 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Fingerprint className="h-8 w-8" />,
                  title: "Passkey Native",
                  desc: "Built-in support for WebAuthn. Enable biometrics in minutes with our high-level SDK components."
                },
                {
                  icon: <Building2 className="h-8 w-8" />,
                  title: "Deep Multi-Tenancy",
                  desc: "Complete isolation between organizations. Custom domains, SMTP, and social providers per tenant."
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "Unified API",
                  desc: "One central client for all your auth needs. Automatic token refresh and context-aware session management."
                }
              ].map((f, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/20 hover:bg-card/50 transition-all duration-500">
                  <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 container mx-auto px-4">
          <div className="p-12 md:p-24 bg-foreground rounded-[48px] text-background text-center space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-4xl md:text-6xl font-black max-w-2xl mx-auto leading-tight relative">Ready to secure your next big idea?</h2>
            <Button asChild size="lg" variant="secondary" className="h-14 px-12 rounded-2xl text-lg font-bold hover:scale-105 active:scale-95 transition-all">
              <Link href="/register">Join the Waitlist</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">© 2026 Auth Engine.</span>
          </div>
          <nav className="flex gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            <Link className="hover:text-primary transition-colors" href="#">Docs</Link>
            <Link className="hover:text-primary transition-colors" href="#">Security</Link>
            <Link className="hover:text-primary transition-colors" href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

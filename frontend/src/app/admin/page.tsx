"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Mock Login Logic
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        if (email === "admin@example.com" && password === "admin") {
            await new Promise(r => setTimeout(r, 1000));
            // Set mock admin cookie or token here if needed
            router.push("/admin/dashboard");
        } else {
            await new Promise(r => setTimeout(r, 500));
            setError("Invalid credentials (try admin@example.com / admin)");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-10 shadow-lg">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
                    <p className="text-muted-foreground">
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button className="w-full" size="lg" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

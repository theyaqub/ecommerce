"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import { User, Package, LogOut } from "lucide-react";

export default function AccountPage() {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/login");
        }
    }, [mounted, isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!mounted || !isAuthenticated) {
        return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="container px-4 py-12 mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="bg-card border rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full capitalize">{user?.role}</span>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Account Details</h3>
                    <div className="grid gap-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name</span>
                            <span>{user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Type</span>
                            <span className="capitalize">{user?.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Package className="h-5 w-5" />
                    <h3 className="font-medium">My Orders</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                    You haven't placed any orders yet.
                </p>
                <Button className="mt-4" variant="outline" onClick={() => router.push("/products")}>
                    Start Shopping
                </Button>
            </div>

            {user?.role === 'admin' && (
                <div className="bg-card border rounded-lg p-6 mb-6">
                    <h3 className="font-medium mb-4">Admin Access</h3>
                    <Button onClick={() => router.push("/admin/dashboard")}>
                        Go to Admin Dashboard
                    </Button>
                </div>
            )}

            <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign Out
            </Button>
        </div>
    );
}

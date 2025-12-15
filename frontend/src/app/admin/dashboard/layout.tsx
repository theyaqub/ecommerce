"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/admin/login");
        }
    }, [mounted, isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push("/admin/login");
    };

    if (!mounted) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/40 hidden md:flex flex-col">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/admin/dashboard" className="font-bold text-lg tracking-tight">
                        LuxCart Admin
                    </Link>
                </div>
                <div className="flex flex-col gap-2 p-4 flex-1">
                    <nav className="grid gap-1">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <Package className="h-4 w-4" />
                            Products
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Orders
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">
                        Logged in as: <span className="font-medium text-foreground">{user?.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10 w-full"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <header className="h-16 border-b flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold">LuxCart Admin</span>
                    <button onClick={handleLogout} className="text-sm text-destructive">
                        Logout
                    </button>
                </header>
                <div className="flex-1 p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

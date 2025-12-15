"use client";

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/use-auth-store"
import { useCartStore } from "@/store/use-cart-store"

export function Header() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const cartItems = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? cartItems.length : 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight">LuxCart</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/products" className="transition-colors hover:text-primary">
                            Products
                        </Link>
                        <Link href="/categories" className="transition-colors hover:text-primary">
                            Categories
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <form onSubmit={handleSearch} className="w-full max-w-sm hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </form>
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" asChild className="relative">
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                                <span className="sr-only">Cart</span>
                            </Link>
                        </Button>

                        {mounted && isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/account" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:inline">{user?.name}</span>
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}

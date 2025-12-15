"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { Trash2, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Hydration fix for persist middleware
    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!mounted) {
        return <div className="min-h-screen container py-12">Loading cart...</div>;
    }

    // Mock data if cart is empty for testing UI
    const displayItems = items.length === 0 ? [] : items;

    return (
        <div className="container px-4 py-12 mx-auto">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg p-12 bg-muted/50">
                    <p className="text-lg text-muted-foreground">Your cart is empty.</p>
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 border rounded-lg p-4 bg-card shadow-sm">
                                <div className="h-24 w-24 bg-secondary rounded-md flex items-center justify-center shrink-0 overflow-hidden">
                                    {/* Placeholder image */}
                                    <span className="text-xs text-muted-foreground">Img</span>
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">Electronics</p>
                                        </div>
                                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 px-2 hover:bg-muted"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 px-2 hover:bg-muted"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 gap-1"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" /> <span className="sr-only">Remove</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 bg-card shadow-sm sticky top-24">
                            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${total().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total().toFixed(2)}</span>
                                </div>
                            </div>

                            <Button className="w-full mt-6" size="lg" asChild>
                                <Link href="/checkout">
                                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

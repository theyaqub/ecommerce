"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        zipCode: ""
    });

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Create order in database
            const orderData = {
                items: items.map(item => ({
                    product_id: parseInt(item.id),
                    quantity: item.quantity,
                    price: item.price
                })),
                total: total(),
                shipping_address: `${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipCode}`
            };

            await api.createOrder(orderData);

            clearCart();
            router.push("/order-confirmation");
        } catch (err) {
            console.error("Order failed:", err);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button asChild>
                    <Link href="/products">Go Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container px-4 py-12 mx-auto max-w-4xl">
            <Button variant="ghost" className="mb-6 gap-2" asChild>
                <Link href="/cart">
                    <ArrowLeft className="h-4 w-4" /> Back to Cart
                </Link>
            </Button>

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <input
                                    required
                                    className="w-full border rounded-md px-3 py-2 bg-background"
                                    placeholder="John"
                                    value={shippingAddress.firstName}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <input
                                    required
                                    className="w-full border rounded-md px-3 py-2 bg-background"
                                    placeholder="Doe"
                                    value={shippingAddress.lastName}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full border rounded-md px-3 py-2 bg-background"
                                placeholder="john@example.com"
                                value={shippingAddress.email}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <input
                                required
                                className="w-full border rounded-md px-3 py-2 bg-background"
                                placeholder="123 Main St"
                                value={shippingAddress.address}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <input
                                    required
                                    className="w-full border rounded-md px-3 py-2 bg-background"
                                    placeholder="New York"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Zip Code</label>
                                <input
                                    required
                                    className="w-full border rounded-md px-3 py-2 bg-background"
                                    placeholder="10001"
                                    value={shippingAddress.zipCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div>
                    <div className="border rounded-lg p-6 bg-muted/30 sticky top-24">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                        <div className="space-y-4 max-h-[300px] overflow-auto mb-4 pr-2">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${total().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2">
                                <span>Total</span>
                                <span>${total().toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            form="checkout-form"
                            className="w-full mt-6"
                            size="lg"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Place Order"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

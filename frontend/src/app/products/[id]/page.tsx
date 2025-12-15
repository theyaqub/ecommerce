"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";

// Mock Data Lookup (In real app, fetch from API)
const GET_PRODUCT = (id: string) => {
    const products = [
        { id: "1", name: "Premium Wireless Headphones", price: 299.99, category: "Electronics", description: "Experience high-fidelity sound with our premium wireless headphones. Featuring active noise cancellation and 30-hour battery life." },
        { id: "2", name: "Ergonomic Office Chair", price: 199.50, category: "Furniture", description: "Work in comfort with this ergonomic mesh chair. Adjustable lumbar support and headrest." },
        { id: "3", name: "Mechanical Gaming Keyboard", price: 129.00, category: "Electronics", description: "Tactile mechanical switches for the ultimate gaming experience. RGB backlighting included." },
        { id: "4", name: "Smart Fitness Watch", price: 149.99, category: "Wearables", description: "Track your health metrics with precision. Waterproof and durable design." },
    ];
    return products.find(p => p.id === id);
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = GET_PRODUCT(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container px-4 py-12 mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Image Gallery Mock */}
                <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                        <span className="text-4xl font-bold text-muted-foreground opacity-20">Product Image</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-muted rounded-md cursor-pointer hover:ring-2 hover:ring-primary"></div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-sm font-medium text-primary tracking-wide uppercase">{product.category}</h2>
                        <h1 className="text-3xl font-bold tracking-tight mt-1">{product.name}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
                        <div className="flex items-center text-yellow-500">
                            <Star className="fill-current h-5 w-5" />
                            <Star className="fill-current h-5 w-5" />
                            <Star className="fill-current h-5 w-5" />
                            <Star className="fill-current h-5 w-5" />
                            <Star className="h-5 w-5" />
                            <span className="text-muted-foreground ml-2 text-sm">(4.0)</span>
                        </div>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    <div className="pt-6 border-t space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="border rounded-md flex items-center">
                                <button className="px-3 py-2 hover:bg-muted">-</button>
                                <span className="px-4 py-2 border-x font-medium">1</span>
                                <button className="px-3 py-2 hover:bg-muted">+</button>
                            </div>
                            <Button
                                size="lg"
                                className="flex-1 gap-2"
                                onClick={() => useCartStore.getState().addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: "/placeholder.jpg" // using placeholder for now
                                })}
                            >
                                <ShoppingCart className="h-5 w-5" /> Add to Cart
                            </Button>
                        </div>
                        <Button variant="outline" size="lg" className="w-full">
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

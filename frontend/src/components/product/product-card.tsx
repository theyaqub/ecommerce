"use client";

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/use-cart-store"

interface Product {
    id: string
    name: string
    price: number
    image?: string
    category: string
}

interface ProductCardProps {
    product: Product
    className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
    return (
        <div className={cn("group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md", className)}>
            <div className="aspect-square relative overflow-hidden bg-muted">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary">
                        <span className="text-xl font-semibold opacity-20">Image</span>
                    </div>
                )}
                <Link href={`/products/${product.id}`} className="absolute inset-0" prefetch={false}>
                    <span className="sr-only">View {product.name}</span>
                </Link>
            </div>
            <div className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                        <h3 className="font-semibold tracking-tight text-lg leading-tight">
                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                        </h3>
                    </div>
                    <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
                </div>

                <Button
                    className="w-full mt-2 gap-2"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        useCartStore.getState().addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image
                        });
                        alert(`${product.name} added to cart!`);
                    }}
                >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}

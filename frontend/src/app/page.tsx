"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { api } from "@/lib/api";

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    category_name: string;
    image_url: string | null;
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getProducts()
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container px-4 py-12 mx-auto">
            <h1 className="text-4xl font-bold mb-8">Featured Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            id: String(product.id),
                            name: product.name,
                            price: parseFloat(product.price),
                            category: product.category_name || "Unknown",
                            image: product.image_url || undefined,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

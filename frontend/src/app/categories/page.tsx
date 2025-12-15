"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Category {
    id: number;
    name: string;
    description: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getCategories()
            .then(res => setCategories(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container px-4 py-12 mx-auto">
            <h1 className="text-3xl font-bold mb-8">Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/products?category=${encodeURIComponent(category.name)}`}
                        className="group block p-6 border rounded-lg bg-card hover:shadow-md transition-all hover:border-primary"
                    >
                        <h2 className="text-xl font-semibold group-hover:text-primary">
                            {category.name}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            {category.description || "Browse products in this category"}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

interface Category {
    id: number;
    name: string;
}

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("search");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || "all");
    const [priceRange, setPriceRange] = useState<number>(1000);
    const [sortBy, setSortBy] = useState<string>("featured");
    const [searchQuery, setSearchQuery] = useState<string>(searchFromUrl || "");

    useEffect(() => {
        Promise.all([api.getProducts(), api.getCategories()])
            .then(([productsRes, categoriesRes]) => {
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Update search when URL changes
    useEffect(() => {
        if (searchFromUrl) {
            setSearchQuery(searchFromUrl);
        }
    }, [searchFromUrl]);

    // Filter products
    const filteredProducts = products
        .filter(p => searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(p => selectedCategory === "all" || p.category_name === selectedCategory)
        .filter(p => parseFloat(p.price) <= priceRange)
        .sort((a, b) => {
            if (sortBy === "price-low") return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === "price-high") return parseFloat(b.price) - parseFloat(a.price);
            return 0;
        });

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filter */}
                <aside className="w-full md:w-64 shrink-0 space-y-8">
                    <div>
                        <h3 className="font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`hover:text-primary ${selectedCategory === "all" ? "text-primary font-medium" : "text-muted-foreground"}`}
                                >
                                    All Products
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`hover:text-primary ${selectedCategory === cat.name ? "text-primary font-medium" : "text-muted-foreground"}`}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Price Range</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>$0</span>
                                <span className="font-medium text-foreground">${priceRange}</span>
                                <span>$1000</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {selectedCategory === "all" ? "All Products" : selectedCategory}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border rounded p-1 bg-background"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                    {filteredProducts.length === 0 ? (
                        <p className="text-muted-foreground">No products found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
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
                    )}
                </div>
            </div>
        </div>
    );
}

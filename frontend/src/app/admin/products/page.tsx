"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { api } from "@/lib/api";

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    stock: number;
    category_id: number;
    category_name: string;
    image_url: string | null;
}

interface Category {
    id: number;
    name: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        category_id: ""
    });

    const fetchData = () => {
        Promise.all([api.getProducts(), api.getCategories()])
            .then(([productsRes, categoriesRes]) => {
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: "", price: "", description: "", stock: "", category_id: "" });
        setImageFile(null);
        setImagePreview(null);
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description || "",
            stock: String(product.stock),
            category_id: String(product.category_id || "")
        });
        setImageFile(null);
        setImagePreview(product.image_url);
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('stock', formData.stock);
        if (formData.category_id) {
            formDataToSend.append('category_id', formData.category_id);
        }
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        }

        try {
            if (editingProduct) {
                await api.updateProduct(String(editingProduct.id), formDataToSend);
            } else {
                await api.createProduct(formDataToSend);
            }
            setShowModal(false);
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || "Error saving product");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.deleteProduct(String(id));
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || "Error deleting product");
        }
    };

    if (loading) return <div className="p-8">Loading products...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <Button className="gap-2" onClick={openAddModal}>
                    <Plus className="h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((product) => (
                            <tr key={product.id} className="bg-card hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                    ) : (
                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No img</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 font-medium">{product.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{product.category_name || "—"}</td>
                                <td className="px-4 py-3">${parseFloat(product.price).toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${product.stock > 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(product)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(product.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 w-full max-w-md border shadow-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingProduct ? "Edit Product" : "Add Product"}
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Product Image</label>
                                <div className="mt-1 flex items-center gap-4">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                                    )}
                                    <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted">
                                        <Upload className="h-4 w-4" />
                                        <span className="text-sm">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border rounded-md p-2 mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full border rounded-md p-2 mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded-md p-2 mt-1"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full border rounded-md p-2 mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full border rounded-md p-2 mt-1"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingProduct ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

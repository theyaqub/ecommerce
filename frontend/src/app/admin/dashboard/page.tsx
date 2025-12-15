"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

interface Stats {
    revenue: number;
    orders: number;
    products: number;
    totalStock: number;
}

interface TopProduct {
    id: number;
    name: string;
    stock: number;
    category_name: string;
}

interface RecentOrder {
    id: number;
    total: string;
    status: string;
    created_at: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getStats()
            .then(res => {
                setStats(res.data.stats);
                setTopProducts(res.data.topProducts);
                setRecentOrders(res.data.recentOrders);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats?.revenue?.toFixed(2) || '0.00'}</div>
                        <p className="text-xs text-muted-foreground">From all orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.orders || 0}</div>
                        <p className="text-xs text-muted-foreground">Orders placed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.products || 0}</div>
                        <p className="text-xs text-muted-foreground">Active products</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalStock || 0}</div>
                        <p className="text-xs text-muted-foreground">Items in inventory</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.length === 0 ? (
                                <p className="text-muted-foreground">No orders yet</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-2">
                                        <div>
                                            <p className="font-medium">Order #{order.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${parseFloat(order.total).toFixed(2)}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.length === 0 ? (
                                <p className="text-muted-foreground">No products yet</p>
                            ) : (
                                topProducts.map((product) => (
                                    <div key={product.id} className="flex items-center">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.category_name || 'Uncategorized'}</p>
                                        </div>
                                        <div className="font-medium">{product.stock} in stock</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function AdminOrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {[1, 2, 3].map((item) => (
                            <tr key={item} className="bg-card hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-medium">#ORD-00{item}</td>
                                <td className="px-4 py-3 text-muted-foreground">John Doe</td>
                                <td className="px-4 py-3">Oct 2{item}, 2024</td>
                                <td className="px-4 py-3">$299.00</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                        Paid
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

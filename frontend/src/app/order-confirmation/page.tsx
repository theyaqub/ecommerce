import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12 text-center text-balance">
            <div className="rounded-full bg-green-100 p-6 mb-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
                Thank you for your purchase. We have received your order and will begin processing it right away.
            </p>

            <div className="flex gap-4">
                <Button asChild size="lg">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    );
}

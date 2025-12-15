export function Footer() {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 text-center md:text-left">
                <p className="text-sm leading-loose text-muted-foreground">
                    Built with Next.js & PostgreSQL. Open Source E-commerce.
                </p>
                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} LuxCart Inc.
                </div>
            </div>
        </footer>
    )
}

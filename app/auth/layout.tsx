export const metadata = {
    title: "Authentication - BrandSphere",
    description: "Sign in or create an account",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Hide the site header for auth pages */}
            <style jsx global>{`
                header:first-of-type {
                    display: none;
                }
            `}</style>
            <div className="min-h-screen bg-background">
                {children}
            </div>
        </>
    );
} 
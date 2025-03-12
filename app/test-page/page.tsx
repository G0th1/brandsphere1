export default function TestPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-4xl font-bold mb-6">BrandSphere Test Page</h1>
            <p className="text-xl mb-8">Om du ser denna sida fungerar applikationen korrekt!</p>

            <div className="flex flex-col gap-4 w-full max-w-md">
                <a
                    href="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Tillbaka till Startsidan
                </a>

                <a
                    href="/auth/login"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Gå till Inloggning
                </a>
            </div>
        </div>
    );
} 
export const dynamic = 'force-dynamic';

export default function AccountsPage() {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Account Management</h1>
            <p className="mb-6">Connect and manage your social media accounts.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { name: 'Instagram', status: 'Connected', followers: '12.5K' },
                    { name: 'Twitter', status: 'Connected', followers: '8.7K' },
                    { name: 'Facebook', status: 'Needs attention', followers: '24.6K' },
                    { name: 'LinkedIn', status: 'Not connected', followers: '0' }
                ].map((account, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-semibold">{account.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${account.status === 'Connected'
                                    ? 'bg-green-100 text-green-800'
                                    : account.status === 'Needs attention'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                {account.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Followers: {account.followers}</p>
                        <div className="mt-4">
                            <a href="#" className="text-blue-600 hover:underline text-sm">
                                Manage account →
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <a
                    href="#"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Connect New Account
                </a>
            </div>
        </div>
    );
} 
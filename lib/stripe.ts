import Stripe from "stripe";

// Create a mock Stripe client if the API key is missing
const createMockStripe = () => {
    console.warn('Stripe API key missing - using mock Stripe client');

    return new Proxy({}, {
        get: (target, prop) => {
            // Handle common method calls with mock responses
            if (prop === 'webhooks') {
                return {
                    constructEvent: () => ({ type: 'mock_event', data: { object: {} } })
                };
            }

            if (prop === 'customers' || prop === 'subscriptions' || prop === 'checkout') {
                return {
                    create: () => Promise.resolve({ id: 'mock_id' }),
                    retrieve: () => Promise.resolve({ id: 'mock_id', status: 'active' }),
                    update: () => Promise.resolve({ id: 'mock_id' }),
                    list: () => Promise.resolve({ data: [] })
                };
            }

            // For any other property, return a function that resolves to an empty object
            return () => Promise.resolve({});
        }
    });
};

// Initialize Stripe client with fallback to mock
let stripe: any;

try {
    const apiKey = process.env.STRIPE_API_KEY || process.env.STRIPE_SECRET_KEY;

    if (apiKey) {
        // Use real Stripe client when API key is available
        stripe = new Stripe(apiKey, {
            apiVersion: "2023-10-16",
            typescript: true,
        });
    } else {
        // Use mock client for development/testing
        stripe = createMockStripe();
    }
} catch (error) {
    console.error('Error initializing Stripe:', error);
    // Fallback to mock client on error
    stripe = createMockStripe();
}

export { stripe }; 
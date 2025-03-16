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

// Stripe price IDs for different plans and billing cycles
export const STRIPE_PRICES = {
  BASIC: {
    monthly: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || 'price_basic_monthly',
    annually: process.env.STRIPE_BASIC_ANNUAL_PRICE_ID || 'price_basic_annual',
  },
  PRO: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
    annually: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
  },
  BUSINESS: {
    monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || 'price_business_monthly',
    annually: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID || 'price_business_annual',
  },
};

// Plan features and limits
export const PLAN_FEATURES = {
  FREE: {
    name: 'Free',
    price: { monthly: 0, annually: 0 },
    aiCreditsPerMonth: 20,
    socialAccounts: 1,
    scheduledPosts: 5,
    analyticsRetentionDays: 7,
    supportLevel: 'community',
    contentSuggestions: 5,
    customBranding: false,
    teamMembers: 0,
  },
  BASIC: {
    name: 'Basic',
    price: { monthly: 19, annually: 190 },
    aiCreditsPerMonth: 100,
    socialAccounts: 3,
    scheduledPosts: 30,
    analyticsRetentionDays: 30,
    supportLevel: 'email',
    contentSuggestions: 30,
    customBranding: false,
    teamMembers: 1,
  },
  PRO: {
    name: 'Pro',
    price: { monthly: 49, annually: 490 },
    aiCreditsPerMonth: 500,
    socialAccounts: 5,
    scheduledPosts: 100,
    analyticsRetentionDays: 90,
    supportLevel: 'priority',
    contentSuggestions: 100,
    customBranding: true,
    teamMembers: 3,
  },
  BUSINESS: {
    name: 'Business',
    price: { monthly: 99, annually: 990 },
    aiCreditsPerMonth: 2000,
    socialAccounts: 10,
    scheduledPosts: 500,
    analyticsRetentionDays: 365,
    supportLevel: 'dedicated',
    contentSuggestions: 500,
    customBranding: true,
    teamMembers: 10,
  },
};

// Helper functions for subscription management
export async function createCustomer(email: string, name: string, userId: string) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });
  
  return customer;
}

export async function getCustomerByUserId(userId: string) {
  const customers = await stripe.customers.list({
    limit: 1,
    email: userId,
  });
  
  return customers.data[0];
}

export async function createCheckoutSession(
  priceId: string,
  customerId: string,
  userId: string,
  plan: string,
  billingCycle: 'monthly' | 'annually',
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      plan,
      billingCycle,
    },
  });
  
  return session;
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  
  return session;
}

// Determine if a user has an active subscription
export function hasActiveSubscription(subscription: any): boolean {
  if (!subscription) return false;
  
  // Check if subscription is active
  if (subscription.status !== 'active') return false;
  
  // Check if the subscription period is still valid
  const currentPeriodEnd = new Date(subscription.stripeCurrentPeriodEnd);
  const now = new Date();
  
  return currentPeriodEnd > now;
}

// Get plan tier based on subscription
export function getUserPlanTier(subscription: any): 'FREE' | 'BASIC' | 'PRO' | 'BUSINESS' {
  if (!hasActiveSubscription(subscription)) return 'FREE';
  
  // Extract plan from subscription
  const plan = subscription.plan.toUpperCase();
  
  // Validate that the plan exists in our defined plans
  if (['BASIC', 'PRO', 'BUSINESS'].includes(plan)) {
    return plan as 'BASIC' | 'PRO' | 'BUSINESS';
  }
  
  return 'FREE';
} 
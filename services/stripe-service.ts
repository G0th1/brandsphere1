// Real Stripe integration for BrandSphereAI
import { loadStripe } from '@stripe/stripe-js';

export interface StripeCheckoutOptions {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  customerEmail?: string;
}

export interface StripeSubscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'trialing' | 'past_due';
  currentPeriodEnd: string; // ISO date string
  cancelAtPeriodEnd: boolean;
  plan: {
    id: string;
    nickname: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
}

// Product and price plans that correspond to production data in Stripe
export const STRIPE_PRICES = {
  // Free plan isn't needed in Stripe but we include it for complete data
  FREE: { 
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Manage up to 3 social media accounts',
      'Basic statistics and insights',
      'Manual content creation',
      'Up to 10 posts per month',
      'Email support',
    ]
  },
  PRO_MONTHLY: { 
    id: 'price_1QxXyyBlLmUFFk8vQVg2xtZl', // Updated with your real price ID
    name: 'Pro',
    price: 1900, // Cents: $19.00
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Manage up to 10 social media accounts',
      'Advanced statistics and insights',
      'AI-generated content suggestions',
      'Unlimited posts',
      'Post scheduling',
      'Priority support',
    ]
  },
  PRO_YEARLY: {
    id: 'price_yearly', // You should create this in your Stripe dashboard
    name: 'Pro (Yearly)',
    price: 19000, // Cents: $190.00
    currency: 'usd',
    interval: 'year' as const,
    features: [
      'Same features as Pro monthly plan',
      'Save 17% compared to monthly billing'
    ]
  }
};

// Initialize Stripe with publishable key from environment variables
// Never hardcode API keys in your source code
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export class StripeService {
  // Create a checkout session to pay with Stripe
  static async createCheckoutSession(options: StripeCheckoutOptions): Promise<{ url: string }> {
    try {
      // Call backend API to create a checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: options.priceId,
          successUrl: options.successUrl,
          cancelUrl: options.cancelUrl,
          customerEmail: options.customerEmail,
        }),
      });

      const session = await response.json();
      
      if (!session || !session.url) {
        throw new Error('Failed to create checkout session');
      }
      
      return { url: session.url };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw error;
    }
  }
  
  // Get a customer's active subscriptions
  static async getActiveSubscription(customerId: string): Promise<StripeSubscription | null> {
    try {
      const response = await fetch(`/api/stripe/get-subscription?customerId=${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch subscription');
      }
      
      return data.subscription;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }
  
  // Cancel a subscription
  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<{ success: boolean }> {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          cancelAtPeriodEnd,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
  
  // Create a portal link to manage subscriptions
  static async createCustomerPortalLink(customerId: string, returnUrl: string): Promise<{ url: string }> {
    try {
      const response = await fetch('/api/stripe/create-portal-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create portal link');
      }
      
      return { url: data.url };
    } catch (error) {
      console.error('Error creating customer portal link:', error);
      throw error;
    }
  }
}

export default StripeService; 
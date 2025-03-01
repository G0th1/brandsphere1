import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { StripeService, StripeSubscription } from './stripe-service';

// Define the subscription statuses
export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';

// Interface for the user's subscription details
export interface UserSubscription {
  status: SubscriptionStatus;
  plan: string;
  renewalDate?: Date;
  cancelAtPeriodEnd: boolean;
  isActive: boolean;
  features: string[];
}

// Default features for the free plan
const FREE_FEATURES = [
  'Manage up to 3 social media accounts',
  'Basic statistics and insights',
  'Manual content creation',
  'Up to 10 posts per month',
  'Email support',
];

// Default features for the pro plan
const PRO_FEATURES = [
  'Manage up to 10 social media accounts',
  'Advanced statistics and insights',
  'AI-generated content suggestions',
  'Unlimited posts',
  'Post scheduling',
  'Priority support',
];

export class SubscriptionService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClientComponentClient();
  }

  // Get the current user's subscription details
  async getUserSubscription(): Promise<UserSubscription> {
    try {
      // First, get the user
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Query the user's subscription from Supabase
      const { data, error } = await this.supabase
        .from('users')
        .select('subscription_status, stripe_subscription_id')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user subscription status:', error);
        return this.getDefaultSubscription('inactive');
      }
      
      // If the user has an active subscription, get more details from Stripe
      if (data.subscription_status === 'active' && data.stripe_subscription_id) {
        try {
          const stripeSubscription = await StripeService.getActiveSubscription(user.id);
          if (stripeSubscription) {
            return this.mapStripeSubscription(stripeSubscription);
          }
        } catch (stripeError) {
          console.error('Error fetching Stripe subscription:', stripeError);
        }
      }
      
      // Return the basic subscription based on status
      return this.getDefaultSubscription(data.subscription_status as SubscriptionStatus || 'inactive');
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return this.getDefaultSubscription('inactive');
    }
  }
  
  // Check if the user has access to pro features
  async hasProAccess(): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription();
      return subscription.isActive && subscription.plan !== 'free';
    } catch (error) {
      console.error('Error checking pro access:', error);
      return false;
    }
  }
  
  // Get the default subscription for a given status
  private getDefaultSubscription(status: SubscriptionStatus): UserSubscription {
    // For simplicity, we consider only active status as active
    const isActive = status === 'active' || status === 'trialing';
    
    // Default to free plan
    return {
      status,
      plan: 'free',
      cancelAtPeriodEnd: false,
      isActive,
      features: FREE_FEATURES,
    };
  }
  
  // Map a Stripe subscription to our UserSubscription format
  private mapStripeSubscription(subscription: StripeSubscription): UserSubscription {
    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    const plan = subscription.plan.nickname?.toLowerCase().includes('pro') ? 'pro' : 'free';
    
    return {
      status: subscription.status as SubscriptionStatus,
      plan,
      renewalDate: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : undefined,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      isActive,
      features: plan === 'pro' ? PRO_FEATURES : FREE_FEATURES,
    };
  }
}

export default new SubscriptionService(); 
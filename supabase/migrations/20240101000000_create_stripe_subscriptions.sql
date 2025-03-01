-- Add Stripe columns to auth.users table
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';

-- Create a table to store detailed subscription information
CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT,
  plan_name TEXT,
  amount INTEGER,
  currency TEXT,
  interval TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_id ON public.stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customer_id ON public.stripe_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscription_id ON public.stripe_subscriptions(stripe_subscription_id);

-- Add a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to the subscriptions table
DROP TRIGGER IF EXISTS update_stripe_subscriptions_updated_at ON public.stripe_subscriptions;
CREATE TRIGGER update_stripe_subscriptions_updated_at
BEFORE UPDATE ON public.stripe_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.stripe_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow service role to manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions"
ON public.stripe_subscriptions
USING (auth.role() = 'service_role'); 
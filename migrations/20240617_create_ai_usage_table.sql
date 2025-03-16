-- Create the ai_usage table to track usage of AI features
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_suggestions_count INTEGER DEFAULT 0,
    hashtag_suggestions_count INTEGER DEFAULT 0,
    post_analysis_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);

-- Add index on creation date for date range queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);

-- Add a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_ai_usage_updated_at
BEFORE UPDATE ON ai_usage
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a row level security policy to restrict access to own data
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage data"
    ON ai_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage data"
    ON ai_usage FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage data"
    ON ai_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON ai_usage TO authenticated;

-- Optional: Reset function to help with testing and development
CREATE OR REPLACE FUNCTION reset_monthly_ai_usage(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ai_usage
    SET content_suggestions_count = 0,
        hashtag_suggestions_count = 0,
        post_analysis_count = 0,
        updated_at = NOW()
    WHERE user_id = target_user_id
    AND created_at >= date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
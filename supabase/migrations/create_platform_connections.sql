-- Skapa platform_connections-tabellen för att lagra anslutningar till externa plattformar
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  platform_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Skapa en trigger för att uppdatera updated_at automatiskt
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger om den redan existerar för att undvika duplicering
DROP TRIGGER IF EXISTS update_platform_connections_timestamp ON platform_connections;

-- Skapa trigger för platform_connections
CREATE TRIGGER update_platform_connections_timestamp
BEFORE UPDATE ON platform_connections
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp(); 
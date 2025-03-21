import { neon, neonConfig } from '@neondatabase/serverless';
import { DATABASE_URL } from './database-url';

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineTLS = true;

// Create a SQL query executor
export const sql = neon(DATABASE_URL);

// Define user type for TypeScript
export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  name?: string;
}

/**
 * Test the database connection
 */
export async function testConnection() {
  try {
    console.log('Testing Neon database connection...');

    // Run a simple query to test connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('Connection test result:', result);

    // Test schema access
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('Available tables:', tables.map(t => t.table_name));

    // Check Users table
    const userCount = await sql`SELECT COUNT(*) as count FROM "Users"`;
    console.log('User count:', userCount);

    return {
      success: true,
      connectionTime: result[0].current_time,
      tables: tables.map(t => t.table_name),
      userCount: userCount[0].count
    };
  } catch (error) {
    console.error('Neon connection test failed:', error);
    throw error;
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    // First test connection
    try {
      await sql`SELECT 1`;
    } catch (connError) {
      console.error("❌ Neon DB: Connection test failed before getUserByEmail:", connError);
      throw new Error("Database connection failed");
    }

    const users = await sql<User[]>`
      SELECT id, email, password_hash, role, name
      FROM "Users"
      WHERE email = ${email}
    `;

    if (!users || users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error(`❌ Neon DB: Error retrieving user by email (${email}):`, error);
    // Propagate connection errors but handle other errors
    if (error instanceof Error && error.message.includes("connection")) {
      throw error;
    }
    return null;
  }
}

/**
 * Create a new user with subscription - simpler version without transaction
 */
export async function createUser(email: string, passwordHash: string, role: string = 'user'): Promise<User> {
  try {
    console.log('🔍 Starting user creation (non-transactional)...');

    // Test connection first
    try {
      const connTest = await sql`SELECT 1 as test`;
      console.log('✅ Connection test successful:', connTest);
    } catch (connError) {
      console.error('❌ Connection test failed:', connError);
      throw new Error('Database connection failed');
    }

    // Check for existing user
    console.log(`🔍 Checking if email already exists: ${email.substring(0, 3)}...`);
    const existingUsers = await sql`
      SELECT COUNT(*) as count FROM "Users" WHERE email = ${email}
    `;

    if (existingUsers[0].count > 0) {
      console.log('❌ Email already exists');
      throw new Error(`Email already registered: ${email}`);
    }

    console.log('✅ Email is available');

    // Generate UUID on the client-side to have better control
    const userId = crypto.randomUUID();
    console.log(`🔍 Generated user ID: ${userId}`);

    // Create user
    console.log('🔍 Creating user record...');
    try {
      await sql`
        INSERT INTO "Users" (
          id,
          email,
          password_hash,
          role,
          created_at
        ) VALUES (
          ${userId}::uuid,
          ${email},
          ${passwordHash},
          ${role},
          NOW()
        )
      `;
      console.log('✅ User created successfully');
    } catch (userError) {
      console.error('❌ Failed to create user:', userError);
      throw new Error('Failed to create user: ' + (userError instanceof Error ? userError.message : 'Unknown error'));
    }

    // Create subscription
    console.log('🔍 Creating subscription...');
    try {
      const subscriptionId = crypto.randomUUID();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      await sql`
        INSERT INTO "Subscriptions" (
          id,
          user_id,
          plan,
          status,
          start_date,
          end_date
        ) VALUES (
          ${subscriptionId}::uuid,
          ${userId}::uuid,
          'Free',
          'active',
          NOW()::date,
          ${oneYearFromNow.toISOString().split('T')[0]}::date
        )
      `;
      console.log('✅ Subscription created successfully');
    } catch (subError) {
      console.error('❌ Failed to create subscription:', subError);

      // We already created the user, so don't throw an error that would
      // make the client think the registration failed completely.
      // Just log the error and continue.
      console.warn('⚠️ User created but subscription failed. User ID:', userId);
    }

    // Return the user
    return {
      id: userId,
      email,
      password_hash: passwordHash,
      role
    };
  } catch (error) {
    console.error(`❌ Error in createUser:`, error);
    throw error;
  }
}

// Export the raw SQL function for direct usage
export { neon }; 
/**
 * Check database constraints
 */
require('dotenv').config({ path: '.env.production' });
const { neon } = require('@neondatabase/serverless');

async function checkConstraints() {
    console.log('🔍 Checking database constraints');

    const sql = neon(process.env.DATABASE_URL);

    try {
        // First check the Subscriptions table structure
        console.log('📋 Checking Subscriptions table...');
        const tableInfo = await sql`
      SELECT column_name, data_type, column_default, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Subscriptions'
    `;

        console.log('Table structure:');
        console.log(tableInfo);

        // Check constraints
        console.log('\n📋 Checking constraints...');
        const constraints = await sql`
      SELECT constraint_name, constraint_type, table_name
      FROM information_schema.table_constraints
      WHERE table_name = 'Subscriptions'
    `;

        console.log('Constraints:');
        console.log(constraints);

        // Check check constraints for the plan column
        console.log('\n📋 Checking all check constraints...');
        const checkConstraints = await sql`
      SELECT 
        conname as constraint_name, 
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint
      WHERE conrelid = 'Subscriptions'::regclass 
      AND contype = 'c'
    `;

        console.log('Check constraints:');
        console.log(checkConstraints);

        // Check specific constraint
        console.log('\n📋 Checking plan constraint specifically...');
        const planConstraint = await sql`
      SELECT 
        conname as constraint_name, 
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint
      WHERE conrelid = 'Subscriptions'::regclass 
      AND conname = 'Subscriptions_plan_check'
    `;

        console.log('Plan constraint:');
        console.log(planConstraint);

        // Check enum values directly
        console.log('\n📋 Checking existing subscription plans...');
        const existingPlans = await sql`
      SELECT DISTINCT plan FROM "Subscriptions"
    `;

        console.log('Existing plans:');
        console.log(existingPlans);

    } catch (error) {
        console.error('❌ Error checking constraints:', error);
    }

    console.log('\n✅ Check completed');
}

checkConstraints(); 
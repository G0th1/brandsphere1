#!/usr/bin/env node

/**
 * Database Schema Checking Tool
 * 
 * This script checks the schema of the Users table to understand exactly what
 * columns are available for authentication queries.
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ ERROR: DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    try {
        console.log('🔐 Connecting to database...');
        const sql = neon(process.env.DATABASE_URL);

        // Test connection
        const testResult = await sql`SELECT 1 as test`;
        console.log(`✅ Database connection successful\n`);

        // Get schema for Users table
        console.log('📊 Getting Users table schema...');
        const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'Users'
      ORDER BY ordinal_position
    `;

        console.log(`Found ${columns.length} columns in Users table:\n`);

        // Display columns in a formatted way
        console.log('| Column Name | Data Type | Nullable | Default Value |');
        console.log('|-------------|-----------|----------|---------------|');

        columns.forEach(col => {
            console.log(`| ${col.column_name.padEnd(11)} | ${col.data_type.padEnd(9)} | ${col.is_nullable.padEnd(8)} | ${(col.column_default || '').toString().padEnd(13)} |`);
        });

        // Get a sample user to see actual data
        console.log('\n🧪 Fetching a sample user record...');
        const users = await sql`
      SELECT * FROM "Users" LIMIT 1
    `;

        if (users.length > 0) {
            console.log('\nSample user data (field names only):');
            console.log(Object.keys(users[0]).join(', '));
        } else {
            console.log('No users found in the database.');
        }

        // Get total row count for each table
        console.log('\n📊 Table row counts:');
        const tables = ['Users', 'Businesses', 'Subscriptions', 'AI_Generated_Content', 'Usage_Logs'];

        for (const table of tables) {
            try {
                const count = await sql`
          SELECT COUNT(*) as count FROM "${table}"
        `;
                console.log(`${table}: ${count[0].count} rows`);
            } catch (err) {
                console.log(`${table}: Error counting rows - ${err.message}`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main(); 
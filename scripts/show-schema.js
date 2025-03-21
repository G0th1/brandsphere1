/**
 * Script to show the database schema
 */
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.production' });

async function showDatabaseSchema() {
    console.log('Retrieving database schema...');

    const dbUrl = process.env.DATABASE_URL;
    console.log(`Database URL: ${dbUrl ? dbUrl.substring(0, 20) + '...' : 'undefined'}`);

    try {
        const sql = neon(dbUrl);

        // Get all tables
        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

        console.log('\nFound tables:');
        for (const table of tables) {
            console.log(`\n📋 TABLE: ${table.table_name}`);

            // Get columns for this table
            const columns = await sql`
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'public' AND 
          table_name = ${table.table_name}
        ORDER BY 
          ordinal_position;
      `;

            console.log('Columns:');
            columns.forEach(col => {
                console.log(`  - ${col.column_name} (${col.data_type})${col.is_nullable === 'YES' ? ' NULL' : ' NOT NULL'}${col.column_default ? ' DEFAULT: ' + col.column_default : ''}`);
            });

            // Get constraints (primary keys, etc.)
            const constraints = await sql`
        SELECT
          con.conname AS constraint_name,
          con.contype AS constraint_type,
          CASE
            WHEN con.contype = 'p' THEN 'PRIMARY KEY'
            WHEN con.contype = 'f' THEN 'FOREIGN KEY'
            WHEN con.contype = 'u' THEN 'UNIQUE'
            ELSE con.contype::text
          END AS constraint_description,
          array_to_string(array_agg(col.attname), ', ') AS columns
        FROM
          pg_constraint con
          JOIN pg_class tbl ON tbl.oid = con.conrelid
          JOIN pg_namespace ns ON ns.oid = tbl.relnamespace
          JOIN pg_attribute col ON col.attrelid = tbl.oid AND col.attnum = ANY(con.conkey)
        WHERE
          ns.nspname = 'public' AND
          tbl.relname = ${table.table_name}
        GROUP BY
          con.conname, con.contype
        ORDER BY
          con.contype, con.conname;
      `;

            if (constraints.length > 0) {
                console.log('Constraints:');
                constraints.forEach(con => {
                    console.log(`  - ${con.constraint_description} (${con.columns})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error retrieving schema:', error);
    }
}

// Run the function
showDatabaseSchema()
    .then(() => console.log('\n✨ Schema retrieval completed'))
    .catch(err => console.error('Schema retrieval failed:', err)); 
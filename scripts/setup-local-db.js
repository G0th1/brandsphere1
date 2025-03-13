// This script sets up local database environment variables for development
const fs = require('fs');
const path = require('path');

// Simple SQLite setup for local development
const envContent = `
# Local SQLite Database URL
DATABASE_URL="file:./dev.db"

# Next Auth settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret-key-doesnt-need-to-be-secure-locally
`;

// Write to .env.local file
const envPath = path.join(process.cwd(), '.env.local');

try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Created .env.local file with local database configuration');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npx prisma generate');
    console.log('2. Run: npx prisma db push');
    console.log('3. Start your development server: npm run dev');
} catch (error) {
    console.error('Error writing .env.local file:', error);
    process.exit(1);
} 
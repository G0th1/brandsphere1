/**
 * FIX-AUTH - Skript för att lösa vanliga inloggningsproblem
 * 
 * Detta skript diagnostiserar och åtgärdar vanliga inloggningsproblem 
 * genom att återställa sessioner, rensa cache och verifiera konfiguration.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

console.log(`
====================================================
🔄 INLOGGNINGSSYSTEM ÅTERSTÄLLNING 🔄
====================================================
`);

(async () => {
    const prisma = new PrismaClient();

    try {
        console.log('STEG 1: KONTROLLERAR DATABASANSLUTNING');
        console.log('------------------------------------');
        await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Databasanslutning OK');

        console.log('\nSTEG 2: RENSAR GAMLA SESSIONER');
        console.log('-----------------------------');
        const result = await prisma.session.deleteMany({});
        console.log(`✅ Alla gamla sessioner borttagna (${result.count} st)`);

        console.log('\nSTEG 3: VERIFIERAR KRITISKA KONFIGURATIONER');
        console.log('----------------------------------------');

        // Kontrollera .env-filen
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');

            // Kontrollera NEXTAUTH_URL
            if (!envContent.includes('NEXTAUTH_URL=')) {
                console.log('⚠️ NEXTAUTH_URL saknas i .env-filen - lägger till standardvärde');
                fs.appendFileSync(envPath, '\nNEXTAUTH_URL=http://localhost:3000\n');
            } else {
                console.log('✅ NEXTAUTH_URL finns i .env-filen');
            }

            // Kontrollera NEXTAUTH_SECRET
            if (!envContent.includes('NEXTAUTH_SECRET=')) {
                console.log('⚠️ NEXTAUTH_SECRET saknas i .env-filen - lägger till ett slumpmässigt värde');
                const randomSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                fs.appendFileSync(envPath, `\nNEXTAUTH_SECRET=${randomSecret}\n`);
            } else {
                console.log('✅ NEXTAUTH_SECRET finns i .env-filen');
            }
        } else {
            console.log('⚠️ Ingen .env-fil hittades - skapar en minimal .env-fil');
            const randomSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            fs.writeFileSync(envPath,
                `NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${randomSecret}
`);
        }

        console.log('\nSTEG 4: SKAPAR/ÅTERSTÄLLER TESTANVÄNDARE');
        console.log('--------------------------------------');

        const testEmail = 'test@example.com';
        const testPassword = 'Password123';

        // Hitta eller skapa testanvändare
        let user = await prisma.user.findUnique({
            where: { email: testEmail },
        });

        if (user) {
            console.log(`🔄 Testanvändare med e-post ${testEmail} finns redan - uppdaterar lösenord`);

            // Uppdatera användaren med nytt lösenord
            const hashedPassword = await bcrypt.hash(testPassword, 10);
            user = await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
        } else {
            console.log(`🔄 Skapar ny testanvändare: ${testEmail}`);

            // Skapa ny användare
            const hashedPassword = await bcrypt.hash(testPassword, 10);
            user = await prisma.user.create({
                data: {
                    name: 'Test User',
                    email: testEmail,
                    password: hashedPassword,
                    emailVerified: new Date(),
                }
            });
        }

        // Kontrollera om användaren har en prenumeration
        const subscription = await prisma.subscription.findFirst({
            where: { userId: user.id }
        });

        if (!subscription) {
            console.log('🔄 Skapar prenumeration för testanvändaren');
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    plan: 'Free',
                    status: 'active',
                    billingCycle: 'monthly'
                }
            });
        } else {
            console.log('✅ Testanvändaren har redan en prenumeration');
        }

        console.log('\n✅ AUTENTISERINGSSYSTEM ÅTERSTÄLLT');
        console.log('===============================');
        console.log(`Du kan nu logga in med följande uppgifter:`);
        console.log(`- E-post: ${testEmail}`);
        console.log(`- Lösenord: ${testPassword}`);
        console.log('\nEfter återställning, starta om servern med:');
        console.log('npm run dev');

    } catch (error) {
        console.error('❌ Kunde inte återställa autentiseringssystemet:', error);
    } finally {
        await prisma.$disconnect();
    }
})(); 
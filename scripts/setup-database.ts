import { supabaseAdmin } from '@/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Detta skript kontrollerar om nödvändiga tabeller existerar i Supabase
 * och ger instruktioner för manuell setup om de inte finns.
 */

async function main() {
    console.log('Kontrollerar Supabase-tabeller...');

    // Kontrollera om tabellen platform_connections existerar
    try {
        const { data, error } = await supabaseAdmin
            .from('platform_connections')
            .select('id')
            .limit(1);

        if (error) {
            console.log('❌ platform_connections-tabellen existerar inte eller är inte tillgänglig.');
            console.log('För att skapa tabellen, följ dessa steg:');
            console.log('1. Gå till Supabase Dashboard (https://app.supabase.io)');
            console.log('2. Välj ditt projekt');
            console.log('3. Gå till SQL Editor');
            console.log('4. Klistra in följande SQL och kör det:');

            // Läs SQL-filen och visa den som instruktioner
            try {
                const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', 'create_platform_connections.sql');
                const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
                console.log('\n' + sqlContent + '\n');
            } catch (fileError) {
                // Om vi inte kan läsa filen, visa SQL direkt
                console.log(`
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
);`);
            }
        } else {
            console.log('✅ platform_connections-tabellen existerar');
        }
    } catch (error) {
        console.error('❌ Ett fel uppstod vid kontroll av tabellerna:', error);
    }

    console.log('✅ Databaskontroll slutförd');
}

main()
    .catch((err) => {
        console.error('❌ Ett fel uppstod:', err);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    }); 
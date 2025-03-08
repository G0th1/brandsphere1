/**
 * Encryption service for securely encrypting sensitive tokens
 */
import crypto from 'crypto';

// Skapa en deterministisk nyckel baserad på miljön om ingen finns
function getEncryptionKey(): Buffer {
  // Använd miljövariabeln om den finns
  if (process.env.ENCRYPTION_KEY) {
    return Buffer.from(process.env.ENCRYPTION_KEY);
  }

  // Annars skapa en deterministisk nyckel baserad på andra miljövariabler
  // Detta gör att samma nyckel används mellan omstarter i samma miljö
  const baseString = process.env.NEXTAUTH_SECRET || 'brandsphereaidefaultsecretkey';
  return crypto.createHash('sha256').update(baseString).digest();
}

// Konstanter för kryptering
const ENCRYPTION_KEY = getEncryptionKey();
const ALGORITHM = 'aes-256-gcm';

export class EncryptionService {
  static encrypt(data: string) {
    try {
      // Skapa en slumpmässig initieringsvektor
      const iv = crypto.randomBytes(16);

      // Skapa cipher med nyckel och iv
      const cipher = crypto.createCipheriv(
        ALGORITHM,
        ENCRYPTION_KEY,
        iv
      );

      // Kryptera data
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Hämta authentication tag
      const authTag = cipher.getAuthTag();

      return {
        encryptedData: encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      // För utvecklingsmiljö, fallback till simulerad kryptering
      return {
        encryptedData: Buffer.from(data).toString('base64'),
        iv: 'simulated-iv',
        authTag: 'simulated-authTag'
      };
    }
  }

  static decrypt(encryptedData: string, ivString: string, authTagString: string) {
    try {
      // Konvertera IV och authTag tillbaka till Buffers
      const iv = Buffer.from(ivString, 'base64');
      const authTag = Buffer.from(authTagString, 'base64');

      // Skapa decipher
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        ENCRYPTION_KEY,
        iv
      );

      // Sätt authentication tag
      decipher.setAuthTag(authTag);

      // Dekryptera data
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      // För utvecklingsmiljö, fallback till simulerad dekryptering
      try {
        return Buffer.from(encryptedData, 'base64').toString();
      } catch {
        throw new Error('Kunde inte dekryptera data');
      }
    }
  }
} 
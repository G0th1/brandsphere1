import { createTransport, TransportOptions } from "nodemailer";
import { getBaseUrl } from "@/lib/utils";
import { SendVerificationRequestParams } from "next-auth/providers/email";

// Konfigurera e-postprovider baserat på miljövariabler
const provider = {
  server: {
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  },
  from: process.env.EMAIL_FROM,
};

// Skapa en nodemailer-transport
const transporter = createTransport(provider.server as TransportOptions);

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier: email, url, provider } = params;
  const { host } = new URL(url);

  // Anpassa ämnesraden baserat på ditt varumärke
  const subject = `Logga in på BrandSphereAI`;

  // Skapa HTML-innehåll för e-postmeddelandet
  const html = `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Logga in på ditt konto</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #0070f3;
        }
        .button {
          background-color: #0070f3;
          color: white !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          display: inline-block;
          font-weight: 500;
          text-align: center;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BrandSphereAI</div>
        </div>
        
        <p>Hej,</p>
        <p>Klicka på knappen nedan för att logga in på ditt BrandSphereAI-konto.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" class="button">Logga in</a>
        </div>
        
        <p>Eller kopiera och klistra in denna URL i din webbläsare:</p>
        <p style="overflow-wrap: break-word; word-wrap: break-word; word-break: break-all;">${url}</p>
        
        <p>Om du inte begärde denna e-post kan du ignorera den.</p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} BrandSphereAI. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Skapa textversion som alternativ för e-postklienter som inte stöder HTML
  const text = `
    Logga in på BrandSphereAI
    
    Hej,
    
    Klicka på länken nedan för att logga in på ditt BrandSphereAI-konto:
    ${url}
    
    Om du inte begärde denna e-post kan du ignorera den.
    
    © ${new Date().getFullYear()} BrandSphereAI. Alla rättigheter förbehållna.
  `;

  try {
    // Skicka e-postmeddelandet
    await transporter.sendMail({
      to: email,
      from: provider.from,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("SMTP error sending email:", error);
    throw new Error(`Det gick inte att skicka verifieringsmeddelandet till ${email}`);
  }
} 
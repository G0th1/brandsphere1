// Denna fil innehåller funktioner för att skicka e-postmeddelanden om betalnings- och prenumerationshändelser
// I en riktig implementering skulle du använda en e-posttjänst som SendGrid, Mailgun, etc.

// Importera e-post-mallar
import { FailedPaymentEmail } from './templates/failed-payment';
import { SubscriptionCancelledEmail } from './templates/subscription-cancelled';
import { SubscriptionRenewedEmail } from './templates/subscription-renewed';

// Översättningar för e-postmeddelanden
const translations = {
    en: {
        failedPayment: {
            subject: 'Payment Failed - Action Required'
        },
        subscriptionCancelled: {
            subject: 'Your subscription has been cancelled'
        },
        subscriptionRenewed: {
            subject: 'Your subscription has been renewed'
        }
    },
    sv: {
        failedPayment: {
            subject: 'Betalning misslyckades - Åtgärd krävs'
        },
        subscriptionCancelled: {
            subject: 'Din prenumeration har avslutats'
        },
        subscriptionRenewed: {
            subject: 'Din prenumeration har förnyats'
        }
    }
};

// Mock-implementering av render
// I en fullständig implementation behöver du installera @react-email/render
function render(component: any): string {
    // I en riktig implementation skulle detta konvertera React-komponenten till HTML
    // För mockens ändamål, returnera bara ett platshållarmeddelande
    return '<div>Simulated email - in a real implementation this would be HTML</div>';
}

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Sends an email via your preferred email service
 * This is a placeholder to be replaced with an actual email service
 */
async function sendEmail({ to, subject, html }: SendEmailOptions) {
    // For demo purposes, we just log the email content
    console.log(`-------- EMAIL TO: ${to} --------`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT: ${html}`);
    console.log('-------- END OF EMAIL --------');

    // In production, you would use an actual email service, for example:
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'support@brandsphereai.com', name: 'BrandSphereAI Support' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    */

    // Return a dummy successful response for demo purposes
    return { success: true, id: `email_${Date.now()}` };
}

/**
 * Sends a notification about a failed payment
 */
export async function sendFailedPaymentNotification({
    email,
    customerName,
    invoiceId,
    amount,
    paymentMethod,
    failureReason,
    retryLink,
    language = 'en',
}: {
    email: string;
    customerName: string;
    invoiceId: string;
    amount: number;
    paymentMethod: string;
    failureReason: string;
    retryLink: string;
    language?: 'en' | 'sv';
}) {
    const subject = translations[language].failedPayment.subject;

    const html = render(
        FailedPaymentEmail({
            customerName,
            invoiceId,
            amount,
            paymentMethod,
            failureReason,
            retryLink,
            language,
        })
    );

    return sendEmail({
        to: email,
        subject,
        html,
    });
}

/**
 * Sends a confirmation of a cancelled subscription
 */
export async function sendSubscriptionCancelledNotification({
    email,
    customerName,
    planName,
    endDate,
    language = 'en',
}: {
    email: string;
    customerName: string;
    planName: string;
    endDate: Date;
    language?: 'en' | 'sv';
}) {
    const subject = translations[language].subscriptionCancelled.subject;

    const html = render(
        SubscriptionCancelledEmail({
            customerName,
            planName,
            endDate,
            language,
        })
    );

    return sendEmail({
        to: email,
        subject,
        html,
    });
}

/**
 * Sends a confirmation of a renewed subscription
 */
export async function sendSubscriptionRenewedNotification({
    email,
    customerName,
    planName,
    nextBillingDate,
    amount,
    language = 'en',
}: {
    email: string;
    customerName: string;
    planName: string;
    nextBillingDate: Date;
    amount: number;
    language?: 'en' | 'sv';
}) {
    const subject = translations[language].subscriptionRenewed.subject;

    const html = render(
        SubscriptionRenewedEmail({
            customerName,
            planName,
            nextBillingDate,
            amount,
            language,
        })
    );

    return sendEmail({
        to: email,
        subject,
        html,
    });
} 
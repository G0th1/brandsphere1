import React from 'react';

const translations = {
    en: {
        title: 'Subscription Renewed',
        greeting: 'Hello',
        message1: 'Your BrandSphereAI subscription has been successfully renewed!',
        subscriptionDetails: 'Subscription Details',
        plan: 'Plan',
        amount: 'Amount',
        nextBillingDate: 'Next billing date',
        message2: 'Thank you for continuing your journey with BrandSphereAI. You now have uninterrupted access to all the premium features included in your plan.',
        manageSubscription: 'Manage Subscription',
        manageText: 'You can view or manage your subscription at any time from your account settings:',
        buttonText: 'Manage Subscription',
        supportText: 'If you need any assistance, please contact our support team.',
        thanks: 'Thank you for your continued support,',
        teamName: 'The BrandSphereAI Team',
        footerText: 'If you did not expect this renewal or have any questions, please contact us at support@brandsphereai.com'
    },
    sv: {
        title: 'Prenumeration Förnyad',
        greeting: 'Hej',
        message1: 'Din BrandSphereAI-prenumeration har förnyats framgångsrikt!',
        subscriptionDetails: 'Prenumerationsinformation',
        plan: 'Plan',
        amount: 'Belopp',
        nextBillingDate: 'Nästa faktureringsdatum',
        message2: 'Tack för att du fortsätter din resa med BrandSphereAI. Du har nu oavbruten tillgång till alla premiumfunktioner som ingår i din plan.',
        manageSubscription: 'Hantera Prenumeration',
        manageText: 'Du kan när som helst visa eller hantera din prenumeration från dina kontoinställningar:',
        buttonText: 'Hantera Prenumeration',
        supportText: 'Om du behöver hjälp, kontakta vårt supportteam.',
        thanks: 'Tack för ditt fortsatta stöd,',
        teamName: 'BrandSphereAI-teamet',
        footerText: 'Om du inte förväntade dig denna förnyelse eller har frågor, kontakta oss på support@brandsphereai.com'
    }
};

interface SubscriptionRenewedEmailProps {
    customerName: string;
    planName: string;
    nextBillingDate: Date;
    amount: number;
    language?: 'en' | 'sv';
}

export const SubscriptionRenewedEmail: React.FC<SubscriptionRenewedEmailProps> = ({
    customerName,
    planName,
    nextBillingDate,
    amount,
    language = 'en',
}) => {
    const t = translations[language];
    const formattedNextBillingDate = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(nextBillingDate);

    const formattedAmount = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'sv-SE', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

    // URL för att hantera prenumerationen
    const manageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings/subscription`;

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#f8f8f8', padding: '20px', textAlign: 'center' as const }}>
                <img
                    src="https://www.example.com/logo.png"
                    alt="BrandSphereAI"
                    style={{ maxHeight: '60px', margin: '0 auto' }}
                />
            </div>

            <div style={{ padding: '20px' }}>
                <h1 style={{ color: '#38a169', fontSize: '24px', marginBottom: '20px' }}>{t.title}</h1>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.greeting} {customerName},
                </p>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.message1}
                </p>

                <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{t.subscriptionDetails}</h2>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.plan}:</strong> {planName}</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.amount}:</strong> {formattedAmount}</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.nextBillingDate}:</strong> {formattedNextBillingDate}</p>
                </div>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.message2}
                </p>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{t.manageSubscription}</h2>
                    <p style={{ fontSize: '14px', marginBottom: '20px' }}>{t.manageText}</p>

                    <div style={{ textAlign: 'center' as const, marginTop: '20px', marginBottom: '20px' }}>
                        <a
                            href={manageUrl}
                            style={{
                                backgroundColor: '#0070f3',
                                color: 'white',
                                padding: '12px 24px',
                                textDecoration: 'none',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                display: 'inline-block'
                            }}
                        >
                            {t.buttonText}
                        </a>
                    </div>
                </div>

                <p style={{ fontSize: '14px', marginBottom: '10px' }}>{t.supportText}</p>

                <p style={{ fontSize: '14px', marginTop: '30px' }}>
                    {t.thanks}<br />
                    {t.teamName}
                </p>
            </div>

            <div style={{ backgroundColor: '#f8f8f8', padding: '15px', textAlign: 'center' as const, fontSize: '12px', color: '#666' }}>
                <p>{t.footerText}</p>
            </div>
        </div>
    );
}; 
import React from 'react';

const translations = {
    en: {
        title: 'Subscription Cancelled',
        greeting: 'Hello',
        message1: 'Your BrandSphereAI subscription has been cancelled as requested.',
        subscriptionDetails: 'Subscription Details',
        plan: 'Plan',
        endDate: 'Access until',
        message2: 'You will continue to have access to all features of your plan until the end date shown above. After this date, your account will be automatically downgraded to the free plan.',
        reactivate: 'Want to reactivate?',
        reactivateText: 'If you change your mind, you can reactivate your subscription at any time before the end date to continue without interruption:',
        buttonText: 'Reactivate Subscription',
        supportText: 'If you need any assistance, please contact our support team.',
        thanks: 'Thank you for trying BrandSphereAI,',
        teamName: 'The BrandSphereAI Team',
        footerText: 'If you did not cancel your BrandSphereAI subscription, please contact us immediately at support@brandsphereai.com'
    },
    sv: {
        title: 'Prenumeration Avslutad',
        greeting: 'Hej',
        message1: 'Din BrandSphereAI-prenumeration har avslutats enligt begäran.',
        subscriptionDetails: 'Prenumerationsinformation',
        plan: 'Plan',
        endDate: 'Tillgång till',
        message2: 'Du kommer fortsätta ha tillgång till alla funktioner i din plan fram till slutdatumet som visas ovan. Efter detta datum kommer ditt konto automatiskt att nedgraderas till gratisplanen.',
        reactivate: 'Vill du återaktivera?',
        reactivateText: 'Om du ändrar dig kan du återaktivera din prenumeration när som helst före slutdatumet för att fortsätta utan avbrott:',
        buttonText: 'Återaktivera Prenumeration',
        supportText: 'Om du behöver hjälp, kontakta vårt supportteam.',
        thanks: 'Tack för att du provade BrandSphereAI,',
        teamName: 'BrandSphereAI-teamet',
        footerText: 'Om du inte avslutade din BrandSphereAI-prenumeration, kontakta oss omedelbart på support@brandsphereai.com'
    }
};

interface SubscriptionCancelledEmailProps {
    customerName: string;
    planName: string;
    endDate: Date;
    language?: 'en' | 'sv';
}

export const SubscriptionCancelledEmail: React.FC<SubscriptionCancelledEmailProps> = ({
    customerName,
    planName,
    endDate,
    language = 'en',
}) => {
    const t = translations[language];
    const formattedEndDate = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(endDate);

    // URL för att återaktivera prenumerationen
    const reactivateUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings/subscription`;

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
                <h1 style={{ color: '#4a5568', fontSize: '24px', marginBottom: '20px' }}>{t.title}</h1>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.greeting} {customerName},
                </p>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.message1}
                </p>

                <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{t.subscriptionDetails}</h2>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.plan}:</strong> {planName}</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.endDate}:</strong> {formattedEndDate}</p>
                </div>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.message2}
                </p>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{t.reactivate}</h2>
                    <p style={{ fontSize: '14px', marginBottom: '20px' }}>{t.reactivateText}</p>

                    <div style={{ textAlign: 'center' as const, marginTop: '20px', marginBottom: '20px' }}>
                        <a
                            href={reactivateUrl}
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
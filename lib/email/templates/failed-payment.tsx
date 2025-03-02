import React from 'react';

const translations = {
    en: {
        title: 'Payment Failed',
        greeting: 'Hello',
        message1: 'We were unable to process your payment for your BrandSphereAI subscription.',
        paymentDetails: 'Payment Details',
        invoice: 'Invoice',
        amount: 'Amount',
        paymentMethod: 'Payment Method',
        reasonTitle: 'Reason for Failure',
        actionNeeded: 'Action Needed',
        actionText: 'To keep your subscription active, please update your payment information or try a different payment method by clicking the button below:',
        buttonText: 'Update Payment Method',
        supportText: 'If you need any assistance, please contact our support team.',
        thanks: 'Thank you,',
        teamName: 'The BrandSphereAI Team',
        footerText: 'If you did not sign up for a BrandSphereAI account, please ignore this email or contact us at support@brandsphereai.com'
    },
    sv: {
        title: 'Betalning Misslyckades',
        greeting: 'Hej',
        message1: 'Vi kunde inte behandla din betalning för din BrandSphereAI-prenumeration.',
        paymentDetails: 'Betalningsinformation',
        invoice: 'Faktura',
        amount: 'Belopp',
        paymentMethod: 'Betalningsmetod',
        reasonTitle: 'Orsak till misslyckandet',
        actionNeeded: 'Åtgärd krävs',
        actionText: 'För att hålla din prenumeration aktiv, vänligen uppdatera din betalningsinformation eller prova en annan betalningsmetod genom att klicka på knappen nedan:',
        buttonText: 'Uppdatera betalningsmetod',
        supportText: 'Om du behöver hjälp, kontakta vårt supportteam.',
        thanks: 'Tack,',
        teamName: 'BrandSphereAI-teamet',
        footerText: 'Om du inte registrerade dig för ett BrandSphereAI-konto, ignorera detta e-postmeddelande eller kontakta oss på support@brandsphereai.com'
    }
};

interface FailedPaymentEmailProps {
    customerName: string;
    invoiceId: string;
    amount: number;
    paymentMethod: string;
    failureReason: string;
    retryLink: string;
    language?: 'en' | 'sv';
}

export const FailedPaymentEmail: React.FC<FailedPaymentEmailProps> = ({
    customerName,
    invoiceId,
    amount,
    paymentMethod,
    failureReason,
    retryLink,
    language = 'en',
}) => {
    const t = translations[language];
    const formattedAmount = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'sv-SE', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

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
                <h1 style={{ color: '#e53e3e', fontSize: '24px', marginBottom: '20px' }}>{t.title}</h1>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.greeting} {customerName},
                </p>

                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                    {t.message1}
                </p>

                <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{t.paymentDetails}</h2>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.invoice}:</strong> {invoiceId}</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.amount}:</strong> {formattedAmount}</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>{t.paymentMethod}:</strong> {paymentMethod}</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{t.reasonTitle}</h2>
                    <p style={{ fontSize: '14px' }}>{failureReason}</p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{t.actionNeeded}</h2>
                    <p style={{ fontSize: '14px', marginBottom: '20px' }}>{t.actionText}</p>

                    <div style={{ textAlign: 'center' as const, marginTop: '20px', marginBottom: '20px' }}>
                        <a
                            href={retryLink}
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
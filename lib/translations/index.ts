import { Language } from '@/contexts/language-context';

// Definiera en typ för översättningar som kan användas i hela applikationen
export type Translations<T> = Record<Language, T>;

// Allmänna översättningar som används på hela webbplatsen
export const commonTranslations: Translations<{
    siteTitle: string;
    navigation: {
        home: string;
        features: string;
        pricing: string;
        blog: string;
        contact: string;
        appPromote: string;
        login: string;
        signup: string;
        dashboard: string;
        logout: string;
        language: string;
    };
    buttons: {
        getStarted: string;
        learnMore: string;
        seeAll: string;
        viewPricing: string;
        contactUs: string;
        tryForFree: string;
        readMore: string;
        closeMenu: string;
        openMenu: string;
    };
    footer: {
        aboutUs: string;
        products: string;
        resources: string;
        legal: string;
        copyright: string;
    };
}> = {
    en: {
        siteTitle: 'BrandSphereAI - Manage Your Social Media Smarter',
        navigation: {
            home: 'Home',
            features: 'Features',
            pricing: 'Pricing',
            blog: 'Blog',
            contact: 'Contact',
            appPromote: 'Promote us',
            login: 'Log in',
            signup: 'Sign up',
            dashboard: 'Dashboard',
            logout: 'Log out',
            language: 'Language',
        },
        buttons: {
            getStarted: 'Get Started',
            learnMore: 'Learn More',
            seeAll: 'See All',
            viewPricing: 'View Pricing',
            contactUs: 'Contact Us',
            tryForFree: 'Try For Free',
            readMore: 'Read More',
            closeMenu: 'Close menu',
            openMenu: 'Open menu',
        },
        footer: {
            aboutUs: 'About Us',
            products: 'Products',
            resources: 'Resources',
            legal: 'Legal',
            copyright: '© 2025 BrandSphereAI. All rights reserved.',
        },
    },
    sv: {
        siteTitle: 'BrandSphereAI - Hantera dina sociala medier smartare',
        navigation: {
            home: 'Hem',
            features: 'Funktioner',
            pricing: 'Priser',
            blog: 'Blogg',
            contact: 'Kontakt',
            appPromote: 'Marknadsför oss',
            login: 'Logga in',
            signup: 'Registrera',
            dashboard: 'Kontrollpanel',
            logout: 'Logga ut',
            language: 'Språk',
        },
        buttons: {
            getStarted: 'Kom igång',
            learnMore: 'Läs mer',
            seeAll: 'Se alla',
            viewPricing: 'Visa priser',
            contactUs: 'Kontakta oss',
            tryForFree: 'Prova gratis',
            readMore: 'Läs mer',
            closeMenu: 'Stäng meny',
            openMenu: 'Öppna meny',
        },
        footer: {
            aboutUs: 'Om oss',
            products: 'Produkter',
            resources: 'Resurser',
            legal: 'Juridiskt',
            copyright: '© 2024 BrandSphereAI. Alla rättigheter förbehållna.',
        },
    },
};

// Startsidans översättningar
export const homeTranslations: Translations<{
    hero: {
        title: string;
        subtitle: string;
        getStarted: string;
        viewPricing: string;
        tryDemo: string;
        freeTrial: string;
        noCardRequired: string;
        cancelAnytime: string;
        dashboardAlt: string;
    };
    features: {
        title: string;
        subtitle: string;
        items: Array<{
            title: string;
            description: string;
        }>;
    };
    testimonials: {
        title: string;
        items: Array<{
            quote: string;
            author: string;
            company: string;
        }>;
    };
    cta: {
        title: string;
        subtitle: string;
        buttonText: string;
    };
}> = {
    en: {
        hero: {
            title: 'Manage Social Media Smarter with AI',
            subtitle: 'Save time and create better content with our intelligent social media platform.',
            getStarted: 'Get Started Free',
            viewPricing: 'View Pricing',
            tryDemo: 'Try as Premium',
            freeTrial: 'Free Trial',
            noCardRequired: 'No Credit Card Required',
            cancelAnytime: 'Cancel Anytime',
            dashboardAlt: 'BrandSphereAI Dashboard Demo',
        },
        features: {
            title: 'Everything you need to succeed on social media',
            subtitle: 'Our platform combines AI with easy-to-use tools to help you create, schedule, and analyze content.',
            items: [
                {
                    title: 'AI Content Creation',
                    description: 'Generate engaging posts tailored to your brand voice and audience.',
                },
                {
                    title: 'Smart Scheduling',
                    description: 'Post at the perfect time with our optimized scheduling algorithm.',
                },
                {
                    title: 'Comprehensive Analytics',
                    description: 'Understand what works with powerful performance metrics.',
                },
                {
                    title: 'Multi-Platform Support',
                    description: 'Manage all your social accounts from one dashboard.',
                },
            ],
        },
        testimonials: {
            title: 'Trusted by social media managers worldwide',
            items: [
                {
                    quote: 'BrandSphereAI has completely transformed our social media strategy. We save hours every week!',
                    author: 'Sarah Johnson',
                    company: 'Marketing Director, TechStart',
                },
                {
                    quote: 'The AI-generated content is incredibly on-brand. Our engagement has increased by 40%.',
                    author: 'Michael Chen',
                    company: 'Social Media Manager, Fusion Retail',
                },
            ],
        },
        cta: {
            title: 'Ready to transform your social media?',
            subtitle: 'Join thousands of brands using BrandSphereAI to grow their social presence.',
            buttonText: 'Start Your Free Trial',
        },
    },
    sv: {
        hero: {
            title: 'Hantera sociala medier smartare med AI',
            subtitle: 'Spara tid och skapa bättre innehåll med vår intelligenta plattform för sociala medier.',
            getStarted: 'Kom igång gratis',
            viewPricing: 'Visa priser',
            tryDemo: 'Testa som premium',
            freeTrial: 'Gratis provperiod',
            noCardRequired: 'Ingen kreditkort krävs',
            cancelAnytime: 'Avsluta när som helst',
            dashboardAlt: 'BrandSphereAI Kontrollpanel Demo',
        },
        features: {
            title: 'Allt du behöver för att lyckas på sociala medier',
            subtitle: 'Vår plattform kombinerar AI med användarvänliga verktyg för att hjälpa dig skapa, schemalägga och analysera innehåll.',
            items: [
                {
                    title: 'AI-innehållsskapande',
                    description: 'Generera engagerande inlägg anpassade efter din varumärkesröst och publik.',
                },
                {
                    title: 'Smart schemaläggning',
                    description: 'Publicera vid perfekt tidpunkt med vår optimerade schemaläggningsalgoritm.',
                },
                {
                    title: 'Omfattande analys',
                    description: 'Förstå vad som fungerar med kraftfulla prestationsmätningar.',
                },
                {
                    title: 'Stöd för flera plattformar',
                    description: 'Hantera alla dina sociala konton från en kontrollpanel.',
                },
            ],
        },
        testimonials: {
            title: 'Betrodd av sociala medier-hanterare världen över',
            items: [
                {
                    quote: 'BrandSphereAI har helt förändrat vår strategi för sociala medier. Vi sparar timmar varje vecka!',
                    author: 'Sarah Johnson',
                    company: 'Marknadsdirektör, TechStart',
                },
                {
                    quote: 'Det AI-genererade innehållet är otroligt varumärkesanpassat. Vårt engagemang har ökat med 40%.',
                    author: 'Michael Chen',
                    company: 'Social Media Manager, Fusion Retail',
                },
            ],
        },
        cta: {
            title: 'Redo att transformera dina sociala medier?',
            subtitle: 'Gå med tusentals varumärken som använder BrandSphereAI för att växa sin närvaro på sociala medier.',
            buttonText: 'Starta din gratis testperiod',
        },
    },
};

// Checkout-sidans översättningar
export const checkoutTranslations: Translations<{
    title: string;
    backToPlans: string;
    paymentDetails: string;
    cardInformation: string;
    nameOnCard: string;
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    completeCheckout: string;
    processingPayment: string;
    orderSummary: string;
    selected: string;
    subtotal: string;
    total: string;
    guaranteeText: string;
    accessText: string;
    questionsText: string;
    contactUs: string;
    termsAgreement: string;
    termsLink: string;
    securityText: string;
    errors: {
        incompleteForm: string;
        processingError: string;
    };
    success: {
        title: string;
        description: string;
    };
}> = {
    en: {
        title: 'Checkout',
        backToPlans: 'Back to Plans',
        paymentDetails: 'Payment Details',
        cardInformation: 'Card Information',
        nameOnCard: 'Name on Card',
        cardNumber: 'Card Number',
        expiryDate: 'Expiry Date',
        securityCode: 'Security Code (CVC)',
        completeCheckout: 'Complete Checkout',
        processingPayment: 'Processing Payment...',
        orderSummary: 'Order Summary',
        selected: 'Selected Plan',
        subtotal: 'Subtotal',
        total: 'Total',
        guaranteeText: '14-day money-back guarantee',
        accessText: 'Full access to all Pro features',
        questionsText: 'Have questions?',
        contactUs: 'Contact us',
        termsAgreement: 'By completing this purchase you agree to our',
        termsLink: 'terms of service',
        securityText: 'Secure transaction. Your payment information is protected.',
        errors: {
            incompleteForm: 'Please fill in all fields.',
            processingError: 'An error occurred during checkout. Please try again.',
        },
        success: {
            title: 'Subscription activated!',
            description: 'Your Pro plan is now active.',
        },
    },
    sv: {
        title: 'Betalning',
        backToPlans: 'Tillbaka till planer',
        paymentDetails: 'Betalningsinformation',
        cardInformation: 'Kortinformation',
        nameOnCard: 'Namn på kort',
        cardNumber: 'Kortnummer',
        expiryDate: 'Utgångsdatum',
        securityCode: 'Säkerhetskod (CVC)',
        completeCheckout: 'Slutför köp',
        processingPayment: 'Bearbetar betalning...',
        orderSummary: 'Orderöversikt',
        selected: 'Vald plan',
        subtotal: 'Delsumma',
        total: 'Totalt',
        guaranteeText: '14 dagars pengarna-tillbaka-garanti',
        accessText: 'Full tillgång till alla Pro-funktioner',
        questionsText: 'Har du frågor?',
        contactUs: 'Kontakta oss',
        termsAgreement: 'Genom att slutföra detta köp godkänner du våra',
        termsLink: 'användarvillkor',
        securityText: 'Säker transaktion. Din betalningsinformation är skyddad.',
        errors: {
            incompleteForm: 'Vänligen fyll i alla fält.',
            processingError: 'Ett fel inträffade vid checkout. Vänligen försök igen.',
        },
        success: {
            title: 'Prenumerationen aktiverad!',
            description: 'Din Pro-plan är nu aktiv.',
        },
    },
}; 
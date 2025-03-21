// This is now a Server Component
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { PLAN_FEATURES } from '@/lib/stripe';
import PricingCards from '@/components/pricing/pricing-cards';
import PricingFaq from '@/components/pricing/pricing-faq';
import PricingHeader from '@/components/pricing/pricing-header';

// Lägg till en enkel Spinner-komponent eftersom vi inte har en befintlig
function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
    />
  );
}

// Priskomponenter - använder samma konstanter som i resten av applikationen
const PRICE_IDS = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || "price_1QxXyyBlLmUFFk8vQVg2xtZl",
  PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY || "price_1QxrmABlLmUFFk8vNiTRH1c5",
  BUSINESS_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY || "price_id_business_monthly",
  BUSINESS_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_YEARLY || "price_id_business_yearly",
};

type BillingCycle = "monthly" | "yearly"

interface PricingInfo {
  monthly: number;
  yearly: number;
  currency: string;
}

interface Plan {
  name: string;
  description: string;
  price: {
    en: PricingInfo;
    sv: PricingInfo;
  };
  features: string[];
  excludes: string[];
  popular: boolean;
  comingSoon: boolean;
  cta: string;
  priceId?: {
    monthly: string;
    yearly: string;
  };
}

interface FeatureDetail {
  name: string;
  plans: {
    free: boolean;
    pro: boolean;
    business: boolean;
  };
}

interface FeatureCategory {
  category: string;
  features: FeatureDetail[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Translation {
  title: string;
  subtitle: string;
  faqTitle: string;
  enterpriseTitle: string;
  enterpriseSubtitle: string;
  enterpriseFeatures: string[];
  enterpriseCta: string;
  monthlyLabel: string;
  yearlyLabel: string;
  yearlyDiscount: string;
  featureIncluded: string;
  featureNotIncluded: string;
  getStartedButton: string;
  contactSalesButton: string;
  categoriesTitle: {
    contentCreation: string;
    analytics: string;
    support: string;
  };
  faq: FaqItem[];
}

interface Translations {
  en: Translation;
  sv: Translation;
}

const translations: Translations = {
  en: {
    title: "Pricing",
    subtitle: "Simple, transparent pricing for everyone.",
    faqTitle: "Frequently asked questions",
    enterpriseTitle: "Need something more?",
    enterpriseSubtitle: "Customized plans for large organizations with specific needs.",
    enterpriseFeatures: [
      "Unlimited users",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security features",
      "Custom reporting and analytics",
      "Priority support and SLA",
      "Onboarding and training"
    ],
    enterpriseCta: "Contact sales",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    yearlyDiscount: "Save 20%",
    featureIncluded: "Included",
    featureNotIncluded: "Not included",
    getStartedButton: "Get started",
    contactSalesButton: "Contact sales",
    categoriesTitle: {
      contentCreation: "Content Creation",
      analytics: "Analytics",
      support: "Support"
    },
    faq: [
      {
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing cycle."
      },
      {
        question: "Is there a discount for annual billing?",
        answer: "Yes, you save 20% when you choose annual billing for any of our paid plans."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. For annual plans, we can also provide invoicing options."
      },
      {
        question: "Can I cancel my subscription?",
        answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
      }
    ]
  },
  sv: {
    title: "Prissättning",
    subtitle: "Enkel, transparent prissättning för alla.",
    faqTitle: "Vanliga frågor",
    enterpriseTitle: "Behöver ni något mer?",
    enterpriseSubtitle: "Anpassade planer för stora organisationer med specifika behov.",
    enterpriseFeatures: [
      "Obegränsade användare",
      "Dedikerad kontoansvarig",
      "Anpassade integrationer",
      "Avancerade säkerhetsfunktioner",
      "Anpassad rapportering och analys",
      "Prioriterad support och SLA",
      "Onboarding och utbildning"
    ],
    enterpriseCta: "Kontakta försäljning",
    monthlyLabel: "Månadsvis",
    yearlyLabel: "Årsvis",
    yearlyDiscount: "Spara 20%",
    featureIncluded: "Ingår",
    featureNotIncluded: "Ingår ej",
    getStartedButton: "Kom igång",
    contactSalesButton: "Kontakta försäljning",
    categoriesTitle: {
      contentCreation: "Innehållsskapande",
      analytics: "Analys",
      support: "Support"
    },
    faq: [
      {
        question: "Kan jag ändra min plan senare?",
        answer: "Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringarna kommer att tillämpas på din nästa faktureringsperiod."
      },
      {
        question: "Finns det rabatt för årlig fakturering?",
        answer: "Ja, du sparar 20% när du väljer årlig fakturering för någon av våra betalda planer."
      },
      {
        question: "Vilka betalningsmetoder accepterar ni?",
        answer: "Vi accepterar alla större kreditkort, inklusive Visa, Mastercard och American Express. För årsplaner kan vi även erbjuda faktureringsalternativ."
      },
      {
        question: "Kan jag avbryta min prenumeration?",
        answer: "Ja, du kan avbryta din prenumeration när som helst från dina kontoinställningar. Din tillgång fortsätter till slutet av din nuvarande faktureringsperiod."
      }
    ]
  }
};

// Updating plans with correct pricing
const plans: Plan[] = [
  {
    name: "Free",
    description: "For individuals or small teams just getting started.",
    price: {
      en: {
        monthly: 0,
        yearly: 0,
        currency: "$"
      },
      sv: {
        monthly: 0,
        yearly: 0,
        currency: "$"
      }
    },
    features: ["3 connected social accounts", "10 scheduled posts per month", "Basic analytics", "Email support"],
    excludes: ["Advanced analytics", "AI content generation", "Multiple users", "API access"],
    cta: "getStartedButton",
    popular: false,
    comingSoon: false
  },
  {
    name: "Pro",
    description: "For growing brands and content creators.",
    price: {
      en: {
        monthly: 19,
        yearly: 190,
        currency: "$"
      },
      sv: {
        monthly: 19,
        yearly: 190,
        currency: "$"
      }
    },
    features: ["10 connected social accounts", "Unlimited scheduled posts", "Advanced analytics", "Competitor analysis", "AI content generation", "Priority email support"],
    excludes: ["Custom branding", "Dedicated account manager"],
    cta: "getStartedButton",
    popular: true,
    comingSoon: false,
    priceId: {
      monthly: PRICE_IDS.PRO_MONTHLY,
      yearly: PRICE_IDS.PRO_YEARLY
    }
  },
  {
    name: "Business",
    description: "For businesses looking to scale their social media strategy.",
    price: {
      en: {
        monthly: 49,
        yearly: 490,
        currency: "$"
      },
      sv: {
        monthly: 49,
        yearly: 490,
        currency: "$"
      }
    },
    features: ["Unlimited social accounts", "Advanced analytics", "Custom branding", "API access", "Team collaboration", "Dedicated account manager", "Phone & priority support"],
    excludes: [],
    cta: "getStartedButton",
    popular: false,
    comingSoon: false,
    priceId: {
      monthly: PRICE_IDS.BUSINESS_MONTHLY,
      yearly: PRICE_IDS.BUSINESS_YEARLY
    }
  }
];

const featureCategories: FeatureCategory[] = [
  {
    category: "contentCreation",
    features: [
      {
        name: "Scheduled posts",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "AI content generation",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Multi-platform posting",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "Content calendar",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Content library",
        plans: { free: false, pro: true, business: true }
      }
    ]
  },
  {
    category: "analytics",
    features: [
      {
        name: "Performance metrics",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "Audience insights",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Competitor analysis",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Custom reports",
        plans: { free: false, pro: false, business: true }
      },
      {
        name: "ROI tracking",
        plans: { free: false, pro: false, business: true }
      }
    ]
  },
  {
    category: "support",
    features: [
      {
        name: "Email support",
        plans: { free: true, pro: true, business: true }
      },
      {
        name: "Priority support",
        plans: { free: false, pro: true, business: true }
      },
      {
        name: "Phone support",
        plans: { free: false, pro: false, business: true }
      },
      {
        name: "Dedicated manager",
        plans: { free: false, pro: false, business: true }
      },
      {
        name: "Team permissions",
        plans: { free: false, pro: false, business: true }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: 'Pricing - BrandSphere',
  description: 'Choose the right plan for your social media management and content creation needs. From individual creators to large businesses.',
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  // Get user subscription if they're logged in
  let subscription = null;
  if (session?.user) {
    subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });
  }

  // Determine if the user has an active subscription
  const hasActive = subscription &&
    subscription.status === 'active' &&
    subscription.stripeCurrentPeriodEnd &&
    new Date(subscription.stripeCurrentPeriodEnd) > new Date();

  // Create pricing plan objects
  const pricingPlans = [
    {
      id: 'FREE',
      name: 'Free',
      description: getPlanDescription('FREE'),
      price: { monthly: 0, annually: 0 },
      features: [
        '1 social media account',
        '5 scheduled posts per month',
        '7-day analytics retention',
        'Community support',
        '20 AI credits per month',
      ],
      highlighted: false,
      currentPlan: !hasActive,
    },
    {
      id: 'BASIC',
      name: 'Basic',
      description: getPlanDescription('BASIC'),
      price: { monthly: 19, annually: 190 },
      features: [
        '3 social media accounts',
        '30 scheduled posts per month',
        '30-day analytics retention',
        'Email support',
        '100 AI credits per month',
        '1 team member',
      ],
      highlighted: false,
      currentPlan: hasActive && subscription!.plan.toUpperCase() === 'BASIC',
    },
    {
      id: 'PRO',
      name: 'Pro',
      description: getPlanDescription('PRO'),
      price: { monthly: 49, annually: 490 },
      features: [
        '5 social media accounts',
        'Unlimited scheduled posts',
        '90-day analytics retention',
        'Priority support',
        '500 AI credits per month',
        'Custom branding',
        '3 team members',
      ],
      highlighted: true,
      currentPlan: hasActive && subscription!.plan.toUpperCase() === 'PRO',
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      description: getPlanDescription('BUSINESS'),
      price: { monthly: 99, annually: 990 },
      features: [
        '10 social media accounts',
        'Unlimited scheduled posts',
        '365-day analytics retention',
        'Dedicated support',
        '2000 AI credits per month',
        'Custom branding',
        '10 team members',
        'API access',
      ],
      highlighted: false,
      currentPlan: hasActive && subscription!.plan.toUpperCase() === 'BUSINESS',
    },
  ];

  return (
    <div className="container py-16 max-w-7xl">
      <PricingHeader />

      <PricingCards
        plans={pricingPlans}
        userId={session?.user?.id}
        userEmail={session?.user?.email}
      />

      <div className="mt-24">
        <PricingFaq />
      </div>
    </div>
  );
}

// Helper functions
function getPlanDescription(planKey: keyof typeof PLAN_FEATURES): string {
  switch (planKey) {
    case 'FREE':
      return 'Perfect for individuals just getting started with social media management.';
    case 'BASIC':
      return 'Ideal for content creators and small businesses looking to grow their social presence.';
    case 'PRO':
      return 'For professional marketers and growing businesses with multiple social channels.';
    case 'BUSINESS':
      return 'Complete solution for agencies and larger businesses with advanced needs.';
    default:
      return '';
  }
}

function getSupportDescription(level: string): string {
  switch (level) {
    case 'community':
      return 'Community support';
    case 'email':
      return 'Email support';
    case 'priority':
      return 'Priority support';
    case 'dedicated':
      return 'Dedicated account manager';
    default:
      return 'Support';
  }
} 
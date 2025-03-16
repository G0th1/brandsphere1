'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support payment through PayPal.'
    },
    {
        question: 'Can I change my plan later?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you\'ll be charged the prorated amount for the remainder of your billing cycle. When you downgrade, the new plan will take effect at the end of your current billing cycle.'
    },
    {
        question: 'Is there a free trial?',
        answer: 'Yes, our Free plan allows you to try out the core features of BrandSphere without any time limit. You can upgrade to a paid plan whenever you\'re ready to access more features and higher usage limits.'
    },
    {
        question: 'How do AI credits work?',
        answer: 'AI credits are used whenever you generate content with our AI tools, analyze posts, or get content suggestions. Each plan includes a monthly allocation of AI credits that refresh at the beginning of your billing cycle. You can purchase additional credits if you need more.'
    },
    {
        question: 'What happens if I exceed my plan limits?',
        answer: 'If you reach your plan\'s limits for AI credits, scheduled posts, or social accounts, you\'ll need to upgrade to a higher tier plan or wait until your limits reset at the beginning of your next billing cycle. We\'ll notify you when you\'re approaching your limits.'
    },
    {
        question: 'Can I cancel my subscription at any time?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings. When you cancel, you\'ll continue to have access to your paid features until the end of your current billing period. After that, your account will revert to the Free plan.'
    },
    {
        question: 'Do you offer refunds?',
        answer: 'We offer a 14-day money-back guarantee for all new subscriptions. If you\'re not satisfied with our service within the first 14 days, contact our support team for a full refund. After this period, we do not offer prorated refunds for partial months.'
    },
    {
        question: 'What kind of support do you offer?',
        answer: 'All plans include access to our help center and community forum. The Basic plan includes email support, while Pro and Business plans include priority support with faster response times. Business plan subscribers also get a dedicated account manager.'
    }
];

export default function PricingFaq() {
    return (
        <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight mb-12">
                Frequently asked questions
            </h2>

            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-base font-medium">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                    Have more questions? Contact our{' '}
                    <a href="/support" className="font-medium text-primary hover:underline">
                        support team
                    </a>
                    .
                </p>
            </div>
        </div>
    );
} 
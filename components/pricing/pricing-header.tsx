'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PricingHeader() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <div className="text-center space-y-6 mb-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple, transparent pricing
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Choose the plan that's right for you and start growing your social media presence with our AI-powered tools.
            </p>

            <div className="flex items-center justify-center mt-8 space-x-3">
                <Label
                    htmlFor="billing-toggle"
                    className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    Monthly billing
                </Label>

                <Switch
                    id="billing-toggle"
                    checked={isAnnual}
                    onCheckedChange={setIsAnnual}
                    aria-label="Toggle between monthly and annual billing"
                    className="data-[state=checked]:bg-primary"
                />

                <div className="flex items-center">
                    <Label
                        htmlFor="billing-toggle"
                        className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        Annual billing
                    </Label>

                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        Save 20%
                    </span>
                </div>
            </div>

            {/* Emit event to pricing cards when billing period changes */}
            <input
                type="hidden"
                id="billing-period"
                value={isAnnual ? 'annually' : 'monthly'}
                onChange={(e) => {
                    document.dispatchEvent(
                        new CustomEvent('billing-period-change', {
                            detail: { billingPeriod: e.target.value }
                        })
                    );
                }}
            />
        </div>
    );
} 
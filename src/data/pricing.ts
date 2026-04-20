export type FeatureValue = boolean | string;

export interface TierCta {
  label: string;
  href: string;
  ariaLabel: string;
}

export interface PricingTier {
  id: string;
  name: string;
  comparisonLabel?: string;
  description: string;
  price: string;
  priceUnit?: { amount: string; cadence: string };
  cta?: TierCta;
  tableCta?: TierCta;
  features: Array<{ label: string; included: boolean }>;
}

export interface FeatureRow {
  label: string;
  values: [FeatureValue, FeatureValue, FeatureValue];
}

export interface FeatureGroup {
  title: string;
  rows: FeatureRow[];
}

export interface PricingData {
  heading: string;
  subheading: string;
  tiers: [PricingTier, PricingTier, PricingTier];
  groups: FeatureGroup[];
}

export const pricing: PricingData = {
  heading: "Pricing to meet your support requirements",
  subheading:
    "Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.",
  tiers: [
    {
      id: "starter",
      name: "Starter",
      description: "Everything you need to get started.",
      price: "$200",
      priceUnit: { amount: "USD", cadence: "per month" },
      cta: {
        label: "Start a free trial",
        href: "#",
        ariaLabel: "Start a free trial on the Starter plan",
      },
      tableCta: {
        label: "Get started",
        href: "#",
        ariaLabel: "Get started with the Starter plan",
      },
      features: [
        { label: "Custom domains", included: true },
        { label: "Edge content delivery", included: true },
        { label: "Advanced analytics", included: true },
        { label: "Quarterly workshops", included: false },
        { label: "Single sign-on (SSO)", included: false },
        { label: "Priority phone support", included: false },
      ],
    },
    {
      id: "growth",
      name: "Growth",
      description: "All the extras for your growing team.",
      price: "$300",
      priceUnit: { amount: "USD", cadence: "per month" },
      cta: {
        label: "Start a free trial",
        href: "#",
        ariaLabel: "Start a free trial on the Growth plan",
      },
      tableCta: {
        label: "Get started",
        href: "#",
        ariaLabel: "Get started with the Growth plan",
      },
      features: [
        { label: "Custom domains", included: true },
        { label: "Edge content delivery", included: true },
        { label: "Advanced analytics", included: true },
        { label: "Quarterly workshops", included: true },
        { label: "Single sign-on (SSO)", included: false },
        { label: "Priority phone support", included: false },
      ],
    },
    {
      id: "advanced",
      name: "Advanced Support",
      comparisonLabel: "Scale",
      description: "Added flexibility at scale.",
      price: "Consult",
      tableCta: {
        label: "Get started",
        href: "#",
        ariaLabel: "Get started with the Scale plan",
      },
      features: [
        { label: "Custom domains", included: true },
        { label: "Edge content delivery", included: true },
        { label: "Advanced analytics", included: true },
        { label: "Quarterly workshops", included: true },
        { label: "Single sign-on (SSO)", included: true },
        { label: "Priority phone support", included: true },
      ],
    },
  ],
  groups: [
    {
      title: "Features",
      rows: [
        { label: "Edge content delivery", values: [true, true, true] },
        { label: "Custom domains", values: ["1", "3", "Unlimited"] },
        { label: "Team members", values: ["3", "20", "Unlimited"] },
        { label: "Single sign-on (SSO)", values: [false, false, true] },
      ],
    },
    {
      title: "Reporting",
      rows: [
        { label: "Advanced analytics", values: [true, true, true] },
        { label: "Basic reports", values: [false, true, true] },
        { label: "Professional reports", values: [false, false, true] },
        { label: "Custom report builder", values: [false, false, true] },
      ],
    },
    {
      title: "Support",
      rows: [
        { label: "24/7 online support", values: [true, true, true] },
        { label: "Quarterly workshops", values: [false, true, true] },
        { label: "Priority phone support", values: [false, false, true] },
        { label: "1:1 onboarding tour", values: [false, false, true] },
      ],
    },
  ],
};

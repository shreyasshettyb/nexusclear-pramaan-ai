import { Jurisdiction, JurisdictionConfig } from '../types';

export const JURISDICTIONS: Record<Jurisdiction, JurisdictionConfig> = {
  india: {
    id: 'india',
    name: 'India (UPI / NPCI)',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    regulatoryBody: 'Reserve Bank of India (RBI)',
    framework: 'KYC Directions Sept 2026 Draft',
    slaCustomerDays: 20,
    slaBankDays: 10,
    icon: 'Building2',
  },
  singapore: {
    id: 'singapore',
    name: 'Singapore (PayNow / FAST)',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: '$',
    regulatoryBody: 'Monetary Authority of Singapore (MAS) / SPF',
    framework: 'Shared Responsibility Framework',
    slaCustomerDays: 14,
    slaBankDays: 7,
    icon: 'ShieldCheck',
  },
  crossBorder: {
    id: 'crossBorder',
    name: 'Cross-Border (BIS Nexus)',
    flag: '🌐',
    currency: 'Multi',
    currencySymbol: '₹/$',
    regulatoryBody: 'Bank for International Settlements (BIS)',
    framework: 'Project Nexus Cross-Border Protocol',
    slaCustomerDays: 30,
    slaBankDays: 15,
    icon: 'Globe',
  },
};

export const JURISDICTION_LIST: JurisdictionConfig[] = [
  JURISDICTIONS.india,
  JURISDICTIONS.singapore,
  JURISDICTIONS.crossBorder,
];

export const getJurisdiction = (id: Jurisdiction): JurisdictionConfig => {
  return JURISDICTIONS[id] || JURISDICTIONS.india;
};

export const formatCurrency = (amount: number, jurisdiction: Jurisdiction): string => {
  const config = getJurisdiction(jurisdiction);
  if (jurisdiction === 'india') {
    return `${config.currencySymbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (jurisdiction === 'singapore') {
    return `$${amount.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SGD`;
  } else {
    return `${config.currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

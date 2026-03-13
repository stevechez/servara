export const siteConfig = {
  name: 'Zidro OS',
  description: 'Next-generation operations and growth for field service contractors.',
  url: process.env.NEXT_PUBLIC_URL || 'https://getzidro.com',
  ogImage: 'https://getzidro.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/zidro_os',
    github: 'https://github.com/your-repo/zidro',
  },
  contact: {
    email: 'hello@getzidro.com',
    support: 'support@getzidro.com',
  },
  business: {
    primaryTrade: 'Field Service',
    defaultCurrency: 'USD',
  },
};

export type SiteConfig = typeof siteConfig;

// app/lib/constants/targetAudience.ts
export const TARGET_AUDIENCE_OPTIONS = [
  "Mass Market Consumers",
  "Households",
  "Individuals",
  "Youth & Students",
  "Key Decision Makers",
  "Household Buyers",
  "Working Professionals",
  "Trade & Retail Channel (B2B Audience)",
  "Distributors & Retailers",
  "Low-Income Consumers",
  "Middle-Income Consumers",
  "High-Income Consumers",
  "Urban Consumers",
  "High-traffic locations (markets, bus stops, junctions)",
  "Retail outlets",
  "Transit routes",
  "Major markets"
] as string[];

export type TargetAudience = typeof TARGET_AUDIENCE_OPTIONS[number];
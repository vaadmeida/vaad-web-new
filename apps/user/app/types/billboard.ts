export type Billboard = {
  id: string;
  _id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  size?: string;
  impressions?: string;
  description?: string;
  availableInDays?: number; // for "Available in 12 days"
};
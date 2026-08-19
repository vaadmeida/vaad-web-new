import { z } from "zod";

// Soft validation — optional fields, loose numbers
export const billboardFormSchema = z.object({
  partnerId: z.string().optional().default(""),
  availableDate: z.string().optional().default(""),
  printProductType: z.string().optional().default(""),
  mediaType: z.string().optional().default(""),
  dimension: z.string().optional().default("meters"),
  orientation: z.string().optional().default("LANDSCAPE"),
  visibility: z.string().optional().default(""),
  illumination: z.string().optional().default(""),
  format: z.string().optional().default(""),
  description: z.string().optional().default(""),
  locationAddress: z.string().optional().default(""),
  state: z.string().optional().default(""),
  city: z.string().optional().default(""),
  landmark: z.string().optional().default(""),
  approvalStatus: z.string().optional().default(""),
  height: z.coerce.number().optional().default(0),
  width: z.coerce.number().optional().default(0),
  size: z.string().optional().default(""),
  price: z.coerce.number().optional().default(0),
  photos: z.array(z.string()).optional().default([]),
  hotDeal: z.boolean().optional().default(false),
  rating: z.coerce.number().optional().default(0),
  favorite: z.boolean().optional().default(false),
  features: z.array(z.string()).optional().default([]),
});

export type BillboardFormData = z.infer<typeof billboardFormSchema>;

// Keep old step schemas soft if still imported
export const step1Schema = billboardFormSchema.partial();
export const step2Schema = billboardFormSchema.partial();
export const step3Schema = billboardFormSchema.partial();
export const step4Schema = billboardFormSchema.partial();
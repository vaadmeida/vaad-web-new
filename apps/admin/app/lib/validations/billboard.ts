import { z } from "zod";

// Base schema for billboard
export const billboardSchema = z.object({
  partnerId: z.string().min(1, "Partner ID is required"),
  locationAddress: z.string().min(1, "Location address is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  landmark: z.string().optional(),
  height: z.number().min(1, "Height must be greater than 0"),
  width: z.number().min(1, "Width must be greater than 0"),
  units: z.string().min(1, "Units are required"),
  rate: z.number().min(1, "Rate must be greater than 0"),
  printProductType: z.string().min(1, "Product type is required"),
  serviceType: z.string().min(1, "Service type is required"),
  mediaType: z.string().min(1, "Media type is required"),
  orientation: z.string().min(1, "Orientation is required"),
  visibility: z.string().min(1, "Visibility is required"),
  illumination: z.string().min(1, "Illumination is required"),
  format: z.string().min(1, "Format is required"),
  approvalStatus: z.string().min(1, "Approval status is required"),
  targetAudience: z
    .array(z.string())
    .min(1, "At least one target audience is required"),
  photos: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one photo is required"),
  features: z.array(z.string()).optional(),
});

// Schema for each step
export const step1Schema = billboardSchema.pick({
  partnerId: true,
  locationAddress: true,
  description: true,
  state: true,
  city: true,
  landmark: true,
});

export const step2Schema = billboardSchema.pick({
  height: true,
  width: true,
  units: true,
  rate: true,
  printProductType: true,
  serviceType: true,
  mediaType: true,
  orientation: true,
  visibility: true,
  illumination: true,
  format: true,
  approvalStatus: true,
});

export const step3Schema = billboardSchema.pick({
  targetAudience: true,
  features: true,
});

export const step4Schema = billboardSchema.pick({
  photos: true,
});

// Type inference
export type BillboardFormData = z.infer<typeof billboardSchema>;
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
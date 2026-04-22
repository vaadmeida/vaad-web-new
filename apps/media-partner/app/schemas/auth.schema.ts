/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

// Phone number validation regex:
// - local Nigerian format: 0########## (11 digits)
// - international Nigerian format: +234##########
// - fallback: general E.164 (+countrycode...)
const phoneRegex = /^(?:0\d{10}|\+234\d{10}|\+?[1-9]\d{1,14})$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(phoneRegex, 'Please enter a valid phone number'),
    businessName: z.string().min(1, 'Business name is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    logo: z.instanceof(File).optional().nullable(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAndCondition: z.boolean().refine((val: boolean) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data: { password: any; confirmPassword: any; }) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
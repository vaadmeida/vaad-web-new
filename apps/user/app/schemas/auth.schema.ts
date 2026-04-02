import { z } from 'zod';

// Updated phone number regex that accepts:
// - Nigerian local: 08012345678, 09012345678, 07012345678, etc.
// - Nigerian with country code: +2348012345678, 2348012345678
// - International: +1234567890, 1234567890
const phoneRegex = /^(\+?[1-9]\d{1,14}|0[7-9][01]\d{8})$/;

// More comprehensive Nigerian phone validation
const nigerianPhoneRegex = /^(0[7-9][01]\d{8}|\+?234[7-9][01]\d{8})$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .refine((val) => {
        // Remove any spaces or dashes
        const cleanNumber = val.replace(/[\s-]/g, '');
        
        // Check if it's a valid Nigerian number
        if (nigerianPhoneRegex.test(cleanNumber)) {
          return true;
        }
        
        // Check if it's a valid international number
        if (phoneRegex.test(cleanNumber)) {
          return true;
        }
        
        return false;
      }, 'Please enter a valid phone number (e.g., 08012345678, +2348012345678, or +1234567890)'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAndCondition: z.boolean().refine(val => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Helper function to format phone number before sending to API
export const formatPhoneNumber = (phone: string): string => {
  const cleanNumber = phone.replace(/[\s-]/g, '');
  
  // If it starts with 0 (Nigerian local), convert to +234 format
  if (cleanNumber.startsWith('0') && cleanNumber.length === 11) {
    return `+234${cleanNumber.slice(1)}`;
  }
  
  // If it starts with 234 without +, add +
  if (cleanNumber.startsWith('234') && !cleanNumber.startsWith('+')) {
    return `+${cleanNumber}`;
  }
  
  // If it already has +, return as is
  if (cleanNumber.startsWith('+')) {
    return cleanNumber;
  }
  
  // Default: add + if it's an international number
  return `+${cleanNumber}`;
};
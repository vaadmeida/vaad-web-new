import { UseFormRegister } from 'react-hook-form';
import Link from 'next/link';
import { RegisterFormData } from '@/app/schemas/auth.schema';
import Checkbox from './Checkbox';

interface TermsCheckboxProps {
  register: UseFormRegister<RegisterFormData>;
  error?: string;
}

export default function TermsCheckbox({ register, error }: TermsCheckboxProps) {
  const termsLabel = (
    <>
      I agree to VAAD Media’s{' '}
      <Link
        href="/terms"
        className="text-[#0177AB] hover:text-[#007a9e] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link
        href="/privacy"
        className="text-[#0177AB] hover:text-[#007a9e] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        Privacy Policy
      </Link>
    </>
  );

  return (
    <Checkbox
      id="terms"
      label={termsLabel}
      error={error}
      color="#E8505B"
      {...register('termsAndCondition')}
    />
  );
}
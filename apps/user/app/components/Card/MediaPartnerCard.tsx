'use client';

import { CheckCircle2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface MediaPartnerCardProps {
  title: string;
  description?: string;
  benefits?: string[];
  showHelp?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function MediaPartnerCard({
  title,
  description,
  benefits,
  showHelp = true,
  className = '',
  children
}: MediaPartnerCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-[#EDEDF2] ${className}`}>
      <h3 className="text-xl font-bold text-[#101928] mb-3">{title}</h3>
      {description && (
        <p className="text-sm text-[#475367] mb-4">{description}</p>
      )}
      
      {benefits && benefits.length > 0 && (
        <div className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0088b5] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      )}
      
      {children}
      
      {showHelp && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#0088b5] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Need Help?</p>
              <p className="text-xs text-gray-600 mt-1">
                Get to know how your campaign can reach a wider audience.
              </p>
              <Link 
                href="/contact" 
                className="inline-block mt-2 text-sm font-medium text-[#0088b5] hover:text-[#006d91] transition-colors"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
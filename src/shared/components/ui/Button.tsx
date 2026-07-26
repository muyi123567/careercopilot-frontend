import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[transform,background-color,box-shadow,color,border-color] duration-200 ease-out-quart disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-600 text-white shadow-[0_1px_2px_rgba(20,22,40,0.08),0_10px_22px_-14px_rgba(72,60,200,0.55)] hover:bg-brand-700 hover:-translate-y-0.5 hover:shadow-lift disabled:bg-brand-300 disabled:shadow-none disabled:translate-y-0',
        secondary:
          'bg-surface text-ink-700 border border-line hover:border-ink-900/20 hover:-translate-y-0.5 hover:shadow-card disabled:text-ink-400',
        ghost: 'bg-transparent text-brand-700 hover:bg-brand-50',
        danger:
          'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lift disabled:bg-red-300 disabled:translate-y-0',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-5 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({ variant, size, className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </button>
  );
}


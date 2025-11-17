'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-soft hover:bg-[hsl(var(--primary-hover))]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-soft hover:bg-[hsl(var(--secondary-hover))]',
        accent:
          'bg-accent text-accent-foreground shadow-soft hover:bg-[hsl(var(--accent-hover))] border border-[hsl(var(--accent-hover))]',
        success:
          'bg-success text-success-foreground shadow-soft hover:opacity-90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-soft hover:opacity-90',
        outline:
          'border-2 border-border bg-transparent hover:bg-accent/10 hover:border-[hsl(var(--accent-hover))]',
        ghost: 'hover:bg-accent/20 hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 py-2 text-xs',
        lg: 'h-12 px-8 py-3 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

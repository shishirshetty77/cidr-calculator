'use client';

import { cn } from '@/lib/cn';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%] rounded-md',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

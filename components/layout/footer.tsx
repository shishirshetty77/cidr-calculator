export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/50 backdrop-blur-sm transition-theme">
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <p className="text-sm font-medium text-muted-foreground">
              Crafted by
            </p>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>
          
          <div className="max-w-2xl space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Shishir Shetty
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              DevOps and cloud engineering enthusiast specializing in Terraform, 
              Kubernetes, modern infrastructure, and cloud architecture. Building 
              tools that make network engineering simpler and more accessible.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Built with Next.js 15</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>

          <div className="pt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} CIDR Toolkit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

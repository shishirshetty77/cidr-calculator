export function Footer() {
  return (
    <footer className="border-t bg-card transition-theme">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">About the Project</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A comprehensive CIDR utility application built with Next.js, TypeScript, and Tailwind CSS.
              Features real-time validation, server-side IP calculations, and a modern, accessible interface.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Developer</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Created by <span className="font-medium text-foreground">Shishir Shetty</span>, a DevOps and cloud engineering enthusiast
              specializing in Terraform, Kubernetes, modern infrastructure, and cloud architecture.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>Built with Next.js 15, TypeScript, and Tailwind CSS</p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://vercel.com"
                className="hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-theme">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CIDR Calculator</h1>
            <p className="text-sm text-muted-foreground">Network Planning & IP Management Toolkit</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container py-8">
        <Tabs defaultValue="cidr-calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="cidr-calculator">CIDR Calculator</TabsTrigger>
            <TabsTrigger value="range-converter">Range Converter</TabsTrigger>
            <TabsTrigger value="subnetting">Subnetting</TabsTrigger>
            <TabsTrigger value="mask-converter">Mask Converter</TabsTrigger>
            <TabsTrigger value="overlap-checker">Overlap Checker</TabsTrigger>
          </TabsList>

          <TabsContent value="cidr-calculator" className="space-y-4">
            <p>CIDR Calculator component coming soon</p>
          </TabsContent>

          <TabsContent value="range-converter" className="space-y-4">
            <p>Range Converter component coming soon</p>
          </TabsContent>

          <TabsContent value="subnetting" className="space-y-4">
            <p>Subnetting Tool component coming soon</p>
          </TabsContent>

          <TabsContent value="mask-converter" className="space-y-4">
            <p>Mask Converter component coming soon</p>
          </TabsContent>

          <TabsContent value="overlap-checker" className="space-y-4">
            <p>Overlap Checker component coming soon</p>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

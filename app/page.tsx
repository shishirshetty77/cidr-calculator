'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import CIDRToRange from '@/components/CIDRToRange';
import RangeToCIDR from '@/components/RangeToCIDR';
import SubnetCalculator from '@/components/SubnetCalculator';
import MaskConverter from '@/components/MaskConverter';
import OverlapChecker from '@/components/OverlapChecker';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col transition-theme">
      <Header />

      <main className="flex-1 container py-10">
        <div className="mb-8 text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Network Planning Made Simple
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional CIDR and IP management toolkit for network engineers, 
            DevOps teams, and cloud architects
          </p>
        </div>

        <Tabs defaultValue="cidr-calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto p-1 bg-muted/30 backdrop-blur-sm">
            <TabsTrigger 
              value="cidr-calculator" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft"
            >
              CIDR Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="range-converter"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-soft"
            >
              Range Converter
            </TabsTrigger>
            <TabsTrigger 
              value="subnetting"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-soft"
            >
              Subnetting
            </TabsTrigger>
            <TabsTrigger 
              value="mask-converter"
              className="data-[state=active]:bg-success data-[state=active]:text-success-foreground data-[state=active]:shadow-soft"
            >
              Mask Converter
            </TabsTrigger>
            <TabsTrigger 
              value="overlap-checker"
              className="data-[state=active]:bg-info data-[state=active]:text-info-foreground data-[state=active]:shadow-soft"
            >
              Overlap Checker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cidr-calculator" className="space-y-4 animate-slide-up">
            <CIDRToRange />
          </TabsContent>

          <TabsContent value="range-converter" className="space-y-4 animate-slide-up">
            <RangeToCIDR />
          </TabsContent>

          <TabsContent value="subnetting" className="space-y-4 animate-slide-up">
            <SubnetCalculator />
          </TabsContent>

          <TabsContent value="mask-converter" className="space-y-4 animate-slide-up">
            <MaskConverter />
          </TabsContent>

          <TabsContent value="overlap-checker" className="space-y-4 animate-slide-up">
            <OverlapChecker />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

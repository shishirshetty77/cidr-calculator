'use client';

import { useState } from 'react';
import CIDRToRange from '@/components/CIDRToRange';
import RangeToCIDR from '@/components/RangeToCIDR';
import SubnetCalculator from '@/components/SubnetCalculator';
import MaskConverter from '@/components/MaskConverter';
import OverlapChecker from '@/components/OverlapChecker';

type Tab = 'cidr-to-range' | 'range-to-cidr' | 'subnet' | 'mask-converter' | 'overlap-checker';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('cidr-to-range');

  const tabs = [
    { id: 'cidr-to-range' as Tab, name: 'CIDR → Range', icon: '📊' },
    { id: 'range-to-cidr' as Tab, name: 'Range → CIDR', icon: '🔄' },
    { id: 'subnet' as Tab, name: 'Subnetting', icon: '🔧' },
    { id: 'mask-converter' as Tab, name: 'Mask Converter', icon: '🔀' },
    { id: 'overlap-checker' as Tab, name: 'Overlap Checker', icon: '⚠️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-4xl">🌐</span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CIDR Calculator Pro
                </span>
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Complete network planning and IP management toolkit
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-semibold">Real-time Validation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-x-auto py-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200
                  flex items-center gap-2 min-w-fit
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeTab === 'cidr-to-range' && <CIDRToRange />}
          {activeTab === 'range-to-cidr' && <RangeToCIDR />}
          {activeTab === 'subnet' && <SubnetCalculator />}
          {activeTab === 'mask-converter' && <MaskConverter />}
          {activeTab === 'overlap-checker' && <OverlapChecker />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Built with Next.js, TypeScript & Tailwind CSS
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="https://github.com" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                <span>💻</span> GitHub
              </a>
              <a href="https://vercel.com" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                <span>▲</span> Deploy on Vercel
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

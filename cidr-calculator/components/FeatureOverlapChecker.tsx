"use client";

import React, { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import type { OverlapResult } from '@/utils/ipMath';

export const FeatureOverlapChecker: React.FC = () => {
  const [cidrList, setCidrList] = useState('192.168.0.0/23\n192.168.1.0/24');
  const [result, setResult] = useState<{ overlaps: OverlapResult[], duplicates: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const list = cidrList.split('\n').filter(cidr => cidr.trim() !== '');
      const response = await fetch('/api/overlap-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidrList: list }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred.');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRelationText = (type: OverlapResult['type']) => {
    switch (type) {
        case 'contains': return 'contains';
        case 'is_contained_by': return 'is contained by';
        case 'overlaps_with': return 'overlaps with';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CIDR Overlap Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <label htmlFor="cidr-list" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CIDR List (one per line)
            </label>
            <textarea
            id="cidr-list"
            rows={5}
            value={cidrList}
            onChange={(e) => setCidrList(e.target.value)}
            placeholder="e.g., 192.168.0.0/24&#10;10.0.0.0/8"
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white font-mono"
            />
        </div>
        <Button onClick={handleCheck} disabled={loading} className="w-full md:w-auto">
          {loading ? 'Checking...' : 'Check for Overlaps'}
        </Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {result && (
          <div className="pt-4 space-y-4">
            {result.duplicates.length > 0 && (
                <ResultSection title="Duplicate Entries Found">
                    <ul className="list-disc list-inside">
                        {result.duplicates.map((dup, i) => <li key={i} className="font-mono">{dup}</li>)}
                    </ul>
                </ResultSection>
            )}
            {result.overlaps.length > 0 ? (
                <ResultSection title="Overlaps Detected">
                    <ul className="space-y-2">
                        {result.overlaps.map((overlap, index) => (
                        <li key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
                            <span className="font-bold font-mono">{overlap.cidr1}</span>
                            <span className="text-indigo-600 dark:text-indigo-400 mx-2">{getRelationText(overlap.type)}</span>
                            <span className="font-bold font-mono">{overlap.cidr2}</span>
                        </li>
                        ))}
                    </ul>
                </ResultSection>
            ) : (
                <ResultSection title="No Overlaps Detected">
                    <p className="text-green-600 dark:text-green-400">The provided CIDR blocks do not overlap.</p>
                </ResultSection>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ResultSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="mt-2 text-gray-800 dark:text-gray-200">{children}</div>
    </div>
)

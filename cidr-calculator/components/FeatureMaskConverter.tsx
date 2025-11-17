
"use client";

import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import type { MaskInfo } from '@/utils/ipMath';

export const FeatureMaskConverter: React.FC = () => {
  const [input, setInput] = useState('/24');
  const [result, setResult] = useState<MaskInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`/api/mask-converter?input=${encodeURIComponent(input)}`);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>CIDR / Netmask / Wildcard Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <Input
              label="CIDR, Subnet Mask, or Wildcard Mask"
              id="mask-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., /24, 255.255.255.0, or 0.0.0.255"
            />
          </div>
          <Button onClick={handleConvert} disabled={loading}>
            {loading ? 'Converting...' : 'Convert'}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <ResultItem label="CIDR Notation" value={`/${result.cidr}`} />
            <ResultItem label="Subnet Mask" value={result.subnetMask} />
            <ResultItem label="Wildcard Mask" value={result.wildcardMask} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ResultItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">{value}</p>
    </div>
);

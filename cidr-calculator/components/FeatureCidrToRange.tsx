
"use client";

import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import type { CidrInfo } from '@/utils/ipMath';

export const FeatureCidrToRange: React.FC = () => {
  const [cidr, setCidr] = useState('192.168.0.1/24');
  const [result, setResult] = useState<CidrInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`/api/cidr-info?cidr=${encodeURIComponent(cidr)}`);
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
        <CardTitle>CIDR to IP Range Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <Input
              label="CIDR Notation"
              id="cidr-input"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              placeholder="e.g., 192.168.1.0/24"
            />
          </div>
          <Button onClick={handleCalculate} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            <ResultItem label="Network Address" value={result.networkAddress} />
            <ResultItem label="Broadcast Address" value={result.broadcastAddress} />
            <ResultItem label="IP Range" value={result.ipRange} />
            <ResultItem label="Total Hosts" value={result.totalHosts.toLocaleString()} />
            <ResultItem label="Usable Hosts" value={result.usableHosts.toLocaleString()} />
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
    <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

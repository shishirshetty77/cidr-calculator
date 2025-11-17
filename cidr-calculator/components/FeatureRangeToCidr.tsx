
"use client";

import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export const FeatureRangeToCidr: React.FC = () => {
  const [startIp, setStartIp] = useState('192.168.0.0');
  const [endIp, setEndIp] = useState('192.168.0.255');
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`/api/range-to-cidr?start=${encodeURIComponent(startIp)}&end=${encodeURIComponent(endIp)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred.');
      }
      setResult(data.cidrs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Range to CIDR Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start IP Address"
            id="start-ip"
            value={startIp}
            onChange={(e) => setStartIp(e.target.value)}
            placeholder="e.g., 192.168.0.0"
          />
          <Input
            label="End IP Address"
            id="end-ip"
            value={endIp}
            onChange={(e) => setEndIp(e.target.value)}
            placeholder="e.g., 192.168.0.255"
          />
        </div>
        <Button onClick={handleCalculate} disabled={loading} className="w-full md:w-auto">
          {loading ? 'Converting...' : 'Convert'}
        </Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {result && (
          <div className="pt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resulting CIDR Blocks:</h3>
            <div className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              {result.length > 0 ? (
                <ul className="space-y-1">
                  {result.map((cidr, index) => (
                    <li key={index} className="font-mono text-gray-800 dark:text-gray-200">{cidr}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No CIDR blocks found for this range.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

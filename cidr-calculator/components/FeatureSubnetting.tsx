
"use client";

import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import type { SubnetInfo } from '@/utils/ipMath';

type CalculateByType = 'subnetCount' | 'hostCount';

export const FeatureSubnetting: React.FC = () => {
  const [networkCidr, setNetworkCidr] = useState('10.0.0.0/16');
  const [calculateBy, setCalculateBy] = useState<CalculateByType>('subnetCount');
  const [value, setValue] = useState('8');
  const [result, setResult] = useState<{ subnets: SubnetInfo[], hostsPerSubnet?: number, newSubnetMask?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/subnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ networkCidr, calculateBy, value: Number(value) }),
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subnet Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Network CIDR"
            id="network-cidr"
            value={networkCidr}
            onChange={(e) => setNetworkCidr(e.target.value)}
            placeholder="e.g., 10.0.0.0/16"
          />
          <div>
            <label htmlFor="calculate-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calculate by</label>
            <select
              id="calculate-by"
              value={calculateBy}
              onChange={(e) => setCalculateBy(e.target.value as CalculateByType)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
            >
              <option value="subnetCount">Number of Subnets</option>
              <option value="hostCount">Hosts per Subnet</option>
            </select>
          </div>
          <Input
            label={calculateBy === 'subnetCount' ? 'Number of Subnets' : 'Required Hosts'}
            id="subnet-value"
            type="number"
            min="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button onClick={handleCalculate} disabled={loading} className="w-full md:w-auto">
          {loading ? 'Calculating...' : 'Calculate Subnets'}
        </Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {result && (
          <div className="pt-4 overflow-x-auto">
            {result.hostsPerSubnet && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hosts per Subnet</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.hostsPerSubnet.toLocaleString()}</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">New Subnet Mask</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">/{result.newSubnetMask}</p>
                </div>
            )}
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <Th>ID</Th>
                  <Th>CIDR</Th>
                  <Th>IP Range</Th>
                  <Th>Usable Hosts</Th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {result.subnets.map((subnet) => (
                  <tr key={subnet.subnetId}>
                    <Td>{subnet.subnetId}</Td>
                    <Td mono>{subnet.cidr}</Td>
                    <Td mono>{subnet.ipRange}</Td>
                    <Td>{subnet.usableHosts.toLocaleString()}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        {children}
    </th>
);

const Td: React.FC<{ children: React.ReactNode, mono?: boolean }> = ({ children, mono }) => (
    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 ${mono ? 'font-mono' : ''}`}>
        {children}
    </td>
);

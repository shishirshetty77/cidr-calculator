'use client';

import { useState } from 'react';

interface CIDRInfo {
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  binarySubnetMask: string;
  ipClass: string;
}

export default function CIDRToRange() {
  const [cidr, setCidr] = useState('');
  const [result, setResult] = useState<CIDRInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/cidr-to-range', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidr })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Calculation failed');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">📊</span> CIDR to IP Range Calculator
        </h2>
        <p className="text-gray-600 mb-6">
          Enter a CIDR notation to calculate network details, IP ranges, and subnet information.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CIDR Notation
            </label>
            <input
              type="text"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              placeholder="e.g., 192.168.1.0/24"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
              onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
            />
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading || !cidr.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Calculating...' : 'Calculate Range'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-600">✓</span> Network Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Network Address" value={result.networkAddress} />
            <InfoCard label="Broadcast Address" value={result.broadcastAddress} />
            <InfoCard label="First Usable IP" value={result.firstUsable} />
            <InfoCard label="Last Usable IP" value={result.lastUsable} />
            <InfoCard label="Total Hosts" value={result.totalHosts.toLocaleString()} />
            <InfoCard label="Usable Hosts" value={result.usableHosts.toLocaleString()} />
            <InfoCard label="Subnet Mask" value={result.subnetMask} />
            <InfoCard label="Wildcard Mask" value={result.wildcardMask} />
            <InfoCard label="IP Class" value={result.ipClass} />
            <InfoCard 
              label="Binary Subnet Mask" 
              value={result.binarySubnetMask} 
              className="md:col-span-2 font-mono text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
      <p className={`text-lg text-gray-900 font-medium ${className}`}>{value}</p>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface SubnetInfo {
  subnet: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  usableHosts: number;
  totalHosts: number;
}

export default function SubnetCalculator() {
  const [networkCIDR, setNetworkCIDR] = useState('');
  const [mode, setMode] = useState<'subnets' | 'hosts'>('subnets');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<SubnetInfo[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/subnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ networkCIDR, mode, value })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Calculation failed');
      } else {
        setResult(data.subnets);
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
          <span className="text-green-600">🔧</span> Subnet Calculator
        </h2>
        <p className="text-gray-600 mb-6">
          Divide a network into subnets based on required subnet count or hosts per subnet.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Network CIDR
            </label>
            <input
              type="text"
              value={networkCIDR}
              onChange={(e) => setNetworkCIDR(e.target.value)}
              placeholder="e.g., 10.0.0.0/16"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subnet By
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'subnets' | 'hosts')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200 bg-white"
              >
                <option value="subnets">Number of Subnets</option>
                <option value="hosts">Hosts per Subnet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {mode === 'subnets' ? 'Number of Subnets' : 'Hosts per Subnet'}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={mode === 'subnets' ? 'e.g., 4' : 'e.g., 254'}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading || !networkCIDR.trim() || !value.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Calculating...' : 'Calculate Subnets'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {result && result.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-600">✓</span> Subnets ({result.length})
          </h3>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {result.map((subnet, index) => (
              <div 
                key={index}
                className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-mono text-lg font-bold text-green-900">
                    Subnet {index + 1}: {subnet.subnet}
                  </h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(subnet.subnet)}
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Network</p>
                    <p className="text-gray-900 font-mono">{subnet.networkAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Broadcast</p>
                    <p className="text-gray-900 font-mono">{subnet.broadcastAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">First Usable</p>
                    <p className="text-gray-900 font-mono">{subnet.firstUsable}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Last Usable</p>
                    <p className="text-gray-900 font-mono">{subnet.lastUsable}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Usable Hosts</p>
                    <p className="text-gray-900 font-mono">{subnet.usableHosts.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Total Hosts</p>
                    <p className="text-gray-900 font-mono">{subnet.totalHosts.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

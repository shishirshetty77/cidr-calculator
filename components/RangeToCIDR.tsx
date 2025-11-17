'use client';

import { useState } from 'react';

export default function RangeToCIDR() {
  const [startIP, setStartIP] = useState('');
  const [endIP, setEndIP] = useState('');
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/range-to-cidr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startIP, endIP })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Conversion failed');
      } else {
        setResult(data.cidrs);
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
          <span className="text-purple-600">🔄</span> IP Range to CIDR Converter
        </h2>
        <p className="text-gray-600 mb-6">
          Convert an IP address range to optimal CIDR notation blocks.
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start IP Address
              </label>
              <input
                type="text"
                value={startIP}
                onChange={(e) => setStartIP(e.target.value)}
                placeholder="e.g., 192.168.1.0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End IP Address
              </label>
              <input
                type="text"
                value={endIP}
                onChange={(e) => setEndIP(e.target.value)}
                placeholder="e.g., 192.168.1.255"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
              />
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || !startIP.trim() || !endIP.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Converting...' : 'Convert to CIDR'}
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
            <span className="text-green-600">✓</span> CIDR Blocks ({result.length})
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {result.map((cidr, index) => (
              <div 
                key={index}
                className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg text-purple-900 font-semibold">
                    {cidr}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(cidr)}
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

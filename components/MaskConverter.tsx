'use client';

import { useState } from 'react';

interface ConversionResult {
  prefix: number;
  subnetMask: string;
  wildcardMask: string;
  binaryMask: string;
  cidrNotation: string;
}

export default function MaskConverter() {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'cidr' | 'subnet' | 'wildcard' | 'prefix'>('cidr');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/mask-converter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, type })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Conversion failed');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'cidr': return 'e.g., 192.168.1.0/24';
      case 'subnet': return 'e.g., 255.255.255.0';
      case 'wildcard': return 'e.g., 0.0.0.255';
      case 'prefix': return 'e.g., 24';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-orange-600">🔀</span> Netmask Converter
        </h2>
        <p className="text-gray-600 mb-6">
          Convert between CIDR notation, subnet masks, wildcard masks, and prefix lengths for firewall and ACL rules.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Input Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as typeof type);
                setInput('');
                setResult(null);
                setError('');
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors duration-200 bg-white"
            >
              <option value="cidr">CIDR Notation</option>
              <option value="subnet">Subnet Mask</option>
              <option value="wildcard">Wildcard Mask</option>
              <option value="prefix">Prefix Length</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {type === 'cidr' && 'CIDR Notation'}
              {type === 'subnet' && 'Subnet Mask'}
              {type === 'wildcard' && 'Wildcard Mask'}
              {type === 'prefix' && 'Prefix Length'}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors duration-200"
              onKeyPress={(e) => e.key === 'Enter' && handleConvert()}
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || !input.trim()}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-700 hover:to-orange-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Converting...' : 'Convert'}
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
            <span className="text-green-600">✓</span> Conversion Results
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <ConversionCard label="CIDR Notation" value={result.cidrNotation} icon="📝" />
            <ConversionCard label="Prefix Length" value={`/${result.prefix}`} icon="🔢" />
            <ConversionCard label="Subnet Mask" value={result.subnetMask} icon="🎭" />
            <ConversionCard label="Wildcard Mask" value={result.wildcardMask} icon="🃏" />
            <ConversionCard 
              label="Binary Subnet Mask" 
              value={result.binaryMask} 
              icon="🔣"
              mono
            />
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Tip:</span> Wildcard masks are commonly used in Cisco ACLs and firewall rules.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ConversionCard({ 
  label, 
  value, 
  icon, 
  mono = false 
}: { 
  label: string; 
  value: string; 
  icon: string;
  mono?: boolean;
}) {
  return (
    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-2">
            <span>{icon}</span> {label}
          </p>
          <p className={`text-lg text-gray-900 font-medium ${mono ? 'font-mono text-sm' : ''}`}>
            {value}
          </p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="ml-4 text-xs bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

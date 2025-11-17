'use client';

import { useState } from 'react';

interface Overlap {
  cidr1: string;
  cidr2: string;
  overlapRange: string;
}

interface OverlapResult {
  hasOverlaps: boolean;
  overlaps: Overlap[];
  suggestions: string[];
}

export default function OverlapChecker() {
  const [cidrsText, setCidrsText] = useState('');
  const [result, setResult] = useState<OverlapResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const cidrs = cidrsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const response = await fetch('/api/overlap-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidrs })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Check failed');
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
          <span className="text-red-600">⚠️</span> CIDR Overlap Checker
        </h2>
        <p className="text-gray-600 mb-6">
          Paste multiple CIDR blocks (one per line) to identify overlaps, conflicts, and get correction suggestions.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CIDR Blocks (one per line)
            </label>
            <textarea
              value={cidrsText}
              onChange={(e) => setCidrsText(e.target.value)}
              placeholder="192.168.1.0/24&#10;192.168.1.128/25&#10;10.0.0.0/16&#10;10.0.1.0/24"
              rows={8}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors duration-200 font-mono text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter at least 2 CIDR blocks to check for overlaps
            </p>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading || cidrsText.trim().split('\n').filter(l => l.trim()).length < 2}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Checking...' : 'Check for Overlaps'}
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
        <div className={`bg-white rounded-xl shadow-lg p-6 border animate-slide-up ${
          result.hasOverlaps ? 'border-red-200' : 'border-green-200'
        }`}>
          {result.hasOverlaps ? (
            <>
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <span className="text-red-600">❌</span> Overlaps Detected ({result.overlaps.length})
              </h3>
              
              <div className="space-y-4 mb-6">
                {result.overlaps.map((overlap, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-700">Overlap {index + 1}:</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-white rounded border border-red-200">
                          <p className="text-xs text-gray-600 font-semibold">CIDR 1</p>
                          <p className="font-mono text-red-900 font-bold">{overlap.cidr1}</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-red-200">
                          <p className="text-xs text-gray-600 font-semibold">CIDR 2</p>
                          <p className="font-mono text-red-900 font-bold">{overlap.cidr2}</p>
                        </div>
                      </div>
                      <div className="p-2 bg-red-200 rounded">
                        <p className="text-xs text-red-700 font-semibold">Overlapping Range</p>
                        <p className="font-mono text-red-900 font-bold text-sm">{overlap.overlapRange}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.suggestions.length > 0 && (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <span>💡</span> Suggestions
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-900">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                No Overlaps Detected
              </h3>
              <p className="text-gray-600">
                All CIDR blocks are unique and non-conflicting.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

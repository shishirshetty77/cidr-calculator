'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const [cidrs, setCidrs] = useState('');
  const [result, setResult] = useState<OverlapResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    const cidrArray = cidrs.split('\n').map(c => c.trim()).filter(c => c);

    if (cidrArray.length < 2) {
      setError('Please enter at least 2 CIDR blocks');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/overlap-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidrs: cidrArray })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Check failed');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CIDR Overlap Checker</CardTitle>
          <CardDescription>
            Check multiple CIDR blocks for overlaps and conflicts. Enter one CIDR per line.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">CIDR Blocks (one per line)</label>
            <textarea
              value={cidrs}
              onChange={(e) => setCidrs(e.target.value)}
              placeholder="192.168.1.0/24&#10;192.168.2.0/24&#10;10.0.0.0/16"
              rows={8}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <p className="text-xs text-muted-foreground">
              Enter CIDR blocks to check for overlapping IP ranges
            </p>
          </div>

          <Button
            onClick={handleCheck}
            disabled={loading || !cidrs.trim()}
            className="w-full"
          >
            {loading ? 'Checking...' : 'Check for Overlaps'}
          </Button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <p className="text-sm font-semibold text-destructive">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {result.hasOverlaps ? 'Overlaps Detected' : 'No Overlaps Found'}
                </CardTitle>
                <CardDescription>
                  {result.hasOverlaps 
                    ? `${result.overlaps.length} conflict${result.overlaps.length !== 1 ? 's' : ''} identified`
                    : 'All CIDR blocks are non-overlapping'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!result.hasOverlaps && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-success/10 border border-success/20 rounded-lg text-center"
                  >
                    <p className="text-lg font-semibold text-success">All Clear</p>
                    <p className="text-sm text-success/80 mt-1">
                      No overlapping IP ranges detected in your CIDR blocks
                    </p>
                  </motion.div>
                )}

                {result.hasOverlaps && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Conflicts:</h4>
                    {result.overlaps.map((overlap, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-sm">{overlap.cidr1}</span>
                              <span className="text-muted-foreground text-xs">overlaps with</span>
                              <span className="font-mono font-semibold text-sm">{overlap.cidr2}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Overlap range: <span className="font-mono">{overlap.overlapRange}</span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Suggestions:</h4>
                    {result.suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-3 bg-info/10 border border-info/20 rounded-lg"
                      >
                        <p className="text-sm text-info-foreground">{suggestion}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IP Range to CIDR Converter</CardTitle>
          <CardDescription>
            Convert an IP address range to optimal CIDR notation blocks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start IP Address"
              value={startIP}
              onChange={(e) => setStartIP(e.target.value)}
              placeholder="e.g., 10.0.0.0"
              helperText="Starting IP of the range"
            />
            <Input
              label="End IP Address"
              value={endIP}
              onChange={(e) => setEndIP(e.target.value)}
              placeholder="e.g., 10.0.3.255"
              helperText="Ending IP of the range"
            />
          </div>

          <Button
            onClick={handleConvert}
            disabled={loading || !startIP.trim() || !endIP.trim()}
            className="w-full"
          >
            {loading ? 'Converting...' : 'Convert to CIDR'}
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
        {result && result.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>CIDR Blocks</CardTitle>
                <CardDescription>
                  {result.length} optimal CIDR block{result.length !== 1 ? 's' : ''} for the range {startIP} - {endIP}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.map((cidr, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors"
                    >
                      <span className="font-mono font-semibold">{cidr}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(cidr)}
                      >
                        Copy
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

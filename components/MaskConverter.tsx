'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MaskResult {
  prefix: number;
  subnetMask: string;
  wildcardMask: string;
  binaryMask: string;
  cidrNotation: string;
}

export default function MaskConverter() {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'cidr' | 'subnet' | 'wildcard' | 'prefix'>('cidr');
  const [result, setResult] = useState<MaskResult | null>(null);
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
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'cidr':
        return 'e.g., 192.168.1.0/24';
      case 'subnet':
        return 'e.g., 255.255.255.0';
      case 'wildcard':
        return 'e.g., 0.0.0.255';
      case 'prefix':
        return 'e.g., 24';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'cidr':
        return 'CIDR Notation';
      case 'subnet':
        return 'Subnet Mask';
      case 'wildcard':
        return 'Wildcard Mask';
      case 'prefix':
        return 'Prefix Length';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Netmask Converter</CardTitle>
          <CardDescription>
            Convert between CIDR notation, subnet masks, wildcard masks, and prefix lengths.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={type === 'cidr' ? 'default' : 'outline'}
                onClick={() => setType('cidr')}
                size="sm"
              >
                CIDR
              </Button>
              <Button
                variant={type === 'subnet' ? 'default' : 'outline'}
                onClick={() => setType('subnet')}
                size="sm"
              >
                Subnet Mask
              </Button>
              <Button
                variant={type === 'wildcard' ? 'default' : 'outline'}
                onClick={() => setType('wildcard')}
                size="sm"
              >
                Wildcard
              </Button>
              <Button
                variant={type === 'prefix' ? 'default' : 'outline'}
                onClick={() => setType('prefix')}
                size="sm"
              >
                Prefix
              </Button>
            </div>
          </div>

          <Input
            label={getLabel()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            helperText="Enter the value to convert"
          />

          <Button
            onClick={handleConvert}
            disabled={loading || !input.trim()}
            className="w-full"
          >
            {loading ? 'Converting...' : 'Convert'}
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
                <CardTitle>Conversion Results</CardTitle>
                <CardDescription>All equivalent representations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard label="Prefix Length" value={`/${result.prefix}`} />
                  <ResultCard label="CIDR Notation" value={result.cidrNotation} />
                  <ResultCard label="Subnet Mask" value={result.subnetMask} />
                  <ResultCard label="Wildcard Mask" value={result.wildcardMask} />
                  <div className="md:col-span-2">
                    <ResultCard 
                      label="Binary Mask" 
                      value={result.binaryMask}
                      mono
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  mono?: boolean;
}

function ResultCard({ label, value, mono }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors"
    >
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-semibold ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </p>
    </motion.div>
  );
}

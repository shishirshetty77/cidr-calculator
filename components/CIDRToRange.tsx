'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
          <CardTitle>CIDR to IP Range Calculator</CardTitle>
          <CardDescription>
            Enter a CIDR notation to calculate network details, IP ranges, and subnet information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="CIDR Notation"
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && cidr.trim() && handleCalculate()}
            placeholder="e.g., 192.168.1.0/24"
            helperText="Enter a valid CIDR block with prefix length (0-32)"
          />

          <Button
            onClick={handleCalculate}
            disabled={loading || !cidr.trim()}
            className="w-full"
          >
            {loading ? 'Calculating...' : 'Calculate Range'}
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
                <CardTitle>Network Information</CardTitle>
                <CardDescription>Complete details for {result.cidr}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard label="Network Address" value={result.networkAddress} />
                  <InfoCard label="Broadcast Address" value={result.broadcastAddress} />
                  <InfoCard label="First Usable IP" value={result.firstUsable} />
                  <InfoCard label="Last Usable IP" value={result.lastUsable} />
                  <InfoCard label="Total Hosts" value={result.totalHosts.toLocaleString()} />
                  <InfoCard label="Usable Hosts" value={result.usableHosts.toLocaleString()} />
                  <InfoCard label="Subnet Mask" value={result.subnetMask} />
                  <InfoCard label="Wildcard Mask" value={result.wildcardMask} />
                  <InfoCard label="IP Class" value={`Class ${result.ipClass}`} />
                  <div className="md:col-span-2">
                    <InfoCard 
                      label="Binary Subnet Mask" 
                      value={result.binarySubnetMask}
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

interface InfoCardProps {
  label: string;
  value: string;
  mono?: boolean;
}

function InfoCard({ label, value, mono }: InfoCardProps) {
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

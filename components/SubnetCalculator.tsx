'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
          <CardTitle>Subnet Calculator</CardTitle>
          <CardDescription>
            Divide a network into subnets by specifying either the number of subnets or hosts per subnet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Network CIDR"
            value={networkCIDR}
            onChange={(e) => setNetworkCIDR(e.target.value)}
            placeholder="e.g., 172.16.0.0/16"
            helperText="Base network to subdivide"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Division Method</label>
            <div className="flex gap-2">
              <Button
                variant={mode === 'subnets' ? 'default' : 'outline'}
                onClick={() => setMode('subnets')}
                className="flex-1"
              >
                By Subnets
              </Button>
              <Button
                variant={mode === 'hosts' ? 'default' : 'outline'}
                onClick={() => setMode('hosts')}
                className="flex-1"
              >
                By Hosts
              </Button>
            </div>
          </div>

          <Input
            label={mode === 'subnets' ? 'Number of Subnets' : 'Hosts per Subnet'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            min="1"
            placeholder={mode === 'subnets' ? 'e.g., 4' : 'e.g., 50'}
            helperText={mode === 'subnets' ? 'How many subnets to create' : 'Minimum hosts needed per subnet'}
          />

          <Button
            onClick={handleCalculate}
            disabled={loading || !networkCIDR.trim() || !value.trim()}
            className="w-full"
          >
            {loading ? 'Calculating...' : 'Calculate Subnets'}
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
                <CardTitle>Subnet Results</CardTitle>
                <CardDescription>
                  {result.length} subnet{result.length !== 1 ? 's' : ''} created from {networkCIDR}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.map((subnet, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-lg">{subnet.subnet}</span>
                        <span className="text-sm text-muted-foreground">
                          {subnet.usableHosts.toLocaleString()} usable hosts
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Network: </span>
                          <span className="font-mono">{subnet.networkAddress}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Broadcast: </span>
                          <span className="font-mono">{subnet.broadcastAddress}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Range: </span>
                          <span className="font-mono">{subnet.firstUsable} - {subnet.lastUsable}</span>
                        </div>
                      </div>
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

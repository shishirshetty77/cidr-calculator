import { z } from 'zod';

const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const cidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;

export const cidrSchema = z.string()
  .regex(cidrRegex, 'Invalid CIDR notation (e.g., 192.168.1.0/24)')
  .refine((val) => {
    const [, prefix] = val.split('/');
    const prefixNum = parseInt(prefix);
    return prefixNum >= 0 && prefixNum <= 32;
  }, 'Prefix must be between 0 and 32');

export const ipAddressSchema = z.string()
  .regex(ipv4Regex, 'Invalid IP address (e.g., 192.168.1.1)');

export const ipRangeSchema = z.object({
  startIP: ipAddressSchema,
  endIP: ipAddressSchema,
}).refine((data) => {
  const startParts = data.startIP.split('.').map(Number);
  const endParts = data.endIP.split('.').map(Number);
  
  for (let i = 0; i < 4; i++) {
    if (startParts[i] < endParts[i]) return true;
    if (startParts[i] > endParts[i]) return false;
  }
  return true;
}, 'Start IP must be less than or equal to End IP');

export const subnetSchema = z.object({
  networkCIDR: cidrSchema,
  mode: z.enum(['subnets', 'hosts']),
  value: z.coerce.number().int().positive('Value must be a positive number'),
});

export const maskConverterSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  type: z.enum(['cidr', 'subnet', 'wildcard', 'prefix']),
});

export const overlapCheckerSchema = z.object({
  cidrs: z.array(cidrSchema).min(2, 'At least two CIDR blocks required'),
});

# 🌐 CIDR Calculator Pro

A complete, modern CIDR utility web application built with Next.js, TypeScript, and Tailwind CSS. Professional network planning and IP management toolkit with real-time validation and an intuitive, premium UI.

## ✨ Features

### 1. 📊 CIDR to IP Range Calculator
- Convert CIDR notation to detailed network information
- Display network address, broadcast address, and usable IP range
- Calculate total hosts and usable hosts
- Show subnet mask, wildcard mask, and binary representations
- IP class identification

### 2. 🔄 IP Range to CIDR Converter
- Convert IP address ranges to optimal CIDR blocks
- Automatically calculates the best-fit CIDR notation
- Supports multiple CIDR blocks for complex ranges
- One-click copy functionality

### 3. 🔧 Subnet Calculator
- Divide networks by number of subnets needed
- Divide networks by minimum hosts per subnet
- Complete subnet information including:
  - Network and broadcast addresses
  - Usable IP ranges
  - Host counts per subnet
- Visual subnet table with copy options

### 4. 🔀 Netmask Converter
- Convert between CIDR notation, subnet masks, wildcard masks, and prefix lengths
- Perfect for firewall and ACL rule configuration
- Binary mask visualization
- Support for all common netmask formats

### 5. ⚠️ CIDR Overlap Checker
- Identify overlapping CIDR blocks
- Detect conflicts in network configurations
- Receive intelligent suggestions for corrections
- Visual conflict highlighting

## 🏗️ Architecture

```
cidr/
├── app/
│   ├── api/
│   │   ├── cidr-to-range/
│   │   ├── range-to-cidr/
│   │   ├── subnet/
│   │   ├── mask-converter/
│   │   └── overlap-checker/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── CIDRToRange.tsx
│   ├── RangeToCIDR.tsx
│   ├── SubnetCalculator.tsx
│   ├── MaskConverter.tsx
│   └── OverlapChecker.tsx
└── utils/
    └── ipMath.ts (Core IP calculation utilities)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Validation**: Real-time client & server-side validation
- **Deployment**: Optimized for Vercel

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🎨 UI/UX Features

- **Clean & Modern Design**: Gradient backgrounds, smooth shadows, and premium feel
- **Mobile-First Responsive**: Works perfectly on all screen sizes
- **Smooth Animations**: Fade-in and slide-up effects for better UX
- **Real-time Validation**: Instant feedback on user input
- **Tab Navigation**: Easy switching between tools
- **Copy to Clipboard**: Quick copy functionality for all results
- **Error Handling**: Clear, helpful error messages
- **Accessibility**: Semantic HTML and ARIA labels

## 🧮 Core Utilities (utils/ipMath.ts)

All IP mathematics are handled server-side with strict validation:

- `ipToInt()` / `intToIp()`: IP ↔ Integer conversion
- `validateCIDR()` / `validateIP()`: Input validation
- `prefixToMask()` / `maskToPrefix()`: Mask conversion
- `cidrToRange()`: CIDR to IP range calculation
- `rangeToCIDR()`: IP range to optimal CIDR blocks
- `subnetByCount()` / `subnetByHosts()`: Subnetting
- `checkMultipleOverlaps()`: Overlap detection

## 📝 API Endpoints

- `POST /api/cidr-to-range`: Calculate IP range from CIDR
- `POST /api/range-to-cidr`: Convert IP range to CIDR
- `POST /api/subnet`: Calculate subnets
- `POST /api/mask-converter`: Convert between mask formats
- `POST /api/overlap-checker`: Check CIDR overlaps

## 🔍 Example Usage

### CIDR to Range
Input: `192.168.1.0/24`  
Output: Network info, 254 usable hosts, full range details

### Range to CIDR
Input: `10.0.0.0` to `10.0.3.255`  
Output: `10.0.0.0/22`

### Subnetting
Input: `172.16.0.0/16`, 4 subnets  
Output: Four /18 subnets with complete details

### Overlap Check
Input: Multiple CIDRs  
Output: Conflict detection and suggestions

## 📄 License

MIT License - feel free to use this project for any purpose.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

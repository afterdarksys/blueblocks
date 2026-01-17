'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Download, ChevronLeft, ChevronRight,
  Shield, Database, Heart, Truck, FileCheck, Users,
  Zap, Lock, Globe, Code, Layers, Award,
  TrendingUp, DollarSign, Clock, CheckCircle, XCircle
} from 'lucide-react';

const slides = [
  { id: 'title', title: 'Title' },
  { id: 'problem', title: 'The Problem' },
  { id: 'what-not', title: 'What We\'re NOT' },
  { id: 'what-is', title: 'What We ARE' },
  { id: 'revenue', title: 'Revenue Model' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'tech-stack', title: 'Technology' },
  { id: 'security', title: 'Security' },
  { id: 'health-id', title: 'NFT Health ID' },
  { id: 'compliance', title: 'Compliance' },
  { id: 'insurance', title: 'Insurance Claims' },
  { id: 'supply-chain', title: 'Supply Chain' },
  { id: 'tokenomics', title: 'Tokenomics' },
  { id: 'utility', title: 'Token Utility' },
  { id: 'roadmap', title: 'Roadmap' },
  { id: 'metrics', title: 'Growth Metrics' },
  { id: 'comparison', title: 'Competitive Edge' },
  { id: 'contact', title: 'Get Started' },
];

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Controls */}
      <div className="sticky top-16 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">BlueBlocks Presentation</h1>
            <span className="text-sm text-slate-400">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Slide Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <select
                value={currentSlide}
                onChange={(e) => setCurrentSlide(Number(e.target.value))}
                className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm"
              >
                {slides.map((slide, idx) => (
                  <option key={slide.id} value={idx}>
                    {idx + 1}. {slide.title}
                  </option>
                ))}
              </select>
              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href="/docs/BLUEBLOCKS_PRESENTATION.md"
              download="BlueBlocks_Presentation.md"
              className="flex items-center space-x-2 px-4 py-2 bg-blueblocks-600 hover:bg-blueblocks-700 text-white rounded-lg text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <SlideContent slideId={slides[currentSlide].id} />
      </div>

      {/* Slide Dots */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentSlide
                ? 'bg-blueblocks-500 w-8'
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="fixed bottom-8 right-8 text-xs text-slate-500">
        Use arrow keys to navigate
      </div>
    </div>
  );
}

function SlideContent({ slideId }: { slideId: string }) {
  switch (slideId) {
    case 'title':
      return <TitleSlide />;
    case 'problem':
      return <ProblemSlide />;
    case 'what-not':
      return <WhatNotSlide />;
    case 'what-is':
      return <WhatIsSlide />;
    case 'revenue':
      return <RevenueSlide />;
    case 'architecture':
      return <ArchitectureSlide />;
    case 'tech-stack':
      return <TechStackSlide />;
    case 'security':
      return <SecuritySlide />;
    case 'health-id':
      return <HealthIdSlide />;
    case 'compliance':
      return <ComplianceSlide />;
    case 'insurance':
      return <InsuranceSlide />;
    case 'supply-chain':
      return <SupplyChainSlide />;
    case 'tokenomics':
      return <TokenomicsSlide />;
    case 'utility':
      return <UtilitySlide />;
    case 'roadmap':
      return <RoadmapSlide />;
    case 'metrics':
      return <MetricsSlide />;
    case 'comparison':
      return <ComparisonSlide />;
    case 'contact':
      return <ContactSlide />;
    default:
      return <TitleSlide />;
  }
}

// Slide Components

function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Logo Image */}
      <div className="mb-8 relative">
        <img
          src="/images/brand/logo-geometric-blocks.png"
          alt="BlueBlocks Logo"
          className="w-32 h-32 object-contain"
        />
      </div>

      <h1 className="text-6xl font-bold text-white mb-4">
        Blue<span className="text-blueblocks-400">Blocks</span>
      </h1>
      <p className="text-2xl text-slate-300 mb-8">Global Health Infrastructure</p>

      {/* Mascot */}
      <div className="mb-8">
        <img
          src="/images/brand/mascot-waving.png"
          alt="BlueBlocks Mascot"
          className="w-48 h-48 object-contain mx-auto"
        />
      </div>

      <div className="px-6 py-3 bg-slate-800 rounded-full border border-slate-700">
        <p className="text-blueblocks-400 font-medium">
          "Healthcare Infrastructure, Not Cryptocurrency"
        </p>
      </div>
    </div>
  );
}

function ProblemSlide() {
  const problems = [
    { icon: Database, title: 'Fragmented Records', stat: '3-30 days', desc: 'to transfer medical records' },
    { icon: Clock, title: 'Slow Claims', stat: '30-90 days', desc: 'average claim processing' },
    { icon: Shield, title: 'Counterfeit Drugs', stat: '$200B+', desc: 'annual counterfeit market' },
    { icon: Lock, title: 'Data Breaches', stat: '725', desc: 'healthcare breaches in 2023' },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Healthcare Today is Broken</h2>
      <p className="text-slate-400 text-center mb-12">Critical problems demanding blockchain solutions</p>

      <div className="grid grid-cols-2 gap-6">
        {problems.map((problem) => (
          <div key={problem.title} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{problem.title}</h3>
                <p className="text-3xl font-bold text-red-400 mb-1">{problem.stat}</p>
                <p className="text-slate-400">{problem.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mascot thinking */}
      <div className="flex items-center justify-center mt-8">
        <img
          src="/images/brand/mascot-thinking.png"
          alt="Thinking about problems"
          className="w-32 h-32 object-contain"
        />
        <div className="ml-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/30 max-w-md">
          <p className="text-red-300 text-lg">
            <span className="font-bold">30%</span> of healthcare spending goes to administrative costs
          </p>
        </div>
      </div>
    </div>
  );
}

function WhatNotSlide() {
  const items = [
    'NOT a cryptocurrency for speculation',
    'NOT a get-rich-quick token scheme',
    'NOT competing with Bitcoin or Ethereum as currency',
    'NOT a meme coin or DeFi yield farm',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-4xl font-bold text-white mb-12 text-center">What BlueBlocks is NOT</h2>

      <div className="flex items-start space-x-8">
        <div className="space-y-4 max-w-2xl">
          {items.map((item) => (
            <div key={item} className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-xl text-slate-300">{item}</p>
            </div>
          ))}
        </div>

        {/* Mascot with shield */}
        <img
          src="/images/brand/mascot-shield.png"
          alt="Protection mascot"
          className="w-48 h-48 object-contain"
        />
      </div>
    </div>
  );
}

function WhatIsSlide() {
  const items = [
    'Healthcare infrastructure on blockchain technology',
    'Patient-owned, sovereign health identity system',
    'Global medicine & agricultural supply chain verification',
    'HIPAA/GDPR compliant decentralized health records',
    'AI-powered health analytics with privacy preservation',
    'Modern replacement for broken health insurance systems',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-4xl font-bold text-white mb-12 text-center">What BlueBlocks IS</h2>

      <div className="flex items-start space-x-8">
        {/* Mascot thumbs up */}
        <img
          src="/images/brand/mascot-thumbsup.png"
          alt="Thumbs up mascot"
          className="w-48 h-48 object-contain"
        />

        <div className="space-y-4 max-w-2xl">
          {items.map((item) => (
            <div key={item} className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-xl text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueSlide() {
  const products = [
    {
      icon: Code,
      title: 'BBT Token',
      subtitle: 'Governance',
      features: ['Validator staking', 'Network governance', 'AI compute payment']
    },
    {
      icon: Users,
      title: 'NFT Health ID',
      subtitle: 'Patient Identity',
      features: ['Portable ID', 'Medical history link', 'Emergency access', 'Insurance claims link']
    },
    {
      icon: Globe,
      title: 'Enterprise Licensing',
      subtitle: 'B2B Solutions',
      features: ['Hospital deployments', 'Insurance integration', 'Pharma supply chain']
    },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Revenue Model</h2>
      <p className="text-slate-400 text-center mb-8">What we sell</p>

      {/* Token images */}
      <div className="flex justify-center mb-8">
        <img
          src="/images/brand/token-stack.png"
          alt="BBT Token Stack"
          className="w-48 h-48 object-contain"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.title} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blueblocks-500/20 rounded-xl">
                <product.icon className="w-6 h-6 text-blueblocks-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                <p className="text-sm text-blueblocks-400">{product.subtitle}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="text-slate-400 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blueblocks-500 rounded-full" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-xl p-4 text-center">
          <p className="text-slate-400">2026</p>
          <p className="text-2xl font-bold text-white">$2-5M</p>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 text-center">
          <p className="text-slate-400">2027</p>
          <p className="text-2xl font-bold text-white">$20-50M</p>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 text-center">
          <p className="text-slate-400">2028</p>
          <p className="text-2xl font-bold text-white">$100-200M</p>
        </div>
      </div>
    </div>
  );
}

function ArchitectureSlide() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Network Architecture</h2>
      <p className="text-slate-400 text-center mb-12">Multi-layer blockchain design</p>

      <div className="space-y-4">
        {/* Layer 3 */}
        <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Layer 3: Applications</h3>
          <div className="flex justify-around">
            {['Patient dApp', 'Provider Portal', 'Insurance Claims', 'Pharma Track', 'Research Access'].map((app) => (
              <div key={app} className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                  <Layers className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-slate-400">{app}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2 */}
        <div className="bg-blueblocks-500/10 rounded-2xl p-6 border border-blueblocks-500/30">
          <h3 className="text-lg font-semibold text-blueblocks-400 mb-4">Layer 2: Sidechains</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Hospital Sidechain', features: ['EHR Data', 'Lab Results', 'Imaging'] },
              { name: 'Supply Chain', features: ['Medicine', 'Agriculture', 'Logistics'] },
              { name: 'Insurance Chain', features: ['Claims', 'Billing', 'Payments'] },
            ].map((chain) => (
              <div key={chain.name} className="bg-slate-800/50 rounded-xl p-4">
                <h4 className="font-medium text-white mb-2">{chain.name}</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  {chain.features.map((f) => <li key={f}>• {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 1 */}
        <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/30">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Layer 1: Mainchain</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: 'Consensus', desc: 'Tendermint BFT' },
              { name: 'Identity', desc: 'NFT Health IDs' },
              { name: 'State', desc: 'IAVL + TimescaleDB' },
              { name: 'Oracle', desc: 'AI Compute Gateway' },
            ].map((component) => (
              <div key={component.name} className="bg-slate-800/50 rounded-xl p-4 text-center">
                <h4 className="font-medium text-white">{component.name}</h4>
                <p className="text-sm text-slate-400">{component.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TechStackSlide() {
  const stack = [
    { category: 'Core Blockchain', items: [
      { name: 'Language', value: 'Go' },
      { name: 'Consensus', value: 'PoW → BFT' },
      { name: 'Block Time', value: '~2 min' },
      { name: 'Finality', value: 'Instant' },
    ]},
    { category: 'Smart Contracts', items: [
      { name: 'Primary', value: 'Starlark (Python)' },
      { name: 'EVM', value: 'Solidity' },
      { name: 'WASM', value: 'Rust' },
      { name: 'Future', value: 'Move' },
    ]},
    { category: 'Cryptography', items: [
      { name: 'Encryption', value: 'AES-256-GCM' },
      { name: 'Signing', value: 'Ed25519' },
      { name: 'KDF', value: 'Argon2id' },
      { name: 'Hashing', value: 'SHA-256' },
    ]},
    { category: 'Storage', items: [
      { name: 'Off-chain', value: 'IPFS' },
      { name: 'Indexing', value: 'TimescaleDB' },
      { name: 'State', value: 'Merkle Tree' },
      { name: 'Cache', value: 'Redis' },
    ]},
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Technology Stack</h2>
      <p className="text-slate-400 text-center mb-12">Enterprise-grade infrastructure</p>

      <div className="grid grid-cols-2 gap-6">
        {stack.map((section) => (
          <div key={section.category} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-blueblocks-400 mb-4">{section.category}</h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="text-slate-400">{item.name}</span>
                  <span className="font-mono text-white bg-slate-700/50 px-3 py-1 rounded-lg text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySlide() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Security Architecture</h2>
      <p className="text-slate-400 text-center mb-8">Defense in depth</p>

      {/* Security mascot */}
      <div className="flex justify-center mb-8">
        <img
          src="/images/brand/medical-data-shield.png"
          alt="Medical Data Shield"
          className="w-64 h-64 object-contain"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Encryption at Rest
          </h3>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-green-400 font-bold">AES</span>
              </div>
              <p className="text-sm text-slate-400">256-GCM</p>
              <p className="text-xs text-slate-500">AEAD</p>
            </div>
            <span className="text-slate-600">→</span>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-green-400 font-bold text-sm">Argon2</span>
              </div>
              <p className="text-sm text-slate-400">KDF</p>
              <p className="text-xs text-slate-500">64MB RAM</p>
            </div>
            <span className="text-slate-600">→</span>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-green-400 font-bold text-sm">Ed25519</span>
              </div>
              <p className="text-sm text-slate-400">Signing</p>
              <p className="text-xs text-slate-500">256-bit</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Encryption in Transit
          </h3>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-blue-400 font-bold text-sm">TLS 1.3</span>
              </div>
              <p className="text-sm text-slate-400">HTTPS</p>
              <p className="text-xs text-slate-500">PFS</p>
            </div>
            <span className="text-slate-600">→</span>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-blue-400 font-bold text-sm">mTLS</span>
              </div>
              <p className="text-sm text-slate-400">Node-Node</p>
              <p className="text-xs text-slate-500">Cert Pinning</p>
            </div>
            <span className="text-slate-600">→</span>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-blue-400 font-bold text-sm">Noise</span>
              </div>
              <p className="text-sm text-slate-400">P2P</p>
              <p className="text-xs text-slate-500">IBC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthIdSlide() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">NFT Health ID</h2>
      <p className="text-slate-400 text-center mb-8">Your health, your ownership</p>

      <div className="flex items-center justify-center space-x-8">
        {/* Token image */}
        <img
          src="/images/brand/token-gold-coin.png"
          alt="BBT Gold Coin"
          className="w-48 h-48 object-contain"
        />

        <div className="max-w-lg">
          <div className="bg-gradient-to-br from-blueblocks-600 to-blueblocks-800 rounded-3xl p-8 shadow-2xl shadow-blueblocks-500/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blueblocks-200 text-sm">BLUEBLOCKS HEALTH ID</p>
                <p className="text-white text-2xl font-bold">#4,521,893</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-blueblocks-200 text-xs mb-2">LINKED RECORDS</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-white">
                  <span className="mr-2">📋</span> Medical History (12)
                </div>
                <div className="flex items-center text-white">
                  <span className="mr-2">💊</span> Prescriptions (3)
                </div>
                <div className="flex items-center text-white">
                  <span className="mr-2">🔬</span> Lab Results (8)
                </div>
                <div className="flex items-center text-white">
                  <span className="mr-2">🏥</span> Insurance (1)
                </div>
              </div>
            </div>

            <div className="bg-red-500/20 rounded-xl p-4">
              <p className="text-red-200 text-xs mb-2">EMERGENCY ACCESS</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-white">
                <div>🚨 Blood Type: O+</div>
                <div>⚠️ Allergies: Penicillin</div>
                <div>💉 Diabetes Type 2</div>
                <div>📞 +1-555-0123</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h4 className="text-white font-medium mb-2">Traditional</h4>
          <ul className="text-sm text-red-400 space-y-1">
            <li>❌ Hospital owns data</li>
            <li>❌ Paper/fax transfer</li>
            <li>❌ No audit trail</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h4 className="text-white font-medium mb-2">BlueBlocks</h4>
          <ul className="text-sm text-green-400 space-y-1">
            <li>✅ Patient owns data</li>
            <li>✅ Instant digital</li>
            <li>✅ Immutable audit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ComplianceSlide() {
  const hipaa = [
    { req: 'Access Controls', impl: 'NFT ownership + consent smart contracts' },
    { req: 'Audit Logging', impl: 'Immutable on-chain audit trail' },
    { req: 'Encryption', impl: 'AES-256-GCM at rest, TLS 1.3 in transit' },
    { req: 'Integrity', impl: 'SHA-256 hashes anchored to blockchain' },
    { req: 'Breach Detection', impl: 'Anomaly detection via AI oracles' },
    { req: 'Patient Rights', impl: 'Self-sovereign data with NFT ownership' },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Compliance Matrix</h2>
      <p className="text-slate-400 text-center mb-12">Built-in regulatory compliance</p>

      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4">HIPAA Compliance</h3>
        <div className="space-y-3">
          {hipaa.map((item) => (
            <div key={item.req} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
              <span className="text-slate-400">{item.req}</span>
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                {item.impl}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { name: 'HL7 FHIR R4', status: 'done' },
          { name: 'SOC 2 Type II', status: 'progress' },
          { name: 'HITRUST CSF', status: 'planned' },
          { name: 'ISO 27001', status: 'planned' },
        ].map((cert) => (
          <div key={cert.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <Award className={`w-8 h-8 mx-auto mb-2 ${
              cert.status === 'done' ? 'text-green-400' :
              cert.status === 'progress' ? 'text-yellow-400' : 'text-slate-500'
            }`} />
            <p className="text-white font-medium text-sm">{cert.name}</p>
            <p className={`text-xs ${
              cert.status === 'done' ? 'text-green-400' :
              cert.status === 'progress' ? 'text-yellow-400' : 'text-slate-500'
            }`}>
              {cert.status === 'done' ? '✅ Complete' :
               cert.status === 'progress' ? '🔄 In Progress' : '📋 Planned'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsuranceSlide() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Insurance Claims Revolution</h2>
      <p className="text-slate-400 text-center mb-8">From months to hours</p>

      <div className="flex justify-center mb-8">
        <img
          src="/images/brand/pot-of-gold.png"
          alt="Pot of Gold"
          className="w-48 h-48 object-contain"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-red-400 mb-4">Traditional Process</h3>
          <div className="space-y-3">
            {['Visit Doctor', 'Paper claim submitted', 'Manual review (weeks)', 'Denied? Appeal (weeks)', 'Payment (30-90 days)'].map((step, i) => (
              <div key={step} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-sm">
                  {i + 1}
                </div>
                <span className="text-slate-400">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-4">BlueBlocks Process</h3>
          <div className="space-y-3">
            {['Visit Doctor', 'Smart contract triggered', 'AI oracle validates (seconds)', 'USDC payment (< 24 hrs)'].map((step, i) => (
              <div key={step} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">
                  {i + 1}
                </div>
                <span className="text-slate-300">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { metric: 'Claim Processing', before: '30-90 days', after: '< 24 hours' },
          { metric: 'Denial Rate', before: '20-30%', after: '< 5%' },
          { metric: 'Admin Overhead', before: '30%', after: '< 5%' },
        ].map((item) => (
          <div key={item.metric} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">{item.metric}</p>
            <div className="flex items-center justify-between">
              <span className="text-red-400 line-through">{item.before}</span>
              <span className="text-slate-600">→</span>
              <span className="text-green-400 font-bold">{item.after}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupplyChainSlide() {
  const steps = [
    { name: 'Origin', icon: '🌱', desc: 'GPS location, Supplier cert' },
    { name: 'Manufacture', icon: '🏭', desc: 'Batch #, QA cert, Expiry' },
    { name: 'Ship', icon: '🚚', desc: 'Temp log, Chain of custody' },
    { name: 'Dispense', icon: '💊', desc: 'Rx fill, Patient ID link' },
    { name: 'Use', icon: '👤', desc: 'NFT Health ID linked' },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Supply Chain Verification</h2>
      <p className="text-slate-400 text-center mb-8">From raw materials to patient</p>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => (
          <div key={step.name} className="flex items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mb-2 mx-auto text-3xl border border-slate-700">
                {step.icon}
              </div>
              <p className="text-white font-medium">{step.name}</p>
              <p className="text-xs text-slate-500">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 text-slate-600">→</div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blueblocks-500/10 rounded-2xl p-6 border border-blueblocks-500/30">
        <p className="text-center text-blueblocks-300">
          <span className="text-xl mr-2">📱</span>
          Consumer scans QR code → Full supply chain history verified instantly
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h4 className="text-red-400 font-medium mb-2">Traditional</h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Counterfeit detection: Difficult</li>
            <li>• Recall speed: Days/weeks</li>
            <li>• Chain of custody: Paper trail</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h4 className="text-green-400 font-medium mb-2">BlueBlocks</h4>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Counterfeit detection: Instant</li>
            <li>• Recall speed: Hours</li>
            <li>• Chain of custody: Immutable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TokenomicsSlide() {
  const distribution = [
    { name: 'Community', percent: 40, amount: '400M', color: 'bg-blue-500' },
    { name: 'Development', percent: 20, amount: '200M', color: 'bg-purple-500' },
    { name: 'Validators', percent: 15, amount: '150M', color: 'bg-green-500' },
    { name: 'Treasury', percent: 12, amount: '120M', color: 'bg-yellow-500' },
    { name: 'Team', percent: 8, amount: '80M', color: 'bg-orange-500' },
    { name: 'Advisors', percent: 5, amount: '50M', color: 'bg-red-500' },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">BBT Tokenomics</h2>
      <p className="text-slate-400 text-center mb-4">Total Supply: 1,000,000,000 BBT</p>

      {/* Token hero image */}
      <div className="flex justify-center mb-8">
        <img
          src="/images/brand/token-hero-floating.png"
          alt="BBT Token"
          className="w-40 h-40 object-contain"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="space-y-3">
            {distribution.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{item.name}</span>
                  <span className="text-white">{item.percent}% ({item.amount})</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Vesting Schedule</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Community</span>
              <span className="text-slate-300">10 years via rewards</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Development</span>
              <span className="text-slate-300">4-year, 1-year cliff</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Validators</span>
              <span className="text-slate-300">8-year emission</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Treasury</span>
              <span className="text-slate-300">Governance controlled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Team</span>
              <span className="text-slate-300">4-year, 1-year cliff</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Advisors</span>
              <span className="text-slate-300">2-year, 6-month cliff</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UtilitySlide() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Token Utility</h2>
      <p className="text-slate-400 text-center mb-8">What BBT does</p>

      {/* Token images */}
      <div className="flex justify-center mb-8">
        <img
          src="/images/brand/raining-tokens.png"
          alt="Raining Tokens"
          className="w-48 h-48 object-contain"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Governance</h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• Protocol upgrades</li>
            <li>• Validator selection</li>
            <li>• Treasury allocation</li>
            <li>• Fee structure</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">1 BBT = 1 Vote</p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Staking</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Standard</span>
              <span className="text-green-400">8-12% APY</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Healthcare</span>
              <span className="text-green-400">10-15% APY</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Master Node</span>
              <span className="text-green-400">15-20% APY</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-blueblocks-400 mb-4">Services</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Health ID Mint</span>
              <span className="text-white">100 BBT</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Contract Deploy</span>
              <span className="text-white">50 BBT</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Supply Anchor</span>
              <span className="text-white">5 BBT</span>
            </div>
          </div>
          <p className="text-xs text-blueblocks-400 mt-4">10% discount vs USDC</p>
        </div>
      </div>
    </div>
  );
}

function RoadmapSlide() {
  const roadmap = [
    { quarter: 'Q1 2026', status: 'current', items: ['TypeScript SDK', 'CLI Tools', 'TimescaleDB Indexer', 'Block Explorer'] },
    { quarter: 'Q2 2026', status: 'upcoming', items: ['Tendermint BFT', 'IBC Protocol', 'Hospital Sidechain', 'SOC 2 Type II'] },
    { quarter: 'Q3 2026', status: 'planned', items: ['Supply Chain Launch', 'Oracle Network', 'ZK-Proof Identity', 'FDA Compliance'] },
    { quarter: 'Q1 2027', status: 'future', items: ['MAINNET LAUNCH', 'NFT Health ID Public', 'Cross-chain Bridges', '100+ Partners'] },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Development Roadmap</h2>
      <p className="text-slate-400 text-center mb-12">Building the future of healthcare</p>

      <div className="grid grid-cols-4 gap-4">
        {roadmap.map((phase) => (
          <div
            key={phase.quarter}
            className={`rounded-2xl p-6 border ${
              phase.status === 'current'
                ? 'bg-blueblocks-500/20 border-blueblocks-500'
                : 'bg-slate-800/50 border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-2 mb-4">
              {phase.status === 'current' && (
                <span className="w-2 h-2 bg-blueblocks-500 rounded-full animate-pulse" />
              )}
              <h3 className={`font-semibold ${
                phase.status === 'current' ? 'text-blueblocks-400' : 'text-white'
              }`}>
                {phase.quarter}
              </h3>
            </div>
            <ul className="space-y-2 text-sm">
              {phase.items.map((item) => (
                <li
                  key={item}
                  className={`${
                    phase.status === 'current' ? 'text-slate-300' : 'text-slate-400'
                  } ${item === 'MAINNET LAUNCH' ? 'font-bold text-green-400' : ''}`}
                >
                  {phase.status === 'current' ? '🔄 ' : ''}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsSlide() {
  const metrics = [
    { year: '2026 Q4', healthIds: '10K', providers: '50', claims: '100/day', tvl: '$1M' },
    { year: '2027 Q2', healthIds: '100K', providers: '500', claims: '1K/day', tvl: '$10M' },
    { year: '2027 Q4', healthIds: '500K', providers: '2K', claims: '10K/day', tvl: '$50M' },
    { year: '2028 Q4', healthIds: '2M', providers: '10K', claims: '50K/day', tvl: '$200M' },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Growth Projections</h2>
      <p className="text-slate-400 text-center mb-8">Network growth targets</p>

      {/* Wallet overflow image */}
      <div className="flex justify-center mb-8">
        <img
          src="/images/brand/wallet-overflow.png"
          alt="Wallet Overflow"
          className="w-48 h-48 object-contain"
        />
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Year</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Health IDs</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Providers</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Claims/Day</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">TVL (USDC)</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((row) => (
              <tr key={row.year} className="border-t border-slate-700">
                <td className="px-6 py-4 text-white font-medium">{row.year}</td>
                <td className="px-6 py-4 text-blueblocks-400">{row.healthIds}</td>
                <td className="px-6 py-4 text-green-400">{row.providers}</td>
                <td className="px-6 py-4 text-purple-400">{row.claims}</td>
                <td className="px-6 py-4 text-yellow-400">{row.tvl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Block Time', value: '3-5s', icon: Clock },
          { label: 'Finality', value: '< 10s', icon: Zap },
          { label: 'TPS', value: '10K+', icon: TrendingUp },
          { label: 'Uptime', value: '99.99%', icon: Shield },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <stat.icon className="w-6 h-6 text-blueblocks-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonSlide() {
  const features = [
    { name: 'Healthcare Focus', bb: true, others: [true, true, true, false] },
    { name: 'HIPAA Native', bb: true, others: [false, false, true, false] },
    { name: 'FHIR Support', bb: true, others: [false, false, false, false] },
    { name: 'Supply Chain', bb: true, others: [false, false, false, false] },
    { name: 'Insurance Claims', bb: true, others: [false, false, false, false] },
    { name: 'Patient Owned', bb: true, others: [false, true, false, false] },
    { name: 'Python Contracts', bb: true, others: [false, false, false, false] },
    { name: 'ZK Proofs', bb: true, others: [false, false, false, true] },
  ];

  const competitors = ['MedRec', 'Patientory', 'BurstIQ', 'Ethereum'];

  return (
    <div>
      <h2 className="text-4xl font-bold text-white mb-2 text-center">Competitive Advantage</h2>
      <p className="text-slate-400 text-center mb-12">Why BlueBlocks wins</p>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-slate-400">Feature</th>
              <th className="px-4 py-3 text-center text-blueblocks-400 font-bold">BlueBlocks</th>
              {competitors.map((c) => (
                <th key={c} className="px-4 py-3 text-center text-slate-400">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.name} className="border-t border-slate-700">
                <td className="px-4 py-3 text-slate-300">{feature.name}</td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                </td>
                {feature.others.map((has, i) => (
                  <td key={i} className="px-4 py-3 text-center">
                    {has ? (
                      <CheckCircle className="w-5 h-5 text-green-400/50 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400/50 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blueblocks-500/10 rounded-xl p-4 border border-blueblocks-500/30">
          <h4 className="text-blueblocks-400 font-medium mb-2">Healthcare-First Design</h4>
          <p className="text-sm text-slate-400">Built specifically for healthcare, not adapted from general-purpose chains</p>
        </div>
        <div className="bg-blueblocks-500/10 rounded-xl p-4 border border-blueblocks-500/30">
          <h4 className="text-blueblocks-400 font-medium mb-2">Full Ecosystem</h4>
          <p className="text-sm text-slate-400">Records + Insurance + Supply Chain + AI in one platform</p>
        </div>
      </div>
    </div>
  );
}

function ContactSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">Join BlueBlocks</h2>

      {/* Mascot celebrate */}
      <img
        src="/images/brand/mascot-celebrate.png"
        alt="Celebrate mascot"
        className="w-48 h-48 object-contain mb-8"
      />

      <div className="grid grid-cols-2 gap-6 max-w-4xl w-full mb-12">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">For Healthcare Providers</h3>
          <ul className="text-slate-400 space-y-2">
            <li>• Pilot program available</li>
            <li>• Free integration support</li>
            <li>• HIPAA compliance assistance</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">For Developers</h3>
          <ul className="text-slate-400 space-y-2">
            <li>• TypeScript SDK available now</li>
            <li>• Testnet open for building</li>
            <li>• Grant program for dApp builders</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">For Investors</h3>
          <ul className="text-slate-400 space-y-2">
            <li>• Seed round open</li>
            <li>• Strategic partnerships welcome</li>
            <li>• Token pre-sale Q2 2026</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">For Patients</h3>
          <ul className="text-slate-400 space-y-2">
            <li>• Early access program</li>
            <li>• Be first to own your health data</li>
            <li>• Join the waitlist</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <div className="px-8 py-4 bg-blueblocks-600 rounded-full inline-block">
          <p className="text-white font-medium">www.blueblocks.health</p>
        </div>
        <p className="text-slate-500 mt-4">"Healthcare Infrastructure, Not Cryptocurrency"</p>
      </div>
    </div>
  );
}

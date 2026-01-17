'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  Shield,
  Cpu,
  Heart,
  Pill,
  Brain,
  Coins,
  Wallet,
  TrendingUp,
  Calendar,
  PieChart,
  BarChart3,
  Lock,
  Target
} from 'lucide-react';

// Section definitions with icons
const sections = [
  { id: 'executive-summary', title: 'Executive Summary', icon: FileText },
  { id: 'network-architecture', title: 'Network Architecture', icon: Cpu },
  { id: 'security', title: 'Security & Encryption', icon: Shield },
  { id: 'health-identity', title: 'NFT-Based Health Identity', icon: Heart },
  { id: 'fhir-compliance', title: 'FHIR & Healthcare Compliance', icon: Pill },
  { id: 'supply-chain', title: 'Supply Chain Verification', icon: Target },
  { id: 'oracle-ai', title: 'Oracle & AI Services', icon: Brain },
  { id: 'tokenomics', title: 'Tokenomics', icon: Coins },
  { id: 'token-utility', title: 'Token Utility', icon: Wallet },
  { id: 'unlock-schedule', title: 'Token Unlock Schedule', icon: Lock },
  { id: 'treasury', title: 'Treasury Allocation', icon: PieChart },
  { id: 'profitability', title: 'Projected Profitability', icon: TrendingUp },
  { id: 'roadmap', title: 'Development Roadmap', icon: Calendar },
];

// Tokenomics data
const tokenomicsData = [
  { category: 'Community', amount: 400_000_000, percentage: 40, color: '#3B82F6', vesting: 'Released over 10 years via rewards' },
  { category: 'Development', amount: 200_000_000, percentage: 20, color: '#10B981', vesting: '4-year vest, 1-year cliff' },
  { category: 'Validators', amount: 150_000_000, percentage: 15, color: '#8B5CF6', vesting: 'Block rewards, 8-year emission' },
  { category: 'Treasury', amount: 120_000_000, percentage: 12, color: '#F59E0B', vesting: 'Governance controlled' },
  { category: 'Team', amount: 80_000_000, percentage: 8, color: '#EF4444', vesting: '4-year vest, 1-year cliff' },
  { category: 'Advisors', amount: 50_000_000, percentage: 5, color: '#EC4899', vesting: '2-year vest, 6-month cliff' },
];

// Treasury allocation data
const treasuryAllocation = [
  { category: 'Infrastructure', percentage: 35, color: '#3B82F6', description: 'Cloud, nodes, validators, monitoring' },
  { category: 'Research & Development', percentage: 30, color: '#10B981', description: 'Protocol improvements, new features' },
  { category: 'Security & Audits', percentage: 15, color: '#8B5CF6', description: 'Security audits, bug bounties' },
  { category: 'Legal & Compliance', percentage: 10, color: '#F59E0B', description: 'HIPAA, SOC2, regulatory compliance' },
  { category: 'Community Grants', percentage: 10, color: '#EC4899', description: 'Developer grants, ecosystem growth' },
];

// Token unlock schedule data (months from TGE)
const unlockSchedule = [
  { month: 0, community: 0, development: 0, validators: 0, treasury: 120, team: 0, advisors: 0, label: 'TGE' },
  { month: 6, community: 20, development: 0, validators: 9.4, treasury: 120, team: 0, advisors: 12.5, label: '6M' },
  { month: 12, community: 40, development: 50, validators: 18.8, treasury: 120, team: 20, advisors: 25, label: '1Y' },
  { month: 18, community: 60, development: 75, validators: 28.1, treasury: 120, team: 30, advisors: 37.5, label: '18M' },
  { month: 24, community: 80, development: 100, validators: 37.5, treasury: 120, team: 40, advisors: 50, label: '2Y' },
  { month: 36, community: 120, development: 150, validators: 56.3, treasury: 120, team: 60, advisors: 50, label: '3Y' },
  { month: 48, community: 160, development: 200, validators: 75, treasury: 120, team: 80, advisors: 50, label: '4Y' },
  { month: 60, community: 200, development: 200, validators: 93.8, treasury: 120, team: 80, advisors: 50, label: '5Y' },
  { month: 96, community: 320, development: 200, validators: 150, treasury: 120, team: 80, advisors: 50, label: '8Y' },
  { month: 120, community: 400, development: 200, validators: 150, treasury: 120, team: 80, advisors: 50, label: '10Y' },
];

// Projected profitability data
const profitabilityData = [
  { year: '2026 Q4', revenue: 0.5, costs: 1.2, users: 10000, tvl: 1 },
  { year: '2027 Q2', revenue: 2.5, costs: 2.0, users: 100000, tvl: 10 },
  { year: '2027 Q4', revenue: 8.0, costs: 4.0, users: 500000, tvl: 50 },
  { year: '2028 Q2', revenue: 18.0, costs: 6.0, users: 1000000, tvl: 100 },
  { year: '2028 Q4', revenue: 35.0, costs: 10.0, users: 2000000, tvl: 200 },
];

export default function WhitepaperPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Handle section navigation
  const goToSection = (index: number) => {
    setCurrentSection(index);
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  };

  // Track scroll position to update current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Download whitepaper as PDF
  const downloadWhitepaper = () => {
    // Create a print-friendly version and trigger browser print dialog
    const printContent = document.querySelector('main');
    if (!printContent) return;

    // Store original styles
    const originalOverflow = document.body.style.overflow;

    // Add print-specific class for styling
    document.body.classList.add('printing-pdf');

    // Use browser's print function which can save as PDF
    window.print();

    // Restore original styles
    document.body.classList.remove('printing-pdf');
    document.body.style.overflow = originalOverflow;
  };

  // Download markdown version
  const downloadMarkdown = () => {
    window.open('/docs/BLUEBLOCKS_TECHNICAL_WHITEPAPER.md', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 z-40 overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blueblocks-500 to-blueblocks-700 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Whitepaper</h2>
              <p className="text-xs text-gray-500">v1.0.0 - January 2026</p>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="space-y-2 mb-6">
            <button
              onClick={downloadWhitepaper}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blueblocks-600 hover:bg-blueblocks-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download as PDF</span>
            </button>
            <button
              onClick={downloadMarkdown}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View Markdown</span>
            </button>
          </div>

          {/* Section Navigation */}
          <nav className="space-y-1">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => goToSection(index)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentSection === index
                      ? 'bg-blueblocks-50 dark:bg-blueblocks-900/30 text-blueblocks-600 dark:text-blueblocks-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blueblocks-100 dark:bg-blueblocks-900/30 text-blueblocks-600 dark:text-blueblocks-400 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              <span>Technical Whitepaper v1.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              BlueBlocks
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Reimagining Global Health Infrastructure
            </p>
            <p className="text-lg text-blueblocks-600 dark:text-blueblocks-400 font-medium">
              Healthcare Infrastructure, Not Cryptocurrency
            </p>
          </div>

          {/* Executive Summary */}
          <section id="executive-summary" className="mb-16 scroll-mt-24">
            <SectionHeader icon={FileText} title="Executive Summary" />

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card p-6 border-2 border-red-200 dark:border-red-900">
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-4">What BlueBlocks Is NOT</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2"><span className="text-red-500">X</span><span>A cryptocurrency for speculation</span></li>
                  <li className="flex items-start space-x-2"><span className="text-red-500">X</span><span>A get-rich-quick token scheme</span></li>
                  <li className="flex items-start space-x-2"><span className="text-red-500">X</span><span>Competing with Bitcoin/Ethereum as currency</span></li>
                  <li className="flex items-start space-x-2"><span className="text-red-500">X</span><span>A meme coin or DeFi yield farm</span></li>
                </ul>
              </div>
              <div className="card p-6 border-2 border-green-200 dark:border-green-900">
                <h4 className="font-bold text-green-600 dark:text-green-400 mb-4">What BlueBlocks IS</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2"><span className="text-green-500">+</span><span>Healthcare infrastructure on blockchain</span></li>
                  <li className="flex items-start space-x-2"><span className="text-green-500">+</span><span>Patient-owned, sovereign health identity</span></li>
                  <li className="flex items-start space-x-2"><span className="text-green-500">+</span><span>Global medicine supply chain verification</span></li>
                  <li className="flex items-start space-x-2"><span className="text-green-500">+</span><span>HIPAA/GDPR compliant health records</span></li>
                </ul>
              </div>
            </div>

            <div className="card p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Revenue Model</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blueblocks-50 dark:bg-blueblocks-900/20 rounded-lg">
                  <Coins className="w-8 h-8 text-blueblocks-600 mb-2" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">BBT Token</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Governance, validator staking, AI compute payment</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Heart className="w-8 h-8 text-green-600 mb-2" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">NFT Health ID</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Portable patient identity, medical history, insurance link</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Target className="w-8 h-8 text-purple-600 mb-2" />
                  <h5 className="font-semibold text-gray-900 dark:text-white">Enterprise Licensing</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hospital deployments, insurance integration</p>
                </div>
              </div>
            </div>
          </section>

          {/* Network Architecture */}
          <section id="network-architecture" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Cpu} title="Network Architecture" />

            <div className="card p-6 mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Multi-Layer Architecture</h4>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blueblocks-500 bg-blueblocks-50 dark:bg-blueblocks-900/20 rounded-r-lg">
                  <h5 className="font-semibold text-blueblocks-600">Layer 3: Applications</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Patient dApp, Provider Portal, Insurance Claims, Pharma Tracking, Research Access</p>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r-lg">
                  <h5 className="font-semibold text-green-600">Layer 2: Sidechains</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hospital Sidechain (EHR, Labs, Imaging), Supply Chain, Insurance Chain</p>
                </div>
                <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg">
                  <h5 className="font-semibold text-purple-600">Layer 1: Mainchain</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tendermint BFT Consensus, NFT Health IDs, IAVL+ State, Oracle Gateway</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Node Distribution</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-blueblocks-600">33%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Validator Nodes</div>
                  <div className="text-xs text-gray-500">100K-500K BBT stake</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-green-600">50%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Healthcare Nodes</div>
                  <div className="text-xs text-gray-500">HIPAA Certified</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600">17%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Treasury Nodes</div>
                  <div className="text-xs text-gray-500">Multi-sig controlled</div>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Shield} title="Security & Encryption" />

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="card p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Encryption at Rest</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blueblocks-100 dark:bg-blueblocks-900/30 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-blueblocks-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">AES-256-GCM</div>
                      <div className="text-xs text-gray-500">256-bit keys, AEAD</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Argon2id KDF</div>
                      <div className="text-xs text-gray-500">64MB RAM, 100K+ iterations</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Ed25519 Signing</div>
                      <div className="text-xs text-gray-500">256-bit curves, fast verify</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Encryption in Transit</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blueblocks-100 dark:bg-blueblocks-900/30 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-blueblocks-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">TLS 1.3</div>
                      <div className="text-xs text-gray-500">Perfect forward secrecy</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">mTLS Node-Node</div>
                      <div className="text-xs text-gray-500">Cert pinning, validator identity</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Noise Protocol</div>
                      <div className="text-xs text-gray-500">P2P channels, IBC packets</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Health Identity */}
          <section id="health-identity" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Heart} title="NFT-Based Health Identity" />

            <div className="card p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Every patient receives a unique NFT that serves as their portable, sovereign health identity across all healthcare providers.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Patient Controls</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>+ Grant/revoke provider access</li>
                    <li>+ Share specific records only</li>
                    <li>+ Emergency access override</li>
                    <li>+ Full audit trail visibility</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Provider Benefits</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>+ Instant patient history access</li>
                    <li>+ Verified insurance eligibility</li>
                    <li>+ Automated prior authorization</li>
                    <li>+ Real-time claims submission</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FHIR Compliance */}
          <section id="fhir-compliance" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Pill} title="FHIR & Healthcare Compliance" />

            <div className="card p-6 mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Supported FHIR R4 Resources</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Patient', 'Practitioner', 'Observation', 'Medication', 'Condition', 'Encounter', 'AllergyIntolerance', 'Immunization', 'Procedure'].map(resource => (
                  <div key={resource} className="px-3 py-2 bg-blueblocks-50 dark:bg-blueblocks-900/20 text-blueblocks-600 rounded-lg text-sm font-medium text-center">
                    {resource}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Compliance Certifications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                  <span className="font-medium text-gray-900 dark:text-white">SOC 2 Type II (Q2 2026)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                  <span className="font-medium text-gray-900 dark:text-white">HITRUST CSF (Q4 2026)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Supply Chain */}
          <section id="supply-chain" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Target} title="Supply Chain Verification" />

            <div className="card p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                End-to-end tracking and verification for pharmaceuticals, medical devices, and agricultural products.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blueblocks-50 dark:bg-blueblocks-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blueblocks-600 mb-1">Pharmaceuticals</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Anti-counterfeiting, cold chain monitoring</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">Medical Devices</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">UDI tracking, recall management</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Agriculture</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Farm-to-table traceability</div>
                </div>
              </div>
            </div>
          </section>

          {/* Oracle & AI */}
          <section id="oracle-ai" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Brain} title="Oracle & AI Services" />

            <div className="card p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Decentralized oracle network providing AI compute services, external data feeds, and cross-chain communication.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">AI Compute Services</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>+ Medical image analysis</li>
                    <li>+ Drug interaction checking</li>
                    <li>+ Claims auto-adjudication</li>
                    <li>+ Fraud detection</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Data Oracles</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>+ NPI/License verification</li>
                    <li>+ Drug pricing feeds</li>
                    <li>+ Insurance eligibility</li>
                    <li>+ Stripe payment verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Tokenomics */}
          <section id="tokenomics" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Coins} title="Tokenomics" />

            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white">BBT Token Distribution</h4>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blueblocks-600">1,000,000,000</div>
                  <div className="text-sm text-gray-500">Total Supply</div>
                </div>
              </div>

              {/* Pie Chart Visualization */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {(() => {
                      let cumulative = 0;
                      return tokenomicsData.map((item, index) => {
                        const startAngle = cumulative * 3.6;
                        cumulative += item.percentage;
                        const endAngle = cumulative * 3.6;
                        const largeArc = item.percentage > 50 ? 1 : 0;

                        const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                        const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                        const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                        const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                        return (
                          <path
                            key={index}
                            d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                            fill={item.color}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        );
                      });
                    })()}
                    <circle cx="50" cy="50" r="20" fill="white" className="dark:fill-slate-800" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">BBT</div>
                      <div className="text-xs text-gray-500">Token</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {tokenomicsData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-gray-900 dark:text-white">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">{item.percentage}%</div>
                        <div className="text-xs text-gray-500">{(item.amount / 1_000_000).toFixed(0)}M BBT</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 font-semibold text-gray-900 dark:text-white">Category</th>
                      <th className="text-right py-3 font-semibold text-gray-900 dark:text-white">Amount</th>
                      <th className="text-right py-3 font-semibold text-gray-900 dark:text-white">%</th>
                      <th className="text-left py-3 font-semibold text-gray-900 dark:text-white pl-4">Vesting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenomicsData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-900 dark:text-white">{item.category}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 text-gray-600 dark:text-gray-400">{item.amount.toLocaleString()}</td>
                        <td className="text-right py-3 font-medium text-gray-900 dark:text-white">{item.percentage}%</td>
                        <td className="py-3 pl-4 text-gray-600 dark:text-gray-400">{item.vesting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Token Utility */}
          <section id="token-utility" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Wallet} title="Token Utility" />

            <div className="space-y-4">
              <div className="card p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Governance</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>+ Vote on protocol upgrades</li>
                  <li>+ Validator selection and slashing</li>
                  <li>+ Treasury fund allocation</li>
                  <li>+ Fee structure changes</li>
                  <li>+ New sidechain approval</li>
                </ul>
                <p className="mt-4 text-sm text-blueblocks-600">1 BBT = 1 Vote (quadratic voting for major decisions)</p>
              </div>

              <div className="card p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Staking Rewards</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2">Validator Type</th>
                        <th className="text-right py-2">Min Stake</th>
                        <th className="text-right py-2">APY</th>
                        <th className="text-right py-2">Slash Risk</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-400">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">Standard Validator</td>
                        <td className="text-right">100,000 BBT</td>
                        <td className="text-right text-green-600">8-12%</td>
                        <td className="text-right">5%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">Healthcare Node</td>
                        <td className="text-right">50,000 BBT</td>
                        <td className="text-right text-green-600">10-15%</td>
                        <td className="text-right">3%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">Master Node (Oracle)</td>
                        <td className="text-right">500,000 BBT</td>
                        <td className="text-right text-green-600">15-20%</td>
                        <td className="text-right">10%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Treasury Validator</td>
                        <td className="text-right">250,000 BBT</td>
                        <td className="text-right text-green-600">12-18%</td>
                        <td className="text-right">8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Service Payments</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2">Service</th>
                        <th className="text-right py-2">BBT Price</th>
                        <th className="text-right py-2">USDC Equiv</th>
                        <th className="text-right py-2">BBT Discount</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-400">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">NFT Health ID Mint</td>
                        <td className="text-right">100 BBT</td>
                        <td className="text-right">$25</td>
                        <td className="text-right text-green-600">-10%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">AI Compute (per job)</td>
                        <td className="text-right">10-1000 BBT</td>
                        <td className="text-right">$2.50-$250</td>
                        <td className="text-right text-green-600">-10%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">Supply Chain Anchor</td>
                        <td className="text-right">5 BBT</td>
                        <td className="text-right">$1.25</td>
                        <td className="text-right text-green-600">-10%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">Contract Deploy</td>
                        <td className="text-right">50 BBT</td>
                        <td className="text-right">$12.50</td>
                        <td className="text-right text-green-600">-10%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Oracle Request</td>
                        <td className="text-right">1-100 BBT</td>
                        <td className="text-right">$0.25-$25</td>
                        <td className="text-right text-green-600">-10%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Token Unlock Schedule */}
          <section id="unlock-schedule" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Lock} title="Token Unlock Schedule" />

            <div className="card p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Vesting Timeline (10 Years)</h4>

              {/* Chart */}
              <div className="h-80 relative mb-8">
                <svg viewBox="0 0 800 300" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((val, i) => (
                    <g key={i}>
                      <line
                        x1="60"
                        y1={280 - (val / 1000) * 250}
                        x2="780"
                        y2={280 - (val / 1000) * 250}
                        stroke="#e5e7eb"
                        strokeDasharray="4"
                      />
                      <text
                        x="55"
                        y={285 - (val / 1000) * 250}
                        textAnchor="end"
                        className="fill-gray-400 text-xs"
                      >
                        {val}M
                      </text>
                    </g>
                  ))}

                  {/* X-axis labels */}
                  {unlockSchedule.map((point, i) => (
                    <text
                      key={i}
                      x={60 + (i / (unlockSchedule.length - 1)) * 720}
                      y="295"
                      textAnchor="middle"
                      className="fill-gray-400 text-xs"
                    >
                      {point.label}
                    </text>
                  ))}

                  {/* Stacked area chart */}
                  {['advisors', 'team', 'treasury', 'validators', 'development', 'community'].map((category, catIndex) => {
                    const colors = ['#EC4899', '#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#3B82F6'];
                    const points = unlockSchedule.map((point, i) => {
                      const categories = ['community', 'development', 'validators', 'treasury', 'team', 'advisors'];
                      const startCatIndex = categories.indexOf(category);
                      let stackedValue = 0;
                      for (let j = startCatIndex; j < categories.length; j++) {
                        stackedValue += (point as any)[categories[j]] || 0;
                      }
                      const x = 60 + (i / (unlockSchedule.length - 1)) * 720;
                      const y = 280 - (stackedValue / 1000) * 250;
                      return `${x},${y}`;
                    }).join(' ');

                    const prevPoints = unlockSchedule.map((point, i) => {
                      const categories = ['community', 'development', 'validators', 'treasury', 'team', 'advisors'];
                      const startCatIndex = categories.indexOf(category);
                      let stackedValue = 0;
                      for (let j = startCatIndex + 1; j < categories.length; j++) {
                        stackedValue += (point as any)[categories[j]] || 0;
                      }
                      const x = 60 + (i / (unlockSchedule.length - 1)) * 720;
                      const y = 280 - (stackedValue / 1000) * 250;
                      return `${x},${y}`;
                    }).reverse().join(' ');

                    return (
                      <polygon
                        key={category}
                        points={`${points} ${prevPoints}`}
                        fill={colors[catIndex]}
                        fillOpacity="0.8"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4">
                {tokenomicsData.map((item) => (
                  <div key={item.category} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Treasury Allocation */}
          <section id="treasury" className="mb-16 scroll-mt-24">
            <SectionHeader icon={PieChart} title="Treasury Allocation" />

            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white">Operational Treasury Budget</h4>
                <div className="text-right">
                  <div className="text-xl font-bold text-blueblocks-600">120,000,000 BBT</div>
                  <div className="text-sm text-gray-500">12% of Total Supply</div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The treasury is managed by governance and allocated to ensure long-term sustainability of the BlueBlocks ecosystem.
              </p>

              {/* Horizontal bar chart */}
              <div className="space-y-4 mb-8">
                {treasuryAllocation.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{item.category}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      >
                        <span className="text-xs text-white font-medium">
                          {((120_000_000 * item.percentage) / 100).toLocaleString()} BBT
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Summary cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blueblocks-50 dark:bg-blueblocks-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blueblocks-600">42M BBT</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Infrastructure</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">36M BBT</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">R&D</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">42M BBT</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Security + Compliance + Grants</div>
                </div>
              </div>
            </div>
          </section>

          {/* Projected Profitability */}
          <section id="profitability" className="mb-16 scroll-mt-24">
            <SectionHeader icon={TrendingUp} title="Projected Profitability" />

            <div className="card p-6 mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">Revenue vs Costs Projection</h4>

              {/* Bar chart */}
              <div className="h-64 relative mb-8">
                <svg viewBox="0 0 600 200" className="w-full h-full">
                  {/* Y-axis labels */}
                  {[0, 10, 20, 30, 40].map((val, i) => (
                    <g key={i}>
                      <line x1="40" y1={180 - val * 4} x2="580" y2={180 - val * 4} stroke="#e5e7eb" strokeDasharray="4" />
                      <text x="35" y={185 - val * 4} textAnchor="end" className="fill-gray-400 text-xs">${val}M</text>
                    </g>
                  ))}

                  {/* Bars */}
                  {profitabilityData.map((item, i) => {
                    const barWidth = 40;
                    const gap = 20;
                    const groupWidth = barWidth * 2 + gap;
                    const startX = 70 + i * (groupWidth + 40);

                    return (
                      <g key={i}>
                        {/* Revenue bar */}
                        <rect
                          x={startX}
                          y={180 - item.revenue * 4}
                          width={barWidth}
                          height={item.revenue * 4}
                          fill="#10B981"
                          rx="4"
                        />
                        {/* Cost bar */}
                        <rect
                          x={startX + barWidth + gap}
                          y={180 - item.costs * 4}
                          width={barWidth}
                          height={item.costs * 4}
                          fill="#EF4444"
                          rx="4"
                        />
                        {/* Label */}
                        <text
                          x={startX + barWidth + gap / 2}
                          y="195"
                          textAnchor="middle"
                          className="fill-gray-600 text-xs"
                        >
                          {item.year}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-8 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Operating Costs</span>
                </div>
              </div>

              {/* Detailed table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 font-semibold text-gray-900 dark:text-white">Period</th>
                      <th className="text-right py-3 font-semibold text-gray-900 dark:text-white">Revenue</th>
                      <th className="text-right py-3 font-semibold text-gray-900 dark:text-white">Costs</th>
                      <th className="text-right py-3 font-semibold text-gray-900 dark:text-white">Net</th>
                      <th className="text-right py-3 font-semibold text-gray-900 dark:text-white">Health IDs</th>
                      <th className="text-right py-3 font-semibold text-gray-900 dark:text-white">TVL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitabilityData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 text-gray-900 dark:text-white">{item.year}</td>
                        <td className="text-right py-3 text-green-600">${item.revenue}M</td>
                        <td className="text-right py-3 text-red-600">${item.costs}M</td>
                        <td className={`text-right py-3 font-medium ${item.revenue - item.costs >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(item.revenue - item.costs).toFixed(1)}M
                        </td>
                        <td className="text-right py-3 text-gray-600 dark:text-gray-400">{item.users.toLocaleString()}</td>
                        <td className="text-right py-3 text-gray-600 dark:text-gray-400">${item.tvl}M</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">Path to Profitability</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  BlueBlocks is projected to reach profitability by Q2 2027 with 100,000 active Health IDs and $10M TVL.
                  Revenue is generated primarily through Health ID minting, enterprise licensing, and transaction fees.
                </p>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section id="roadmap" className="mb-16 scroll-mt-24">
            <SectionHeader icon={Calendar} title="Development Roadmap" />

            <div className="space-y-6">
              {/* 2026 */}
              <div className="card p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-12 h-12 bg-blueblocks-600 text-white rounded-lg flex items-center justify-center mr-4 font-bold">2026</span>
                  Development Year
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h5 className="font-semibold text-blueblocks-600 mb-2">Q1-Q2</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li className="flex items-center"><span className="text-green-500 mr-2">+</span>TypeScript SDK + React Hooks</li>
                      <li className="flex items-center"><span className="text-green-500 mr-2">+</span>CLI Developer Tools</li>
                      <li className="flex items-center"><span className="text-green-500 mr-2">+</span>TimescaleDB Indexer</li>
                      <li className="flex items-center"><span className="text-yellow-500 mr-2">~</span>Block Explorer Frontend</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Tendermint BFT Integration</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>SOC 2 Type II Certification</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h5 className="font-semibold text-blueblocks-600 mb-2">Q3-Q4</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Supply Chain Sidechain</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Oracle Network (AI)</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>WASM VM (Rust Contracts)</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>ZK-Proof Identity</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Insurance Claims dApp</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>HITRUST CSF Certification</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2027 */}
              <div className="card p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mr-4 font-bold">2027</span>
                  Launch Year
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h5 className="font-semibold text-green-600 mb-2">Q1-Q2</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Mainnet Launch</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>NFT Health ID Public Minting</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Cross-chain Bridges (ETH, SOL)</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>ISO 27001 Certification</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>100+ Healthcare Partners</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h5 className="font-semibold text-green-600 mb-2">Q3-Q4+</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>International Expansion</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Government Health Programs</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>Decentralized Insurance Pools</li>
                      <li className="flex items-center"><span className="text-gray-400 mr-2">o</span>1M+ Patient Health IDs</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">+</span>
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">~</span>
                  <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">o</span>
                  <span className="text-gray-600 dark:text-gray-400">Planned</span>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <div className="card p-8 text-center bg-gradient-to-br from-blueblocks-600 to-blueblocks-800 text-white print:bg-blueblocks-600">
            <h3 className="text-2xl font-bold mb-4">Healthcare Infrastructure, Not Cryptocurrency</h3>
            <p className="text-blueblocks-100 mb-6">
              BlueBlocks represents a fundamental reimagining of healthcare infrastructure, combining blockchain,
              NFT identity, AI oracles, and smart contracts into a unified, patient-centric ecosystem.
            </p>
            <div className="flex justify-center space-x-4 print:hidden">
              <button
                onClick={downloadWhitepaper}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blueblocks-600 rounded-lg font-medium hover:bg-blueblocks-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download as PDF</span>
              </button>
            </div>
            <div className="hidden print:block mt-4 text-blueblocks-100 text-sm">
              www.blueblocks.health | Document Version 1.0.0 | January 2026
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blueblocks-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSection(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSection ? 'bg-blueblocks-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSection}
              disabled={currentSection === sections.length - 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blueblocks-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Section header component
function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-blueblocks-100 dark:bg-blueblocks-900/30 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-blueblocks-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
  );
}

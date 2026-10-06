'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NetworkGraphBackground from '../components/landing/NetworkGraphBackground';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChevronDown,
  Cloud,
  Database,
  DollarSign,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  GitBranch,
  LineChart,
  Menu,
  Network,
  Plug,
  Server,
  Shield,
  ShieldCheck,
  Sigma,
  Sparkles,
  Target,
  TerminalSquare,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'How it Works?', id: 'how-it-works' },
  { label: 'Features', id: 'features' },
  { label: 'Download', id: 'download' },
  { label: 'Team', id: 'team' },
  { label: 'FAQs', id: 'faqs' },
];

const problemCards = [
  {
    title: 'Static Visibility',
    description: 'No continuous, real-time view of rapidly changing IT environments.',
    solution: 'Continuous Monitoring',
  },
  {
    title: 'Vague Risk Rating',
    description: 'Risks are often rated qualitatively rather than quantified in financial terms.',
    solution: 'Cyber Risk Quantification',
  },
  {
    title: 'Prioritization Overload',
    description: 'Security teams struggle to identify and prioritize the risks that matter most.',
    solution: 'Risk-Based Prioritization',
  },
];

const workflowSteps = [
  {
    title: 'Continuous Data Monitoring',
    description: 'RiskNexus continuously monitors cyber-risk data in real time from multiple sources.',
    icon: Activity,
    cards: [
      {
        title: 'Data Upload',
        description: 'Upload data as .excel or .csv files.',
        icon: Upload,
      },
      {
        title: 'Real-Time System Monitoring',
        description: 'RiskNexus enables real-time system monitoring using tools such as GLPI, Trivy, Nmap, Zeek, and OpenCTS.',
        icon: Server,
      },
      {
        title: 'Security Ecosystem Integration',
        description: 'Integration with vulnerability management, SIEM, IAM, EDR, CSPM, asset inventories, and threat intelligence feeds.',
        icon: Plug,
      },
    ],
  },
  {
    title: 'ML Based Threat Likelihood Estimation',
    description: 'Machine-learning models estimate threat likelihood using vulnerability, security, threat-intelligence, and system data.',
    icon: BrainCircuit,
  },
  {
    title: 'Cyber Risk Quantification',
    description: 'Quantify cyber risks into potential financial loss considering technical aspects and business context.',
    icon: DollarSign,
  },
  {
    title: 'Optimization',
    description: 'Identify security controls and remediation actions that maximize risk reduction within available investment constraints.',
    icon: Target,
  },
];

const featureData = [
  {
    title: 'On-Premise Deployment',
    description: 'Self-hosted deployment for organizations requiring control over infrastructure, data, and security operations.',
    icon: Server,
  },
  {
    title: 'Cloud-Ready Architecture',
    description: 'Designed for self-hosted deployment while remaining ready for private or public cloud environments.',
    icon: Cloud,
  },
  {
    title: 'Cyber Risk Quantification',
    description: 'Calculate enterprise cyber risk as financial exposure metrics, including Expected Annual Loss (EAL), at organization, business-unit, and asset levels.',
    icon: DollarSign,
  },
  {
    title: 'What-If Simulation',
    description: 'Simulate remediation scenarios and evaluate their impact on financial cyber risk and security investment.',
    example: 'What happens if MFA is implemented across all privileged accounts?',
    icon: FlaskConical,
  },
  {
    title: 'Cybersecurity Frameworks',
    description: 'Map risk metrics to ISO/IEC 27001, NIST Cybersecurity Framework, CIS Controls, RBI Cyber Security Framework, and SEBI Cybersecurity and Cyber Resilience Framework.',
    icon: ShieldCheck,
  },
  {
    title: 'Integration',
    description: 'Integrate vulnerability management, SIEM, IAM, EDR, CSPM, asset inventories, and threat intelligence feeds.',
    icon: Network,
  },
  {
    title: 'Monte Carlo Simulation',
    description: 'Use probabilistic simulation to model uncertainty in cyber-loss scenarios and estimate potential financial exposure.',
    icon: Sigma,
  },
  {
    title: 'AI Decision Support Layer',
    description: 'AI-powered natural-language risk queries, predictive analysis, prioritized mitigation recommendations, and quantified risk reduction.',
    example: 'What is our highest financial cyber risk today?',
    icon: BrainCircuit,
  },
  {
    title: 'Optimization',
    description: 'Recommend control and remediation portfolios that maximize risk reduction within a defined budget, with ROSI and cost-benefit metrics.',
    example: '₹1 crore',
    icon: Target,
  },
  {
    title: 'Smart Visualization',
    description: 'Visualize Investment vs. Risk Reduction curves to identify diminishing returns and optimal security-spend zones.',
    icon: LineChart,
  },
  {
    title: 'Attack-Path Simulation',
    description: 'Simulate attack paths across assets and vulnerabilities to identify high-impact paths and understand possible attacker movement.',
    icon: GitBranch,
  },
  {
    title: 'Generate Reports',
    description: 'Generate evidence-based reports and dashboards for audits, regulatory filings, and internal governance committees.',
    icon: FileText,
  },
];

const faqItems = [
  {
    question: 'What if the ML model predicts incorrectly?',
    answer:
      'ML-based threat likelihood is a signal, not an absolute truth. RiskNexus uses two complementary approaches for threat likelihood estimation: rule-based calculation and ML-based prediction.',
  },
  {
    question: 'Why XGBoost?',
    answer:
      'Our data is primarily structured security data with heterogeneous numerical and categorical features. XGBoost is well suited to this type of data, handles nonlinear feature interactions effectively, and provides useful feature-importance information.',
  },
  {
    question: 'Where does the financial data come from?',
    answer:
      'The organization provides business-context information such as asset criticality, revenue dependency, recovery cost, and other relevant financial parameters. RiskNexus combines this organization-specific context with technical risk indicators.',
  },
  {
    question: 'Can RiskNexus calculate the exact financial loss?',
    answer:
      'No. RiskNexus estimates potential financial exposure, not an exact guaranteed loss. Cyber incidents are inherently uncertain, so the output represents an estimated financial risk distribution rather than a guaranteed loss figure.',
  },
  {
    question: 'What is the financial-loss formula?',
    answer: 'Expected Loss = Probability of Loss × Financial Impact',
  },
  {
    question: 'Why Monte Carlo simulation?',
    answer:
      'Cyber losses are uncertain rather than a single deterministic number. Monte Carlo simulation allows RiskNexus to model uncertainty in variables such as attack probability and financial impact and generate a distribution of possible losses.',
  },
  {
    question: 'Where does the financial impact of a server come from?',
    answer:
      'Some information must come from the organization because only the organization knows its actual revenue dependency, operational cost, and business value. RiskNexus therefore treats business impact as contextual input rather than assuming that public vulnerability databases contain this information.',
  },
];

const teamMembers = [
  ['Apaar Jain', 'Frontend Developer', '/media/apaar.jpg'],
  ['Raj Maurya', 'Backend Developer', '/media/raj.jpeg'],
  ['Aditya Mishra', 'System Engineer', '/media/aditya.jpg'],
  ['Amrita Singh Lodhi', 'ML Engineer', '/media/amrita.jpg'],
  ['Ashutosh Parashar', 'DevOps Engineer', '/media/ashu.jpg'],
  ['Anshika Sharma', 'Researcher', '/media/anshika.jpeg'],
];

const downloadSteps = [
  {
    title: 'Clone the Repository',
    commands: ['git clone https://github.com/adityamishra912/risknexus', 'cd risknexus'],
    icon: TerminalSquare,
  },
  {
    title: 'Prerequisites',
    description: 'The RiskNexus CLI performs privileged Ubuntu host setup and is not a Windows installer.',
    list: [
      'Ubuntu 26.04 amd64',
      'Git',
      'Go 1.22 or compatible',
      'Docker',
      'Docker Compose v2',
      'MySQL client/server',
      'Apache HTTP Server',
      'PHP',
      'PHP MySQL extension',
      'GLPI or permission for CLI to configure/download it',
      'apt-get privileges',
      'interactive terminal for MySQL/Gemini credentials',
    ],
    icon: Shield,
  },
  {
    title: 'Build & Run RiskNexus CLI',
    commands: ['cd cli', 'go build -o risknexus .', 'sudo install -m 0755 risknexus /usr/local/bin/risknexus', 'sudo ./risknexus --debug start'],
    icon: Server,
  },
  {
    title: 'Configure RiskNexus',
    description: 'The Gemini API key is entered interactively using hidden/password input.',
    commands: ['cd ..','risknexus configure'],
    info: ['RiskNexus host/IP', 'MySQL host', 'MySQL port', 'MySQL database', 'MySQL username', 'MySQL password', 'Gemini API key'],
    icon: Database,
  },
  {
    title: 'Install RiskNexus',
    description: 'The CLI detects Ubuntu 26.04 amd64, checks dependencies, configures MySQL, detects/configures GLPI, configures Apache, verifies GLPI inventory, installs/configures GLPI Agent, collects inventory, verifies inventory counts, starts FastAPI and Next.js Docker services, configures restricted backend database access, and checks service health.',
    commands: ['sudo risknexus install'],
    icon: Cloud,
  },
  {
    title: 'Verify / Troubleshoot',
    commands: ['risknexus status', 'risknexus --debug start', 'risknexus logs'],
    icon: Activity,
  },
];

export default function RiskNexusLandingPage() {
  const rootRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const handleNav = (targetId) => {
    setMobileMenuOpen(false);
    if (window.location.hash !== `#${targetId}`) window.history.pushState(null, '', `#${targetId}`);
    const target = document.getElementById(targetId);
    const scrollRoot = document.scrollingElement;
    if (!target || !scrollRoot) return;

    gsap.killTweensOf(scrollRoot, 'scrollTop');
    scrollRoot.style.scrollBehavior = 'auto';
    gsap.to(scrollRoot, {
      scrollTop: Math.max(0, target.offsetTop - 96),
      duration: 0.9,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        scrollRoot.style.scrollBehavior = '';
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-shell', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo('.hero-kicker', { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 });
      gsap.fromTo('.hero-title', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.35 });
      gsap.fromTo('.hero-subtitle', { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power2.out', delay: 0.7 });
      gsap.fromTo('.hero-cta', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 1 });

      gsap.utils.toArray('.problem-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, x: index % 2 === 0 ? -40 : 40, y: 28 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.12,
            scrollTrigger: { trigger: '#problems', start: 'top 72%' },
          }
        );
      });

      gsap.utils.toArray('.workflow-card').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray('.workflow-monitoring-card').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray('.feature-card').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray('.story-card').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.2, y: 30, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 80%' },
          }
        );
      });

      gsap.utils.toArray('.team-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 26, rotationX: 12 },
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: index * 0.1,
            scrollTrigger: { trigger: '#team', start: 'top 75%' },
          }
        );
      });

      gsap.utils.toArray('.faq-item').forEach((item, index) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.08,
            scrollTrigger: { trigger: '#faqs', start: 'top 72%' },
          }
        );
      });

      gsap.fromTo(
        '.competitive-core',
        { autoAlpha: 0, scale: 0.82 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#competitive-edge', start: 'top 72%' },
        }
      );

      gsap.utils.toArray('.network-node').forEach((node, index) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, scale: 0.75 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.4 + index * 0.2,
            scrollTrigger: { trigger: '#competitive-edge', start: 'top 70%' },
          }
        );
      });

      gsap.matchMedia().add('(min-width: 768px)', () => {
        gsap.to('.network-line', {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          stagger: 0.15,
          scrollTrigger: { trigger: '#competitive-edge', start: 'top 68%' },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(''), 1500);
    } catch (error) {
      console.error('Unable to copy command', error);
    }
  };

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-x-hidden bg-[#F1F6F9] text-slate-900">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-80" style={{ background: 'linear-gradient(180deg, rgba(244,248,251,0.88), rgba(244,248,251,0.84))' }}>
        <NetworkGraphBackground density={70} interactive />
      </div>

      <header className={`fixed left-0 right-0 top-0 z-[100] border-b border-slate-200 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_14px_rgba(6,182,212,0.08)]' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#home" onClick={(event) => { event.preventDefault(); handleNav('home'); }} className="flex items-center gap-3 text-left">
            <span className="text-lg font-black tracking-[0.18em] text-cyan-600 font-mono">RISKNEXUS</span>
          </a>

          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(event) => { event.preventDefault(); handleNav(item.id); }} className="nav-link transition-colors hover:text-cyan-700">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button type="button" aria-label="Toggle menu" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden" onClick={() => setMobileMenuOpen((value) => !value)}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-2 text-sm text-slate-700">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={(event) => { event.preventDefault(); handleNav(item.id); }} className="rounded px-2 py-2 text-left transition hover:bg-cyan-50 hover:text-cyan-700">
                  {item.label}
                </a>
              ))}
              <Link href="/signup" className="mt-2 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-10 pt-24">
        <section id="home" className="relative flex min-h-[90vh] items-center justify-center px-4 py-20 sm:px-6">
          <div className="hero-shell mx-auto w-full max-w-6xl text-center">
            <div className="hero-kicker inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-600">
              <Sparkles className="h-3.5 w-3.5" />
              Quantified Cyber Risk Platform
            </div>

            <div className="mt-8 flex justify-center">
              <div className="terminal-box w-full max-w-5xl rounded-3xl border border-cyan-200 bg-white/90 shadow-[0_25px_80px_rgba(34,211,238,0.12)] backdrop-blur-sm">
                <div className="terminal-header flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-4 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">risknexus://terminal</span>
                </div>

                <div className="terminal-body px-5 py-8 sm:px-8 md:px-12">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-600">$ ./boot --risk-model</p>
                  <h1 className="hero-title mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-7xl">RISKNEXUS</h1>
                  <div className="hero-subtitle mt-5 text-lg text-slate-700 sm:text-2xl md:text-3xl">Quantify Cyber Risk. Prioritize What Matters.</div>

                  <div className="hero-cta mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(34,211,238,0.2)] transition hover:bg-cyan-400">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a href="#how-it-works" onClick={(event) => { event.preventDefault(); handleNav('how-it-works'); }} className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700">
                      Explore Workflow
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problems" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">THE PROBLEM</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">Why Traditional Risk Management Falls Short</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {problemCards.map((card, index) => (
              <div key={card.title} className="problem-card relative">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-cyan-600">Problem 0{index + 1}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_16px_rgba(34,211,238,0.8)]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{card.title}</h3>
                  <p className="mt-4 text-base text-slate-600">{card.description}</p>
                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">RiskNexus Solution</div>
                    <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 font-mono text-sm text-cyan-700">{card.solution}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center text-cyan-500">
                  <span className="h-px w-16 bg-gradient-to-r from-slate-300 to-cyan-400" />
                  <span className="ml-2 inline-block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-cyan-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">How It Works</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">The RiskNexus workflow</h2>
          </div>

          <div className="workflow-shell space-y-8">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const isMonitoring = index === 0;

              return (
                <div key={step.title} className="workflow-card" id={isMonitoring ? 'workflow-monitoring' : undefined}>
                  <div className="workflow-card-inner">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-700">
                      Step {index + 1}
                    </div>
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">{step.title}</h3>
                    <p className="mt-4 max-w-3xl text-base text-slate-600 md:text-lg">{step.description}</p>

                    {isMonitoring && (
                      <div className="workflow-monitoring-grid">
                        {step.cards.map((card, cardIndex) => {
                          const CardIcon = card.icon;
                          return (
                            <div key={card.title} className="workflow-monitoring-card">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
                                <CardIcon className="h-5 w-5" />
                              </div>
                              <div className="workflow-monitoring-card-copy">
                                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-700">0{cardIndex + 1}</div>
                                <h4 className="text-lg font-bold text-slate-900">{card.title}</h4>
                                <p className="text-sm leading-6 text-slate-600">{card.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="features" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">Features</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">Continuous cyber risk intelligence, quantification, and decision support.</h2>
          </div>

          <div className="feature-shell">
            <div className="feature-grid" aria-label="RiskNexus features" tabIndex={0}>
              {featureData.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="feature-card">
                      <div className="feature-card-heading">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-600">Feature {String(index + 1).padStart(2, '0')}</div>
                          <h3 className="mt-2 text-xl font-black text-slate-900 md:text-2xl">{feature.title}</h3>
                      </div>
                    </div>
                    <p className="mt-5 text-[13px] leading-5 text-slate-600">{feature.description}</p>
                    {feature.example && (
                      <div className="feature-example mt-6 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 md:text-sm">
                        {feature.example}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="audience" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">Built for Decision Makers</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">Built for the people making cyber risk decisions</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'CISO', items: ['Enterprise Risk', 'Financial Exposure', 'Risk Trends', 'Risk Reduction Opportunities'] },
              { title: 'Risk Officers', items: ['Risk Quantification', 'Risk Prioritization', 'Control Effectiveness', 'Investment Analysis'] },
              { title: 'Executive Leadership', items: ['Business Impact', 'Financial Exposure', 'Security Investment', 'Strategic Risk Decisions'] },
            ].map((role, index) => (
              <div key={role.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-600">{role.title}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 font-mono text-xs text-cyan-700">0{index + 1}</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500" />{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="download" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">Download</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">RiskNexus CLI installation workflow</h2>
          </div>

          <div className="space-y-8">
            {downloadSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-600">STEP {index + 1}</div>
                        <h3 className="mt-1 text-2xl font-black text-slate-900">{step.title}</h3>
                      </div>
                    </div>
                  </div>

                  {step.description && <p className="mt-4 text-slate-600">{step.description}</p>}

                  {step.list && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {step.list.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="h-2 w-2 rounded-full bg-cyan-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.info && (
                    <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-600">Configuration inputs</div>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {step.info.map((item) => (
                          <li key={item} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500" />{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.commands && (
                    <div className="terminal-command-card mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="terminal-chrome flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                        <div className="dots flex items-center gap-2">
                          <span className="red h-2.5 w-2.5 rounded-full bg-red-400" />
                          <span className="amber h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="green h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <button type="button" onClick={() => copyToClipboard(step.commands.join('\n'))} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                          {copied === step.commands.join('\n') ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="terminal-body-lines space-y-2 bg-slate-50 p-4 font-mono text-sm text-slate-700">
                        {step.commands.map((command) => (
                          <div key={command} className="terminal-line flex gap-3">
                            <span className="prompt text-cyan-600">$</span>
                            <span className="break-all">{command}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section id="team" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">The Team</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">The Team Behind RiskNexus</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map(([name, role, imagePath]) => (
              <div key={name} className="team-card rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <img src={imagePath} alt={name} className="h-24 w-24 rounded-full object-cover ring-2 ring-cyan-100" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                  <p className="mt-2 font-mono text-sm text-cyan-700">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faqs" className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">FAQ</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className="faq-item overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                  <button type="button" onClick={() => setOpenFaq((current) => (current === index ? -1 : index))} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-base font-medium text-slate-900">
                    <span>{item.question}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-cyan-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="feasibility" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">Feasibility & Viability</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">FEASIBILITY & VIABILITY</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">FEASIBILITY</h3>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="text-[10px] uppercase tracking-[0.26em] text-cyan-600">01</div>
                <h4 className="mt-3 text-xl font-bold text-slate-900">Proven Open-Source Stack</h4>
                <p className="mt-3 text-slate-600">Built on established open-source technologies including FAIR methodology, pyfair, NetworkX, and OR-Tools.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="text-[10px] uppercase tracking-[0.26em] text-cyan-600">02</div>
                <h4 className="mt-3 text-xl font-bold text-slate-900">Modular Service Architecture</h4>
                <p className="mt-3 text-slate-600">Independent services for ingestion, graph + ML, risk + Monte Carlo, and optimization.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="text-[10px] uppercase tracking-[0.26em] text-cyan-600">03</div>
                <h4 className="mt-3 text-xl font-bold text-slate-900">Synthetic-Data Bootstrap</h4>
                <p className="mt-3 text-slate-600">NVD-seeded synthetic data allows the full pipeline to be tested without requiring real enterprise integrations.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="text-[10px] uppercase tracking-[0.26em] text-cyan-600">04</div>
                <h4 className="mt-3 text-xl font-bold text-slate-900">Controlled AI Layer</h4>
                <p className="mt-3 text-slate-600">A strict JSON-only interface prevents the AI from inventing financial risk figures.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">VIABILITY</h3>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="grid gap-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-cyan-700">
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">NVD DATA</div>
                  <div className="text-slate-500">↓</div>
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">SYNTHETIC DATA</div>
                  <div className="text-slate-500">↓</div>
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">FULL PIPELINE</div>
                  <div className="text-slate-500">↓</div>
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">TEST & VALIDATE</div>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm uppercase tracking-[0.12em] text-cyan-700">
                  <div>Risk Engine</div>
                  <div className="py-2 text-slate-500">↓</div>
                  <div>Structured JSON</div>
                  <div className="py-2 text-slate-500">↓</div>
                  <div>AI / LLM</div>
                  <div className="py-2 text-slate-500">↓</div>
                  <div>Narration</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="competitive-edge" className="hidden relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-600">Why RiskNexus?</p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">Continuous visibility. Transparent risk. Smarter security investment.</h2>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
            <div className="competitive-core relative mx-auto min-h-[420px] max-w-4xl">
              <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200 bg-white px-6 py-4 text-center shadow-[0_0_28px_rgba(34,211,238,0.14)]">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-600">RISKNEXUS</div>
              </div>

              <div className="network-line absolute left-1/2 top-1/2 h-px w-[32%] -translate-x-1/2 -translate-y-1/2 rotate-[32deg] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0" />
              <div className="network-line absolute left-1/2 top-1/2 h-px w-[32%] -translate-x-1/2 -translate-y-1/2 -rotate-[32deg] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0" />
              <div className="network-line absolute left-1/2 top-1/2 h-px w-[32%] -translate-x-1/2 -translate-y-1/2 rotate-[148deg] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0" />
              <div className="network-line absolute left-1/2 top-1/2 h-px w-[32%] -translate-x-1/2 -translate-y-1/2 -rotate-[148deg] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0" />

              <div className="network-node absolute left-[6%] top-[18%] max-w-[180px] text-center text-[10px] uppercase tracking-[0.2em] text-cyan-700">CONTINUOUS<br />MONITORING</div>
              <div className="network-node absolute right-[6%] top-[18%] max-w-[180px] text-center text-[10px] uppercase tracking-[0.2em] text-cyan-700">SELF-HOSTED<br />& CONTROL</div>
              <div className="network-node absolute left-[8%] bottom-[18%] max-w-[180px] text-center text-[10px] uppercase tracking-[0.2em] text-cyan-700">SMART<br />VISUALIZATION</div>
              <div className="network-node absolute right-[8%] bottom-[18%] max-w-[180px] text-center text-[10px] uppercase tracking-[0.2em] text-cyan-700">BUILT FOR INDIAN<br />BUDGETS</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-2xl font-black font-mono tracking-[0.12em] text-slate-900">RISKNEXUS</div>
            <p className="mt-3 text-sm text-slate-500">Cyber Risk Quantification Platform</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-2 text-sm text-slate-700">
              <a href="#home" onClick={(event) => { event.preventDefault(); handleNav('home'); }} className="block text-left hover:text-cyan-700">Home</a>
              <a href="#how-it-works" onClick={(event) => { event.preventDefault(); handleNav('how-it-works'); }} className="block text-left hover:text-cyan-700">How it Works?</a>
              <a href="#features" onClick={(event) => { event.preventDefault(); handleNav('features'); }} className="block text-left hover:text-cyan-700">Features</a>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <a href="#download" onClick={(event) => { event.preventDefault(); handleNav('download'); }} className="block text-left hover:text-cyan-700">Download</a>
              <a href="#team" onClick={(event) => { event.preventDefault(); handleNav('team'); }} className="block text-left hover:text-cyan-700">Team</a>
              <a href="#faqs" onClick={(event) => { event.preventDefault(); handleNav('faqs'); }} className="block text-left hover:text-cyan-700">FAQs</a>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <a href="https://github.com/adityamishra912/risknexus" target="_blank" rel="noreferrer" className="block hover:text-cyan-700">GitHub</a>
              <span className="block text-slate-500">© 2025 RiskNexus</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

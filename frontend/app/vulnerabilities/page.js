'use client';

import React, { useState } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { VULNERABILITY_LIST } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils/formatCurrency';
import { ShieldAlert, HelpCircle, ArrowRight, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function VulnerabilitiesPage() {
  const [expandedCve, setExpandedCve] = useState('CVE-2024-3094');

  return (
    <PageContainer
      title="Vulnerability Risk Prioritization"
      subtitle="Contextual risk-based vulnerability triage driven by financial exposure & attack path reachability"
    >
      <div className="space-y-6">
        {/* Contextual Prioritization Formula Callout */}
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-700" />
                <span>Risk Quantification Triage Formula</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Traditional CVSS sorting ignores business context. RiskNexus prioritizes findings based on actual financial loss potential.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-cyan-700 flex flex-wrap items-center gap-1.5">
              <span className="text-slate-600">Prioritization =</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">CVSS</span>
              <span>+</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">Asset Criticality</span>
              <span>+</span>
              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">Exploitability</span>
              <span>+</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Attack Path Reach</span>
              <span>+</span>
              <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 font-sans">Business Loss Impact</span>
            </div>
          </div>
        </Card>

        {/* Vulnerabilities Prioritized Table */}
        <Card title="Ranked Vulnerability Exposure Table" subtitle="Sorted by Financial EAL Contribution rather than raw CVSS">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-mono">
                  <th className="py-3 px-4">CVE ID</th>
                  <th className="py-3 px-4">Affected Asset</th>
                  <th className="py-3 px-4">CVSS Score</th>
                  <th className="py-3 px-4">Known Exploited</th>
                  <th className="py-3 px-4">Asset Criticality</th>
                  <th className="py-3 px-4">Attack Path</th>
                  <th className="py-3 px-4">Financial Exposure</th>
                  <th className="py-3 px-4">Recommended Action</th>
                  <th className="py-3 px-4 text-right">Days Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {VULNERABILITY_LIST.map((vuln) => {
                  const isExpanded = expandedCve === vuln.cve;
                  return (
                    <React.Fragment key={vuln.cve}>
                      <tr
                        onClick={() => setExpandedCve(isExpanded ? null : vuln.cve)}
                        className={`hover:bg-cyan-50 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-cyan-50 border-l-2 border-l-cyan-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          <span className="inline-flex items-center gap-1.5">
                          <span>{vuln.cve}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-700" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-cyan-700">{vuln.assetName}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                            {vuln.cvss}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {vuln.knownExploited ? (
                            <Badge variant="critical">CISA KEV Active</Badge>
                          ) : (
                            <Badge variant="neutral">Unconfirmed</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4"><Badge variant="warning">{vuln.assetCriticality}</Badge></td>
                        <td className="py-3.5 px-4 text-emerald-700 font-mono text-[11px] truncate max-w-[180px]">{vuln.attackPath}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-cyan-700">{formatCurrency(vuln.exposure)}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{vuln.action}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600">{vuln.daysOpen} d</td>
                      </tr>

                      {/* "Why is this prioritized?" Explanation Box */}
                      {isExpanded && (
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <td colSpan={9} className="p-4">
                            <div className="p-4 rounded-lg bg-white border border-cyan-200 space-y-3 text-xs">
                              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                                <HelpCircle className="w-4 h-4 text-cyan-700" />
                                <span>Why is {vuln.cve} prioritized as Top Risk?</span>
                              </div>
                              <p className="text-slate-600 text-xs leading-relaxed pl-6">
                                "{vuln.reason}"
                              </p>
                              <div className="pl-6 pt-1 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-600">
                                <span>Risk Contribution: <strong className="text-cyan-700">{formatCurrency(vuln.exposure)}</strong></span>
                                <span>•</span>
                                <span>CVSS Weight: 30%</span>
                                <span>•</span>
                                <span>Attack Path Reachability Weight: 70%</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

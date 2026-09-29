import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  ShieldCheck, 
  Database, 
  Cpu, 
  ChevronRight, 
  CheckCircle2, 
  X,
  Server,
  Zap,
  Globe,
  KeyRound,
  Activity
} from 'lucide-react';
import { cloudStorage } from '../services/cloudStorage';
import { sounds } from '../utils/audio';

export const JudgeToolbar = ({
  activeTab,
  setActiveTab,
  onTriggerDemoDuplicate,
  onOpenScamModal,
  onOpenAuthModal,
  issuesCount = 0
}) => {
  const [telemetry, setTelemetry] = useState(() => cloudStorage.getTelemetry());

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(cloudStorage.getTelemetry());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#02050d] border-b border-white/[0.08] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Judge Presentation Badge + Cloud Sync Telemetry */}
        <div className="flex items-center space-x-3.5">
          <div className="geo-badge geo-badge-cyan">
            <Activity size={12} className="text-cyan-400 animate-pulse" />
            <span>EXECUTIVE SHOWCASE HUD</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">TELEMETRY:</span>
            <span className="text-emerald-400 font-semibold">{telemetry.latencyMs}ms latency</span>
            <span className="text-white/20">•</span>
            <span className="text-slate-400">AWS ap-south-1</span>
            <span className="text-white/20">•</span>
            <span className="text-cyan-400/90 font-mono">ENCRYPTED SHIELD</span>
          </div>
        </div>

        {/* Right: Quick Action Triggers with Geometric Silhouettes */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Direct Login Portal trigger */}
          <button
            onClick={() => {
              sounds.click();
              onOpenAuthModal('citizen');
            }}
            className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-medium text-[11px] flex items-center space-x-1.5 transition-all hover:border-cyan-400"
            title="Open Login Portal & Anti-Bot CAPTCHA Challenge"
          >
            <KeyRound size={11} className="text-cyan-400" />
            <span>LOGIN GATEWAY</span>
          </button>

          {/* Quick Duplicate Trigger */}
          <button
            onClick={() => {
              sounds.alert();
              onTriggerDemoDuplicate();
            }}
            className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-medium text-[11px] flex items-center space-x-1.5 transition-all hover:border-amber-400"
            title="Simulate dropping a complaint within 50m radius of existing Metro Gate 3 pothole"
          >
            <Zap size={11} className="text-amber-400" />
            <span>TEST 50m AI DEDUPLICATION</span>
          </button>

          {/* Quick Anti-Scam Shield Trigger */}
          <button
            onClick={() => {
              sounds.click();
              onOpenScamModal();
            }}
            className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono font-medium text-[11px] flex items-center space-x-1.5 transition-all hover:border-rose-400"
            title="Inspect Anti-Scam & Phishing Defense Center"
          >
            <ShieldAlert size={11} className="text-rose-400" />
            <span>ANTI-SCAM SHIELD</span>
          </button>

          {/* Reset Demo Data */}
          <div className="hidden lg:flex items-center pl-1 font-mono text-[10px] text-slate-400">
            <span>NODES: 6/6 ACTIVE</span>
          </div>

        </div>

      </div>
    </div>
  );
};

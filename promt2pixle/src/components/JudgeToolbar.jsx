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
  KeyRound
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
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/20 shadow-lg text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Judge Presentation Badge + Cloud Sync Telemetry */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span className="font-bold tracking-wider">JUDGE SHOWCASE MODE</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium">Cloud Database:</span>
            <span className="text-slate-300">{telemetry.latencyMs}ms</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">AWS ap-south-1</span>
          </div>
        </div>

        {/* Right: Quick Judge Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Direct Login Portal trigger */}
          <button
            onClick={() => {
              sounds.click();
              onOpenAuthModal('citizen');
            }}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] flex items-center space-x-1.5 transition-all hover:scale-105"
            title="Open Login Portal & Anti-Bot CAPTCHA Challenge"
          >
            <KeyRound size={12} className="text-cyan-400" />
            <span>Login Gateway (CAPTCHA)</span>
          </button>

          {/* Quick Duplicate Trigger */}
          <button
            onClick={() => {
              sounds.alert();
              onTriggerDemoDuplicate();
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-[11px] flex items-center space-x-1.5 transition-all hover:scale-105"
            title="Simulate dropping a complaint within 50m radius of existing Metro Gate 3 pothole"
          >
            <Zap size={12} className="text-amber-400" />
            <span>Test 50m AI Duplicate</span>
          </button>

          {/* Quick Anti-Scam Shield Trigger */}
          <button
            onClick={() => {
              sounds.click();
              onOpenScamModal();
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold text-[11px] flex items-center space-x-1.5 transition-all hover:scale-105"
            title="Inspect Anti-Scam & Phishing Defense Center"
          >
            <ShieldAlert size={12} className="text-rose-400" />
            <span>Anti-Scam Defense</span>
          </button>

          {/* 1-Click Role Switch */}
          <button
            onClick={() => {
              sounds.click();
              if (activeTab === 'admin') {
                setActiveTab('citizen');
              } else {
                setActiveTab('admin');
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-semibold text-[11px] flex items-center space-x-1.5 transition-all hover:scale-105"
            title="Toggle between Citizen View and Municipal Admin Operations"
          >
            <ShieldCheck size={12} className="text-purple-400" />
            <span>Switch: {activeTab === 'admin' ? 'Citizen View' : 'Admin Control'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};

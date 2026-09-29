import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  MapPin, 
  Clock, 
  Search, 
  Radio, 
  Sparkles, 
  Filter, 
  FileText, 
  Upload, 
  Eye, 
  Check, 
  X, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  Lock, 
  Users, 
  Send
} from 'lucide-react';
import { AuthorityPortal } from './AuthorityPortal';
import { DEPARTMENTS, WARDS } from '../data/mockData';
import { sounds } from '../utils/audio';

export const AdminPortal = ({
  user,
  issues = [],
  onUpdateIssueStatus,
  onSelectIssue,
  onSubmitProofOfWork,
  onOpenAdminAuth,
  onSwitchToCitizen,
  onSwitchToAdmin
}) => {
  const [adminTab, setAdminTab] = useState('dispatch'); // 'dispatch', 'anti-scam-moderation', 'broadcast'
  
  // Role Access Barrier for Non-Admins with 1-Click Instant Unlock
  if (user?.role !== 'admin') {
    return (
      <div className="p-8 sm:p-12 rounded-2xl geo-card-elevated border border-purple-500/30 text-center space-y-6 max-w-2xl mx-auto my-8 shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
          <ShieldCheck size={32} />
        </div>

        <div className="space-y-2">
          <div className="geo-badge geo-badge-purple border-purple-500/30 bg-purple-500/10 text-purple-300">
            <ShieldCheck size={12} />
            <span>MUNICIPAL OPERATIONS BARRIER</span>
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-white">
            Municipal Operations & Dispatch Console
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            This module provides municipal work-order dispatch, proof-of-work closure verification, anti-fraud moderation, and public emergency broadcasts.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sounds.success();
              onSwitchToAdmin?.();
            }}
            className="px-5 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all flex items-center space-x-2"
          >
            <Sparkles size={15} />
            <span>Instant Authorize: Er. Rajesh Verma (Chief Admin)</span>
          </button>

          <button
            onClick={() => {
              sounds.click();
              onOpenAdminAuth?.();
            }}
            className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.15] text-slate-200 text-xs font-semibold transition-all flex items-center space-x-1.5"
          >
            <Lock size={14} />
            <span>Login Gateway (CAPTCHA)</span>
          </button>

          <button
            onClick={() => {
              sounds.click();
              onSwitchToCitizen?.();
            }}
            className="px-4 py-2.5 rounded-lg bg-transparent text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            Return to Citizen Portal
          </button>
        </div>
      </div>
    );
  }

  
  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastWard, setBroadcastWard] = useState('ALL');
  const [broadcastList, setBroadcastList] = useState([
    {
      id: 'BC-901',
      title: 'Warning: Fake Pothole Repair WhatsApp Payment Scam',
      ward: 'All Wards',
      timestamp: '2 hours ago',
      author: 'Chief Vigilance Officer',
      active: true
    },
    {
      id: 'BC-902',
      title: 'Official Streetlight Repair Protocol - Zero Citizen Payment',
      ward: 'Ward 12 & Ward 04',
      timestamp: 'Yesterday',
      author: 'MEU Safety Desk',
      active: true
    }
  ]);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Suspicious Reports / Spam moderation queue
  const [flaggedReports, setFlaggedReports] = useState([
    {
      id: 'SUSP-101',
      type: 'Potential Bot Spam / Duplicate',
      description: 'Multiple identical pothole images uploaded with mismatched EXIF signatures.',
      riskLevel: 'HIGH',
      ward: 'Ward 07',
      status: 'Under Review'
    },
    {
      id: 'SUSP-102',
      type: 'Imposter Worker Reported by Citizen',
      description: 'Citizen reported an individual demanding ₹200 for water pipe valve opening in Green Park.',
      riskLevel: 'CRITICAL',
      ward: 'Ward 15',
      status: 'Forwarded to Cyber Cell (1930)'
    }
  ]);

  const handleCreateBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    sounds.success();
    const newBc = {
      id: `BC-${Date.now().toString().slice(-3)}`,
      title: broadcastTitle,
      ward: broadcastWard === 'ALL' ? 'All Wards' : broadcastWard,
      timestamp: 'Just now',
      author: user?.name || 'Administrator',
      active: true
    };
    setBroadcastList([newBc, ...broadcastList]);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const handleResolveFlag = (id, resolution) => {
    sounds.click();
    setFlaggedReports((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: resolution } : item))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Admin Header Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-purple-400 p-0.5 bg-slate-950 shadow-lg shadow-purple-500/25">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
                alt={user?.name || "Admin"} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                  {user?.name || "Er. Rajesh Verma"}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                  <ShieldCheck size={10} />
                  <span>MUNICIPAL CHIEF ADMIN</span>
                </span>
                <button
                  onClick={() => {
                    sounds.click();
                    onSwitchToCitizen?.();
                  }}
                  className="px-2.5 py-0.5 text-[10px] font-mono rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  ⇄ Switch to Citizen Role
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Badge: <span className="font-mono text-purple-300">{user?.id || 'GOV-ADM-9942'}</span> • Dept: <span className="text-white font-semibold">{user?.departmentName || 'Road & Infrastructure (RID)'}</span> • Security: <span className="text-emerald-400 font-mono">Cloud Synced</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Open Tickets</span>
              <span className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                {issues.filter((i) => i.status !== 'Verified & Closed').length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Proof Validations</span>
              <span className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                {issues.filter((i) => i.proofOfWork).length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Spam Filtered</span>
              <span className="text-lg font-bold font-mono text-rose-400 mt-0.5">14 Bot Blocks</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-400 block font-medium uppercase tracking-wider">Gateway Status</span>
              <span className="text-xs font-bold text-emerald-300 flex items-center justify-center space-x-1 mt-1">
                <Lock size={12} />
                <span>SECURED</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sub Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto">
        <button
          onClick={() => {
            sounds.click();
            setAdminTab('dispatch');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
            adminTab === 'dispatch'
              ? 'border-purple-400 text-purple-400 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Truck size={14} />
          <span>Workforce Dispatch & Proof-of-Work Review</span>
        </button>

        <button
          onClick={() => {
            sounds.click();
            setAdminTab('anti-scam-moderation');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
            adminTab === 'anti-scam-moderation'
              ? 'border-rose-400 text-rose-400 bg-rose-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Anti-Fraud & Spam Moderation ({flaggedReports.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.click();
            setAdminTab('broadcast');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
            adminTab === 'broadcast'
              ? 'border-amber-400 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Radio size={14} />
          <span>Citizen Safety Broadcasts ({broadcastList.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: WORKFORCE DISPATCH & PROOF-OF-WORK ================= */}
      {adminTab === 'dispatch' && (
        <AuthorityPortal
          issues={issues}
          onUpdateIssueStatus={onUpdateIssueStatus}
          onSelectIssue={onSelectIssue}
          onSubmitProofOfWork={onSubmitProofOfWork}
        />
      )}

      {/* ================= TAB 2: ANTI-FRAUD & SPAM MODERATION ================= */}
      {adminTab === 'anti-scam-moderation' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <ShieldAlert size={18} />
              <span>AI Fraud Detection & Citizen Vigilance Queue</span>
            </div>
            <p className="text-xs text-slate-400">
              CityFix AI automatically flags potential spam, bot-generated images, duplicate floods, and reports of fraudulent imposter workers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {flaggedReports.map((flag) => (
              <div 
                key={flag.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-rose-400">{flag.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {flag.riskLevel} RISK
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{flag.ward}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                    Status: {flag.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{flag.type}</h4>
                  <p className="text-xs text-slate-300 mt-1">{flag.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleResolveFlag(flag.id, 'Escalated to Cyber Police (1930)')}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold"
                    >
                      Escalate to Cyber Cell
                    </button>
                    <button
                      onClick={() => handleResolveFlag(flag.id, 'Dismissed (False Positive)')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Dismiss Flag
                    </button>
                  </div>
                  <button
                    onClick={() => handleResolveFlag(flag.id, 'Resolved & Action Taken')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CITIZEN SAFETY BROADCASTS ================= */}
      {adminTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Radio size={18} />
              <span>Broadcast Official Civic Warning</span>
            </div>
            <p className="text-xs text-slate-400">
              Publish verified anti-scam advisories that appear instantly on all citizen dashboards and mobile feeds.
            </p>

            <form onSubmit={handleCreateBroadcast} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Broadcast Headline</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Warning: Fake Electricity Disconnection SMS"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Ward</label>
                <select
                  value={broadcastWard}
                  onChange={(e) => setBroadcastWard(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="ALL">All City Wards (City-Wide)</option>
                  {WARDS.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Advisory Details & Guidance</label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Details on what scammers are attempting and what citizens should do..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-1.5"
              >
                <Send size={14} />
                <span>Publish Official Advisory</span>
              </button>
            </form>

            {broadcastSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 size={16} />
                <span>Broadcast dispatched to all citizen portals successfully.</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers size={16} className="text-purple-400" />
              <span>Active Public Security Advisories ({broadcastList.length})</span>
            </h4>

            <div className="space-y-3">
              {broadcastList.map((bc) => (
                <div key={bc.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-cyan-400">{bc.id}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{bc.ward}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{bc.timestamp}</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{bc.title}</h5>
                  <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                    <span>Issued by: <strong className="text-purple-300">{bc.author}</strong></span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">LIVE ON CITIZEN PORTALS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

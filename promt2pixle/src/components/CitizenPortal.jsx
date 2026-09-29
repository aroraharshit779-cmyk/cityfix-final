import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  ThumbsUp, 
  Eye, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertTriangle,
  Lock,
  Radio,
  Zap,
  Check
} from 'lucide-react';
import { DEPARTMENTS, STATUS_STAGES } from '../data/mockData';
import { sounds } from '../utils/audio';

export const CitizenPortal = ({
  user,
  issues = [],
  onSelectIssue,
  onOpenReportModal,
  onOpenTrackModal,
  onOpenScamModal,
  onUpvoteIssue
}) => {
  const [activeSubTab, setActiveSubTab] = useState('my-reports'); // 'my-reports', 'watched', 'scam-hub', 'badges'
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [reportedScamText, setReportedScamText] = useState('');
  const [scamReportSuccess, setScamReportSuccess] = useState(false);

  // My issues
  const myIssues = issues.filter(
    (i) => (user && i.reporter === user.name) || i.id === 'CF-84201' || i.id === 'CF-99120'
  );

  // Watched issues
  const watchedIssues = issues.filter(
    (i) => i.upvotes > 20 && !myIssues.some((m) => m.id === i.id)
  );

  const filteredMyIssues = myIssues.filter((i) => {
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    return true;
  });

  const handleReportScamSubmit = (e) => {
    e.preventDefault();
    if (!reportedScamText.trim()) return;
    sounds.success();
    setScamReportSuccess(true);
    setReportedScamText('');
    setTimeout(() => setScamReportSuccess(false), 4000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Assigned':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Resolved (Pending Verification)':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Verified & Closed':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Citizen Profile & Karma Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Luminous Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* User Info */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 p-0.5 bg-slate-950 shadow-lg shadow-cyan-500/25">
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                  alt={user?.name || "Citizen"} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                <ShieldCheck size={14} />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                  {user?.name || "Aarav Sharma"}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle size={10} />
                  <span>VERIFIED CITIZEN</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Contact: <span className="font-mono text-cyan-300">{user?.contact || "+91 98765-43210"}</span> • Ward: <span className="text-white font-semibold">Ward 12 (Metro Central)</span>
              </p>
              <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-400 font-mono">
                <span className="text-cyan-400">Security Token: {user?.authSecurityToken || 'TLS-ECDSA-889142'}</span>
                <span>•</span>
                <span className="text-emerald-400">Cloud Synced</span>
              </div>
            </div>
          </div>

          {/* Citizen Civic Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Civic Karma</span>
              <span className="text-lg font-bold font-mono text-cyan-400 flex items-center justify-center space-x-1 mt-0.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>{user?.karmaScore || 480} pts</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Reports Filed</span>
              <span className="text-lg font-bold font-mono text-white mt-0.5">{myIssues.length}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Upvotes Cast</span>
              <span className="text-lg font-bold font-mono text-purple-400 mt-0.5">18</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-400 block font-medium uppercase tracking-wider">Anti-Scam Guard</span>
              <span className="text-xs font-bold text-emerald-300 flex items-center justify-center space-x-1 mt-1">
                <ShieldCheck size={14} />
                <span>100% PROTECTED</span>
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sounds.click();
                onOpenReportModal();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5"
            >
              <PlusCircle size={15} />
              <span>Report Grievance (50m AI Geofence)</span>
            </button>

            <button
              onClick={() => {
                sounds.click();
                onOpenTrackModal('');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <Search size={14} />
              <span>Search Any Ticket ID</span>
            </button>
          </div>

          <button
            onClick={() => {
              sounds.click();
              onOpenScamModal();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all flex items-center space-x-1.5"
          >
            <ShieldAlert size={14} className="text-amber-400" />
            <span>Anti-Scam Guide & Helplines (1930)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto">
        <button
          onClick={() => {
            sounds.click();
            setActiveSubTab('my-reports');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
            activeSubTab === 'my-reports'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>My Filed Grievances ({myIssues.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.click();
            setActiveSubTab('watched');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
            activeSubTab === 'watched'
              ? 'border-purple-400 text-purple-400 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ThumbsUp size={14} />
          <span>Community Issues Watched ({watchedIssues.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.click();
            setActiveSubTab('scam-hub');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
            activeSubTab === 'scam-hub'
              ? 'border-amber-400 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Scam Shield & Vigilance Hub</span>
        </button>

        <button
          onClick={() => {
            sounds.click();
            setActiveSubTab('badges');
          }}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
            activeSubTab === 'badges'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award size={14} />
          <span>Civic Badges & Karma</span>
        </button>
      </div>

      {/* ================= SUB-TAB 1: MY FILED GRIEVANCES ================= */}
      {activeSubTab === 'my-reports' && (
        <div className="space-y-4">
          
          {/* Status Filter Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium ml-2">Status:</span>
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === 'ALL' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({myIssues.length})
              </button>
              {STATUS_STAGES.map((st) => (
                <button
                  key={st.key}
                  onClick={() => setFilterStatus(st.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                    filterStatus === st.key ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                sounds.click();
                onOpenReportModal();
              }}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <PlusCircle size={14} />
              <span>+ New Complaint</span>
            </button>
          </div>

          {/* List of issues */}
          {filteredMyIssues.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <AlertCircle size={32} className="mx-auto text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-300">No grievances found in this filter</h3>
              <p className="text-xs text-slate-500">Report an issue in your locality to start tracking its real-time resolution.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredMyIssues.map((issue) => {
                const dept = DEPARTMENTS[issue.departmentId] || {};
                const currentStageObj = STATUS_STAGES.find((s) => s.key === issue.status) || STATUS_STAGES[0];

                return (
                  <div 
                    key={issue.id}
                    className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-4 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">{issue.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">{issue.wardName || 'Ward 12'}</span>
                        </div>
                        <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {issue.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {issue.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            sounds.click();
                            onSelectIssue(issue);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center space-x-1.5 transition-all"
                        >
                          <Eye size={14} />
                          <span>Audit Trail & Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-2">
                        <span>Resolution Workflow Progress:</span>
                        <span className="font-mono text-cyan-400 font-bold">Step {currentStageObj.step} of 5</span>
                      </div>
                      
                      {/* 5-step progress line */}
                      <div className="grid grid-cols-5 gap-1.5">
                        {STATUS_STAGES.map((st) => {
                          const isReached = currentStageObj.step >= st.step;
                          return (
                            <div key={st.key} className="space-y-1">
                              <div className={`h-2 rounded-full transition-all ${
                                isReached 
                                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-500/50' 
                                  : 'bg-slate-800'
                              }`} />
                              <span className={`block text-[10px] truncate ${
                                isReached ? 'text-slate-200 font-medium' : 'text-slate-600'
                              }`}>
                                {st.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Proof of Work verification badge if resolved */}
                    {issue.proofOfWork && (
                      <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                          <span><strong>Proof-of-Work Uploaded:</strong> Field Inspector {issue.proofOfWork.workerName} has submitted photo validation with {issue.proofOfWork.geoTagMatch}% GPS geofence match.</span>
                        </div>
                        <button
                          onClick={() => {
                            sounds.click();
                            onSelectIssue(issue);
                          }}
                          className="text-cyan-400 hover:underline font-bold text-xs shrink-0 ml-2"
                        >
                          Inspect Proof
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ================= SUB-TAB 2: WATCHED COMMUNITY ISSUES ================= */}
      {activeSubTab === 'watched' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between text-xs text-purple-300">
            <div className="flex items-center space-x-2">
              <ThumbsUp size={16} className="text-purple-400" />
              <span>You receive real-time updates whenever municipal crews update issues you have upvoted.</span>
            </div>
            <span className="font-mono text-xs">{watchedIssues.length} Watched</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchedIssues.map((issue) => (
              <div 
                key={issue.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-400">{issue.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{issue.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{issue.description}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">👍 {issue.upvotes} Citizens Upvoted</span>
                  <button
                    onClick={() => {
                      sounds.click();
                      onSelectIssue(issue);
                    }}
                    className="text-purple-400 hover:underline font-medium"
                  >
                    View Timeline →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: SCAM SHIELD & VIGILANCE HUB ================= */}
      {activeSubTab === 'scam-hub' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">Report Suspicious Imposter or Payment Demand</h3>
                  <p className="text-xs text-slate-400">Encountered someone claiming to be a municipal worker asking for cash?</p>
                </div>
              </div>

              <form onSubmit={handleReportScamSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={reportedScamText}
                  onChange={(e) => setReportedScamText(e.target.value)}
                  placeholder="Describe the suspicious call, WhatsApp message, or fake worker (include phone number or location if known)..."
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Reports are escalated immediately to the Municipal Vigilance & Cyber Crime Wing.
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    Submit Vigilance Report
                  </button>
                </div>
              </form>

              {scamReportSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 size={16} />
                  <span>Report submitted successfully to Vigilance Cell. Ticket ref: #VIG-{Date.now().toString().slice(-5)}.</span>
                </div>
              )}
            </div>

            {/* Live Scam Advisories */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertTriangle size={16} className="text-rose-400" />
                <span>Active Ward Cyber Security Alerts</span>
              </h4>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center justify-between text-amber-400 font-semibold text-[11px]">
                    <span>⚠️ Fake QR Code Stickers in Ward 04</span>
                    <span className="text-slate-500 font-mono">Yesterday</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Unauthorized QR stickers promising 'instant tree pruning' were spotted on Connaught Place poles. Municipal crews have removed them. Do not scan unofficial paper stickers.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center justify-between text-cyan-400 font-semibold text-[11px]">
                    <span>🛡️ Official Notice: Zero Fees Policy</span>
                    <span className="text-slate-500 font-mono">3 days ago</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    If a repairman visits your street and demands cash or OTP, refuse immediately and report on CityFix.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Lock size={16} className="text-cyan-400" />
              <span>Citizen Safety Checklist</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2 text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>All CityFix services are 100% free of charge.</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Look for the Verified Digital Seal on resolution photos.</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Report phishing calls directly to helpline <strong>1930</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.click();
                onOpenScamModal();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1"
            >
              <span>Take Scam Quiz & Earn Badge</span>
              <ChevronRight size={14} />
            </button>
          </div>

        </div>
      )}

      {/* ================= SUB-TAB 4: CIVIC BADGES ================= */}
      {activeSubTab === 'badges' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-heading font-bold text-white">Your Civic Karma & Gamified Milestones</h3>
            <p className="text-xs text-slate-400">Earn badges and civic recognition by reporting verified issues and keeping your community safe.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Verified Citizen</h4>
              <p className="text-xs text-slate-400">Completed Anti-Bot Security Verification.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">UNLOCKED</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Pothole Patrol</h4>
              <p className="text-xs text-slate-400">Reported 3+ verified road hazards leading to municipal road repair.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">UNLOCKED</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Scam Buster Shield</h4>
              <p className="text-xs text-slate-400">Passed the Civic Scam Awareness Certification.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">UNLOCKED</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

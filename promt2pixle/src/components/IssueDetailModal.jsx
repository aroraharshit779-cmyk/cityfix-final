import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ThumbsUp, 
  Camera, 
  AlertCircle, 
  User, 
  Layers, 
  Check, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Truck,
  ShieldAlert
} from 'lucide-react';
import { DEPARTMENTS, STATUS_STAGES } from '../data/mockData';
import { sounds } from '../utils/audio';

export const IssueDetailModal = ({
  issue,
  authUser,
  onClose,
  onUpvoteIssue,
  onUpdateIssueStatus
}) => {
  const [activePhotoTab, setActivePhotoTab] = useState('SPLIT'); // 'SPLIT', 'BEFORE', 'AFTER'

  if (!issue) return null;

  const dept = DEPARTMENTS[issue.departmentId] || DEPARTMENTS.ROAD;
  const isResolved = issue.status?.toLowerCase().includes('resolved') || issue.status?.toLowerCase().includes('closed');

  const currentStageIndex = STATUS_STAGES.findIndex(
    (s) => s.key === issue.status
  );

  const handleCitizenConfirm = () => {
    sounds.success();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    onUpdateIssueStatus(issue.id, 'Verified & Closed', 'Citizen confirmed defect fully repaired on-site.');
  };

  const handleCitizenDispute = () => {
    sounds.alert();
    const reason = prompt("Please provide reason for reopening the issue:", "Repair quality unsatisfactory / partial patch only");
    if (reason) {
      onUpdateIssueStatus(issue.id, 'In Progress', `Citizen disputed resolution: "${reason}". Field crew flagged for re-inspection.`);
    }
  };

  const handleAdminDispatch = () => {
    sounds.click();
    onUpdateIssueStatus(issue.id, 'In Progress', `Municipal Admin ${authUser?.name || 'Officer'} dispatched rapid crew to location.`);
  };

  const handleAdminVerify = () => {
    sounds.success();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    onUpdateIssueStatus(issue.id, 'Verified & Closed', `Municipal Admin ${authUser?.name || 'Inspector'} verified EXIF and closed work order.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <span className="font-mono font-bold text-sm text-cyan-400">
              #{issue.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold ${dept.bgClass}`}>
              {dept.name}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              {issue.wardName}
            </span>
          </div>

          <button
            onClick={() => { sounds.click(); onClose(); }}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Title & Status */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                {issue.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-cyan-400 shrink-0" />
                <span>{issue.location?.address}</span>
                <span className="text-slate-600 font-mono">
                  ({issue.location?.lat?.toFixed(5)}, {issue.location?.lng?.toFixed(5)})
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isResolved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : issue.status === 'In Progress'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {issue.status}
              </span>

              {/* Citizen Upvote Button */}
              {authUser?.role === 'citizen' && (
                <button
                  onClick={() => {
                    sounds.success();
                    onUpvoteIssue(issue.id);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-bold transition-all"
                >
                  <ThumbsUp size={13} className="text-cyan-400" />
                  <span>Upvote ({issue.upvotes || 0})</span>
                </button>
              )}
            </div>
          </div>

          {/* ADMIN ACTION PANEL (Only for Admins) */}
          {authUser?.role === 'admin' && (
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs font-mono">
                  <ShieldCheck size={16} className="text-purple-400" />
                  <span>MUNICIPAL AUTHORITY INSPECTION & REVIEW ACTIONS</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  ADMIN ONLY
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {issue.status === 'Reported' && (
                  <button
                    onClick={handleAdminDispatch}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                  >
                    <Truck size={14} />
                    <span>Dispatch Field Crew (Set In Progress)</span>
                  </button>
                )}

                {issue.status !== 'Verified & Closed' && (
                  <button
                    onClick={handleAdminVerify}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve Proof & Close Ticket (Verified & Closed)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.alert();
                    alert(`Flagged issue #${issue.id} for Municipal Vigilance Cell inspection.`);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25 transition-colors flex items-center space-x-1.5"
                >
                  <ShieldAlert size={14} />
                  <span>Flag Potential Fraud</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Progression Stepper */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-3">
              Resolution Pipeline Stepper
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {STATUS_STAGES.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="space-y-1">
                    <div className={`h-1.5 rounded-full transition-all ${
                      isPassed ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-slate-800'
                    }`} />
                    <span className={`text-[11px] block truncate font-mono ${
                      isCurrent ? 'text-cyan-300 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {stage.label.split('/')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Before & After Photo Proof Inspector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
                <Camera size={14} className="text-cyan-400" />
                Proof-of-Work Photo Comparison
              </h3>

              <div className="flex items-center space-x-1 text-xs">
                {['SPLIT', 'BEFORE', 'AFTER'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { sounds.click(); setActivePhotoTab(tab); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      activePhotoTab === tab
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Viewport */}
            {activePhotoTab === 'SPLIT' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden h-56 bg-slate-950 border border-slate-800">
                  <img src={issue.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/30 text-[10px] font-mono font-bold text-rose-300">
                    BEFORE (Original Citizen Report)
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden h-56 bg-slate-950 border border-slate-800 flex items-center justify-center">
                  {issue.afterImage ? (
                    <>
                      <img src={issue.afterImage} alt="After" className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300">
                        AFTER (Proof-of-Work Validated)
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 space-y-1 text-slate-500">
                      <Camera size={24} className="mx-auto text-slate-600" />
                      <p className="text-xs">After-Photo Pending</p>
                      <p className="text-[10px] font-mono text-slate-600">Awaiting field crew resolution upload</p>
                    </div>
                  )}
                </div>
              </div>
            ) : activePhotoTab === 'BEFORE' ? (
              <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-950 border border-slate-800">
                <img src={issue.beforeImage} alt="Before" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-rose-950 text-xs font-mono font-bold text-rose-300">
                  BEFORE (Original Report)
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-950 border border-slate-800">
                <img src={issue.afterImage || issue.beforeImage} alt="After" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-emerald-950 text-xs font-mono font-bold text-emerald-300">
                  AFTER (Proof-of-Work Validated)
                </div>
              </div>
            )}

            {/* Proof-of-Work Notes if submitted */}
            {issue.proofOfWork && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Field Inspector: <strong className="text-white">{issue.proofOfWork.workerName}</strong> ({issue.proofOfWork.workerId})</span>
                  <span className="text-emerald-400">Validated Geofence: 12m accuracy</span>
                </div>
                <p className="text-slate-300 text-xs pt-1">
                  <strong>Resolution Engineering Log:</strong> {issue.proofOfWork.notes}
                </p>
              </div>
            )}
          </div>

          {/* Citizen Verification Action Banner (only for citizens when pending) */}
          {authUser?.role === 'citizen' && issue.status === 'Resolved (Pending Verification)' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-emerald-950/50 border border-cyan-500/40 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                    <Sparkles size={14} className="text-cyan-400" />
                    Citizen Verification Required
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Field authorities have submitted photographic proof of work. As a citizen, inspect the repair and confirm closure.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleCitizenConfirm}
                  className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all"
                >
                  <Check size={14} />
                  <span>Confirm Resolution (Close Ticket)</span>
                </button>

                <button
                  onClick={handleCitizenDispute}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
                >
                  Dispute / Reopen Work Order
                </button>
              </div>
            </div>
          )}

          {/* Immutable Audit Log Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
              <ShieldCheck size={14} className="text-cyan-400" />
              Immutable Audit Trail Log
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 divide-y divide-slate-800/80">
              {issue.auditTrail && issue.auditTrail.map((log, idx) => (
                <div key={log.id || idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {log.action}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 pl-3">
                    {log.details}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 pl-3">
                    Actor: {log.by}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">CityFix Open Civic Record #{issue.id}</span>
          <button
            onClick={() => { sounds.click(); onClose(); }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};

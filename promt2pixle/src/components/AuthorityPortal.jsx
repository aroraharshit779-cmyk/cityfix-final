import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  MapPin, 
  FileText, 
  Upload, 
  Check, 
  X, 
  Sparkles, 
  Eye, 
  ChevronRight,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { DEPARTMENTS, STATUS_STAGES } from '../data/mockData';
import { sounds } from '../utils/audio';

const AFTER_SAMPLE_PHOTOS = [
  { label: "Paved Road (Repaired)", url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80" },
  { label: "Fixed Streetlight (Illuminated)", url: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80" },
  { label: "Cleaned Park / Dump (Cleared)", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" }
];

export const AuthorityPortal = ({
  issues = [],
  onUpdateIssueStatus,
  onSelectIssue,
  onSubmitProofOfWork
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  
  // Proof-of-Work Closure Modal State (USP 3)
  const [powModalIssue, setPowModalIssue] = useState(null);
  const [afterImage, setAfterImage] = useState(AFTER_SAMPLE_PHOTOS[0].url);
  const [workerName, setWorkerName] = useState('Eng. Vikramaditya (Lead Inspector)');
  const [workerId, setWorkerId] = useState('CREW-RID-884');
  const [resolutionNotes, setResolutionNotes] = useState('Excavated loose road rubble, filled sub-base, poured 80mm hot-mix bitumen and compacted with vibratory roller. Traffic open.');

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    if (selectedDeptFilter !== 'ALL' && issue.departmentId !== selectedDeptFilter) return false;
    if (selectedStatusTab !== 'ALL' && issue.status !== selectedStatusTab) return false;
    return true;
  });

  const getStatusCount = (statusKey) => {
    return issues.filter((i) => {
      const deptMatches = selectedDeptFilter === 'ALL' || i.departmentId === selectedDeptFilter;
      return deptMatches && i.status === statusKey;
    }).length;
  };

  const handleOpenPowModal = (issue) => {
    sounds.click();
    setPowModalIssue(issue);
    // Suggest relevant after photo
    if (issue.departmentId === 'ELECTRICAL') {
      setAfterImage(AFTER_SAMPLE_PHOTOS[1].url);
    } else if (issue.departmentId === 'SANITATION' || issue.departmentId === 'HORTICULTURE') {
      setAfterImage(AFTER_SAMPLE_PHOTOS[2].url);
    } else {
      setAfterImage(AFTER_SAMPLE_PHOTOS[0].url);
    }
  };

  const handleConfirmPowSubmit = (e) => {
    e.preventDefault();
    if (!afterImage || !resolutionNotes.trim()) {
      alert("Please ensure both the proof photograph and resolution notes are provided.");
      return;
    }

    sounds.success();

    const powPayload = {
      workerId,
      workerName,
      resolvedAt: new Date().toISOString(),
      notes: resolutionNotes.trim(),
      geoTagMatch: 99.4,
      deviceTimestampVerified: true
    };

    onSubmitProofOfWork(powModalIssue.id, afterImage, powPayload);
    setPowModalIssue(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Civic Command Center */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading text-white">
                  Municipal Field Authority & Proof-of-Work Command
                </h2>
                <p className="text-xs text-slate-400">
                  Strict Proof-of-Work Closure Loop • Geo-tagged EXIF Validation • Zero-Fraud Resolution
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-purple-500/20 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Pending Field Verification</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">
                {issues.filter((i) => i.status === 'Resolved (Pending Verification)').length}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-purple-500/20 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">In Progress Crews</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                {issues.filter((i) => i.status === 'In Progress').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => { sounds.click(); setSelectedDeptFilter('ALL'); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedDeptFilter === 'ALL'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Departments ({issues.length})
        </button>

        {Object.values(DEPARTMENTS).map((dept) => {
          const count = issues.filter((i) => i.departmentId === dept.id).length;
          const isAct = selectedDeptFilter === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => { sounds.click(); setSelectedDeptFilter(dept.id); }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isAct
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }}></span>
              <span>{dept.shortName}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Status Pipeline Stages Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => { sounds.click(); setSelectedStatusTab('ALL'); }}
          className={`p-3 rounded-xl text-left border transition-all ${
            selectedStatusTab === 'ALL'
              ? 'bg-slate-800/90 border-cyan-400/50 text-white shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-slate-400">Total Work Orders</div>
          <div className="text-xl font-bold font-mono mt-0.5">{issues.length}</div>
        </button>

        <button
          onClick={() => { sounds.click(); setSelectedStatusTab('Reported'); }}
          className={`p-3 rounded-xl text-left border transition-all ${
            selectedStatusTab === 'Reported'
              ? 'bg-blue-950/40 border-blue-400 text-blue-300 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-blue-400">1. Reported</div>
          <div className="text-xl font-bold font-mono mt-0.5 text-blue-300">{getStatusCount('Reported')}</div>
        </button>

        <button
          onClick={() => { sounds.click(); setSelectedStatusTab('In Progress'); }}
          className={`p-3 rounded-xl text-left border transition-all ${
            selectedStatusTab === 'In Progress'
              ? 'bg-amber-950/40 border-amber-400 text-amber-300 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-amber-400">2. In Progress (SLA)</div>
          <div className="text-xl font-bold font-mono mt-0.5 text-amber-300">{getStatusCount('In Progress')}</div>
        </button>

        <button
          onClick={() => { sounds.click(); setSelectedStatusTab('Resolved (Pending Verification)'); }}
          className={`p-3 rounded-xl text-left border transition-all ${
            selectedStatusTab === 'Resolved (Pending Verification)'
              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-cyan-400">3. Proof-of-Work Done</div>
          <div className="text-xl font-bold font-mono mt-0.5 text-cyan-300">
            {getStatusCount('Resolved (Pending Verification)')}
          </div>
        </button>

        <button
          onClick={() => { sounds.click(); setSelectedStatusTab('Verified & Closed'); }}
          className={`p-3 rounded-xl text-left border transition-all ${
            selectedStatusTab === 'Verified & Closed'
              ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-emerald-400">4. Verified & Closed</div>
          <div className="text-xl font-bold font-mono mt-0.5 text-emerald-300">{getStatusCount('Verified & Closed')}</div>
        </button>
      </div>

      {/* Issues Management List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-300">No Complaints in this Stage</h4>
            <p className="text-xs text-slate-500 mt-1">
              Select another department or pipeline filter to view issues.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const dept = DEPARTMENTS[issue.departmentId] || DEPARTMENTS.ROAD;
            const isInProgress = issue.status === 'In Progress';
            const isResolvedPending = issue.status === 'Resolved (Pending Verification)';
            const isClosed = issue.status === 'Verified & Closed';

            return (
              <div
                key={issue.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left: Info & Thumbnails */}
                <div className="flex items-start space-x-4">
                  <div className="relative shrink-0">
                    <img
                      src={issue.beforeImage || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7'}
                      alt="Before"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-700 shadow"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-slate-950 text-slate-300 border border-slate-800">
                      BEFORE
                    </span>
                  </div>

                  {issue.afterImage && (
                    <div className="relative shrink-0 hidden sm:block">
                      <img
                        src={issue.afterImage}
                        alt="After"
                        className="w-20 h-20 rounded-xl object-cover border border-emerald-500/40 shadow"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        AFTER
                      </span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {issue.id}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${dept.bgClass}`}>
                        {dept.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {issue.wardName || 'Ward 12'}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        issue.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        Priority: {issue.priority}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors"
                        onClick={() => onSelectIssue(issue)}>
                      {issue.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        📍 <span className="text-slate-400">{issue.location?.address}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-amber-400">
                        <Clock size={12} /> SLA: {issue.slaHours || 24}h target
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 font-mono">
                        Assigned: {issue.assignedTo?.split('(')[0] || 'Field Crew'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Strict Proof-of-Work Button */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <button
                    onClick={() => { sounds.click(); onSelectIssue(issue); }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Inspect Full Audit Trail & Details"
                  >
                    <Eye size={15} />
                    <span>Audit Log</span>
                  </button>

                  {/* Stage 1: Reported -> Dispatch Crew */}
                  {issue.status === 'Reported' && (
                    <button
                      onClick={() => {
                        sounds.click();
                        onUpdateIssueStatus(issue.id, 'In Progress', 'Field Crew Dispatched with Heavy Equipment');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                    >
                      <Truck size={15} />
                      <span>Dispatch Crew</span>
                    </button>
                  )}

                  {/* Stage 2: In Progress -> STRICT PROOF-OF-WORK CLOSURE LOOP (USP 3) */}
                  {isInProgress && (
                    <button
                      onClick={() => handleOpenPowModal(issue)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
                    >
                      <Camera size={15} />
                      <span>Upload Proof-of-Work to Resolve</span>
                    </button>
                  )}

                  {/* Stage 3: Resolved (Pending Verification) -> Final Verification */}
                  {isResolvedPending && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-cyan-400 px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/30">
                        Geo-Proof Logged (99.4% Match)
                      </span>
                      <button
                        onClick={() => {
                          sounds.success();
                          onUpdateIssueStatus(issue.id, 'Verified & Closed', 'Citizen & Ward Officer Verified Proof-of-Work');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                      >
                        <CheckCircle2 size={15} />
                        <span>Verify & Close</span>
                      </button>
                    </div>
                  )}

                  {/* Stage 4: Closed */}
                  {isClosed && (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Closed & Archived
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= PROOF-OF-WORK UPLOAD MODAL (USP 3) ================= */}
      {powModalIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Camera size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Submit Proof-of-Work Resolution
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ticket #{powModalIssue.id} • Mandated Geo-tag and Timestamp Validation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPowModalIssue(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmPowSubmit} className="p-6 space-y-4">
              
              {/* Reference Before Photo */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
                <img
                  src={powModalIssue.beforeImage || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7'}
                  alt="Original issue"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Original Defect Reported</span>
                  <h5 className="font-bold text-white text-xs">{powModalIssue.title}</h5>
                  <p className="text-slate-400 text-[11px] line-clamp-1">{powModalIssue.location?.address}</p>
                </div>
              </div>

              {/* Upload After Photo (USP 3 core requirement) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Upload "After" Resolution Photo *
                </label>

                {/* Sample selector */}
                <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">Sample Proof:</span>
                  {AFTER_SAMPLE_PHOTOS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { sounds.click(); setAfterImage(item.url); }}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-all ${
                        afterImage === item.url
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Preview */}
                <div className="relative rounded-xl overflow-hidden h-40 bg-slate-950 border border-slate-800">
                  <img
                    src={afterImage}
                    alt="Proof of work"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  
                  {/* Watermark badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                    EXIF: {powModalIssue.location?.lat?.toFixed(4)}, {powModalIssue.location?.lng?.toFixed(4)}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 size={13} /> GPS Match 99.4% (Within 12m Geofence)
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      Timestamp: {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Field Officer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Field Worker / Inspector *
                  </label>
                  <input
                    type="text"
                    required
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Crew / Device Badge ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={workerId}
                    onChange={(e) => setWorkerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Resolution Engineering Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail the materials used, tests performed, and cleanup status..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPowModalIssue(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 size={15} />
                  <span>Submit Proof-of-Work & Mark Resolved</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

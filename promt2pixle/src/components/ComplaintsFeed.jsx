import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Share2, 
  Filter, 
  Search, 
  Eye, 
  Camera, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { DEPARTMENTS, WARDS } from '../data/mockData';
import { sounds } from '../utils/audio';

export const ComplaintsFeed = ({
  issues = [],
  onSelectIssue,
  onUpvoteIssue,
  onOpenReportModal
}) => {
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'MY', 'URGENT', 'RESOLVED'
  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');

  const filteredIssues = issues.filter((issue) => {
    if (filterTab === 'URGENT' && issue.priority !== 'Critical' && issue.priority !== 'High') return false;
    if (filterTab === 'RESOLVED' && !issue.status.includes('Resolved') && !issue.status.includes('Closed')) return false;
    if (filterTab === 'MY' && !issue.upvotedBy?.includes('current-citizen-demo')) return false;
    if (selectedWard !== 'ALL' && issue.wardId !== selectedWard) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = issue.id?.toLowerCase().includes(q);
      const matchTitle = issue.title?.toLowerCase().includes(q);
      const matchDesc = issue.description?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Feed Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        
        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => { sounds.click(); setFilterTab('ALL'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            All Live Issues ({issues.length})
          </button>

          <button
            onClick={() => { sounds.click(); setFilterTab('URGENT'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'URGENT'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            Urgent / High ({issues.filter((i) => i.priority === 'High' || i.priority === 'Critical').length})
          </button>

          <button
            onClick={() => { sounds.click(); setFilterTab('RESOLVED'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'RESOLVED'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            Resolved Proofs ({issues.filter((i) => i.status.includes('Resolved') || i.status.includes('Closed')).length})
          </button>

          <button
            onClick={() => { sounds.click(); setFilterTab('MY'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'MY'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            My Tracked Reports
          </button>
        </div>

        {/* Search & Ward Select */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              placeholder="Search feed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Wards</option>
            {WARDS.map((w) => (
              <option key={w.id} value={w.id}>{w.id}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIssues.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-300">No Complaints Match Filter</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or filter selection.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const dept = DEPARTMENTS[issue.departmentId] || DEPARTMENTS.ROAD;
            const isResolved = issue.status?.toLowerCase().includes('resolved') || issue.status?.toLowerCase().includes('closed');

            return (
              <div
                key={issue.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all p-5 shadow-lg flex flex-col justify-between space-y-4 hover:shadow-cyan-500/5 group"
              >
                {/* Header & Badges */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      #{issue.id}
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 font-normal">{issue.wardId}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isResolved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : issue.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => { sounds.click(); onSelectIssue(issue); }}
                    className="font-bold text-sm text-white group-hover:text-cyan-300 cursor-pointer transition-colors line-clamp-1"
                  >
                    {issue.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Photo Comparison / Thumbnail */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative rounded-xl overflow-hidden h-32 bg-slate-950 border border-slate-800">
                    <img
                      src={issue.beforeImage || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7'}
                      alt="Before"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700">
                      BEFORE
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden h-32 bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {issue.afterImage ? (
                      <>
                        <img
                          src={issue.afterImage}
                          alt="After"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                          AFTER PROOF
                        </span>
                      </>
                    ) : (
                      <div className="text-center p-3 text-slate-600">
                        <Clock className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px] font-mono text-slate-500 block">Work In Progress</span>
                        <span className="text-[9px] text-slate-600">Proof Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta details: SLA, Landmark */}
                <div className="space-y-1.5 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 truncate max-w-[200px]" title={issue.location?.address}>
                      📍 {issue.location?.address}
                    </span>
                    <span className="font-mono text-amber-400 shrink-0">
                      SLA: {issue.slaHours || 24}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${dept.bgClass}`}>
                      {dept.shortName}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      Reported: {new Date(issue.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions: Upvote & Audit Inspector */}
                <div className="flex items-center justify-between pt-1">
                  {/* Upvote Button */}
                  <button
                    onClick={() => {
                      sounds.success();
                      onUpvoteIssue(issue.id);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold transition-all active:scale-95"
                    title="Upvote this complaint to raise municipal urgency"
                  >
                    <ThumbsUp size={14} className="text-cyan-400" />
                    <span>Upvote</span>
                    <span className="font-mono text-cyan-400 font-bold ml-1">
                      ({issue.upvotes || 0})
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.click();
                      onSelectIssue(issue);
                    }}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Eye size={13} />
                    <span>Inspect Audit</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

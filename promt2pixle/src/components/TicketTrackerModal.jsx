import React from 'react';
import { Search, X, CheckCircle2, Clock, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { DEPARTMENTS, STATUS_STAGES } from '../data/mockData';
import { sounds } from '../utils/audio';

export const TicketTrackerModal = ({
  searchQuery = '',
  isOpen,
  onClose,
  issues = [],
  onSelectIssue
}) => {
  if (!isOpen) return null;

  const foundIssues = issues.filter((i) => {
    const q = searchQuery.toLowerCase().trim();
    return i.id?.toLowerCase().includes(q) || i.title?.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Ticket Status Tracker</h3>
          </div>
          <button
            onClick={() => { sounds.click(); onClose(); }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {foundIssues.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <p>No complaints found matching "{searchQuery}".</p>
              <p className="mt-1 text-slate-600">Try searching "CF-84201" or "pothole".</p>
            </div>
          ) : (
            foundIssues.map((issue) => {
              const dept = DEPARTMENTS[issue.departmentId] || DEPARTMENTS.ROAD;
              const isResolved = issue.status?.toLowerCase().includes('resolved') || issue.status?.toLowerCase().includes('closed');

              return (
                <div
                  key={issue.id}
                  onClick={() => {
                    sounds.click();
                    onSelectIssue(issue);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cyan-400">#{issue.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isResolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs">{issue.title}</h4>
                    <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{issue.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-800">
                    <span>Dept: {dept.shortName}</span>
                    <span className="text-cyan-400 flex items-center gap-1 font-bold">
                      View Full Details <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

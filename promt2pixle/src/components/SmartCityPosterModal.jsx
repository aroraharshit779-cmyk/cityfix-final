import React from 'react';
import { X, Download, Sparkles, Building2, Sun, Droplets, Truck, Train, Layers, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

const PILLARS = [
  {
    icon: Sun,
    title: "Clean Energy",
    desc: "Solar facades, kinetic pavements, and automated grid telemetry."
  },
  {
    icon: Building2,
    title: "Smart Living",
    desc: "Biophilic architectural spaces with sensor-driven microclimates."
  },
  {
    icon: Train,
    title: "Seamless Mobility",
    desc: "Autonomous multi-tier light rail and zero-emission transit."
  },
  {
    icon: Droplets,
    title: "Resource Efficiency",
    desc: "Rainwater harvesting reservoirs and cyclic closed-loop purification."
  },
  {
    icon: Truck,
    title: "Automated Systems",
    desc: "Underground robotic freight distribution and automated logistics."
  },
  {
    icon: ShieldCheck,
    title: "Civic Governance (CityFix)",
    desc: "Real-time citizen reporting, AI duplicate guard, and proof-of-work resolution."
  }
];

export const SmartCityPosterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-500/25 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <img 
              src="/cityfix-logo.png" 
              alt="Logo" 
              className="w-10 h-7 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" 
            />
            <div>
              <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                A Smarter Tomorrow • Smart City Master Blueprint
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OFFICIAL POSTER
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                People • Technology • Nature in Harmony — Powered by CityFix Civic Governance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="/cityfix-poster.jpg"
              download="CityFix_A_Smarter_Tomorrow_Poster.jpg"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
            >
              <Download size={14} />
              <span>Download Poster</span>
            </a>
            <button
              onClick={() => { sounds.click(); onClose(); }}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Left: The High-Resolution Poster Showcase */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl group w-full bg-slate-950">
              <img
                src="/cityfix-poster.jpg"
                alt="A Smarter Tomorrow Poster"
                className="w-full h-auto max-h-[620px] object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800">
                <span className="font-mono text-cyan-300 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-cyan-400" />
                  Visual Architecture Specification
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Autonomous Multi-Tier City
                </span>
              </div>
            </div>
          </div>

          {/* Right: Architectural Breakdown & CityFix Governance Alignment */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            <div>
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex items-center space-x-2">
                  <img src="/cityfix-logo.png" alt="Logo" className="w-8 h-5 object-contain" />
                  <span className="font-heading font-bold text-sm text-cyan-300">
                    The CityFix Governance Layer
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As shown in the master blueprint, modern sustainable cities rely on multi-tier infrastructure: elevated transit, biophilic housing, subterranean utilities, and automated freight. 
                  <strong> CityFix</strong> provides the real-time sensor & citizen reporting network that keeps every tier maintained with <strong>verified proof-of-work closures</strong>.
                </p>
              </div>

              {/* 6 Core Pillars Breakdown */}
              <div className="mt-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
                  Integrated Blueprint Systems
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  {PILLARS.map((p, idx) => {
                    const Icon = p.icon;
                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                          <Icon size={14} />
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-xs">{p.title}</h5>
                          <p className="text-[11px] text-slate-400">{p.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-mono">
                "A Smarter Tomorrow • People • Technology • Nature in Harmony"
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

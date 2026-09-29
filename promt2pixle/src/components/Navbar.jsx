import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  BarChart3, 
  PlusCircle, 
  Search, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Menu, 
  X, 
  Sparkles,
  Layers,
  Radio,
  User,
  ShieldAlert,
  LogOut,
  ChevronDown,
  KeyRound,
  Lock,
  Zap,
  Globe
} from 'lucide-react';
import { sounds } from '../utils/audio';
import cityFixLogo from '../assets/cityfix-logo.png';

export const Navbar = ({
  activeTab,
  setActiveTab,
  authUser,
  onOpenAuthModal,
  onLogout,
  onOpenScamModal,
  onOpenReportModal,
  onOpenTrackModal,
  onResetData,
  onTriggerDemoDuplicate,
  soundEnabled,
  setSoundEnabled,
  issuesCount = 0
}) => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleNav = (tab) => {
    sounds.click();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    onOpenTrackModal(searchVal.trim());
    setSearchVal('');
  };

  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#030712]/90 backdrop-blur-2xl">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Minimalist Geometric Brand Identity */}
          <div 
            onClick={() => handleNav('map')} 
            className="flex items-center space-x-3.5 cursor-pointer group shrink-0 select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-950/20 group-hover:border-cyan-400/60 group-hover:bg-cyan-900/30 transition-all duration-300">
              <div className="absolute inset-0 bg-cyan-400/15 blur-sm rounded-lg"></div>
              <img 
                src={cityFixLogo} 
                alt="CityFix Scalable Vector Logo" 
                className="relative z-10 w-7 h-7 object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-lg tracking-tight text-white flex items-center">
                  CITY<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">FIX</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wider rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  ENTERPRISE
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 tracking-wider">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ONLINE</span>
                </span>
                <span>•</span>
                <span className="hidden sm:inline text-slate-400">GEO-INTELLIGENCE MATRIX</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (Minimal Geometric Proportions) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#090e1a]/90 p-1 rounded-xl border border-white/[0.08] shadow-inner">
            
            {/* Citizen Portal Tab */}
            <button
              onClick={() => handleNav('citizen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'citizen'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <User size={13} />
              <span>Citizen Portal</span>
            </button>

            {/* Admin Portal Tab */}
            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-500 text-white font-bold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <ShieldCheck size={13} />
              <span>Admin Portal</span>
            </button>

            {/* Radar Map */}
            <button
              onClick={() => handleNav('map')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'map'
                  ? 'bg-white/10 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Radio size={13} className={activeTab === 'map' ? 'text-cyan-400' : ''} />
              <span>Radar Matrix</span>
            </button>

            {/* Complaints Feed */}
            <button
              onClick={() => handleNav('feed')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'feed'
                  ? 'bg-white/10 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Layers size={13} />
              <span>Telemetry Feed</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] text-slate-300">
                {issuesCount}
              </span>
            </button>

            {/* Transparency Hub */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white/10 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <BarChart3 size={13} />
              <span>Transparency</span>
            </button>

          </nav>

          {/* Right Action Buttons */}
          {/* Right Action Buttons (Intelligent Simplicity & Geometric Silhouettes) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Ticket Tracker search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="TRACK TICKET #"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-28 xl:w-36 pl-7 pr-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.06] font-mono transition-all"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Report Issue CTA - High Silhouette Vector Accent */}
            <button
              onClick={() => {
                sounds.click();
                onOpenReportModal();
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_-3px_rgba(6,182,212,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all tracking-wide"
            >
              <PlusCircle size={14} />
              <span>Report Issue</span>
            </button>

            {/* Enterprise Login Portal Gateway */}
            <button
              onClick={() => {
                sounds.click();
                onOpenAuthModal(authUser?.role === 'admin' ? 'admin' : 'citizen');
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-cyan-500/50 text-slate-200 hover:text-white font-semibold text-xs transition-all group"
              title="Open Secure Login Gateway (Anti-Bot CAPTCHA)"
            >
              <KeyRound size={13} className="text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Access Gateway</span>
              <span className="sm:hidden">Login</span>
            </button>

            {/* User Profile Dropdown Pill */}
            {authUser && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    authUser.role === 'admin'
                      ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                      : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                  }`}
                >
                  <img
                    src={authUser.avatar}
                    alt={authUser.name}
                    className="w-6 h-6 rounded-lg object-cover border border-white/20"
                  />
                  <div className="text-left hidden xl:block">
                    <span className="block text-[11px] font-bold text-white leading-none truncate max-w-[90px]">
                      {authUser.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 leading-none">
                      {authUser.role === 'admin' ? 'Admin' : 'Citizen'}
                    </span>
                  </div>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 text-xs animate-fadeIn">
                    <div className="p-2 border-b border-slate-800">
                      <p className="font-bold text-white text-xs">{authUser.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{authUser.contact}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300">
                        {authUser.role === 'admin' ? 'Official Admin' : 'Verified Citizen'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onOpenAuthModal('citizen');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-cyan-300 flex items-center space-x-2"
                    >
                      <KeyRound size={13} />
                      <span>Switch / Relogin as Citizen</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenAuthModal('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-purple-300 flex items-center space-x-2"
                    >
                      <ShieldCheck size={13} />
                      <span>Switch / Relogin as Admin</span>
                    </button>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          sounds.click();
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 flex items-center space-x-2"
                      >
                        <LogOut size={13} />
                        <span>Logout Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Audio toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
              title={soundEnabled ? "Disable UI Audio" : "Enable UI Audio"}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Track Ticket ID..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
          </form>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                sounds.click();
                onOpenAuthModal('citizen');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 p-3 rounded-xl text-left text-sm bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 font-bold"
            >
              <KeyRound size={16} />
              <span>Open Login Portal (Anti-Bot CAPTCHA)</span>
            </button>

            <button
              onClick={() => {
                sounds.click();
                onOpenScamModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 p-3 rounded-xl text-left text-sm bg-amber-950/40 text-amber-300 border border-amber-500/40"
            >
              <ShieldAlert size={16} />
              <span>🛡️ Anti-Scam Shield & Helplines</span>
            </button>

            <button
              onClick={() => handleNav('citizen')}
              className={`flex items-center space-x-3 p-3 rounded-xl text-left text-sm ${
                activeTab === 'citizen' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <User size={16} />
              <span>Citizen Portal & My Grievances</span>
            </button>

            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center space-x-3 p-3 rounded-xl text-left text-sm ${
                activeTab === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <ShieldCheck size={16} />
              <span>Admin & Municipal Operations Portal</span>
            </button>

            <button
              onClick={() => handleNav('map')}
              className={`flex items-center space-x-3 p-3 rounded-xl text-left text-sm ${
                activeTab === 'map' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Radio size={16} />
              <span>Radar Interactive Map</span>
            </button>

            <button
              onClick={() => handleNav('feed')}
              className={`flex items-center space-x-3 p-3 rounded-xl text-left text-sm ${
                activeTab === 'feed' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Layers size={16} />
              <span>Complaints Feed & Upvotes</span>
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className={`flex items-center space-x-3 p-3 rounded-xl text-left text-sm ${
                activeTab === 'dashboard' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <BarChart3 size={16} />
              <span>Ward Transparency Hub</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

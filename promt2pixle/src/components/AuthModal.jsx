import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Building2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  X, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Fingerprint,
  KeyRound,
  Check,
  Zap,
  Globe,
  Server
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';
import { sounds } from '../utils/audio';

// Dynamic Captcha Generator Helper
const generateCaptchaData = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let text = '';
  for (let i = 0; i < 5; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const n1 = Math.floor(Math.random() * 20) + 5;
  const n2 = Math.floor(Math.random() * 15) + 3;
  return {
    code: text,
    mathQuestion: `${n1} + ${n2} = ?`,
    mathAnswer: (n1 + n2).toString()
  };
};

export const AuthModal = ({
  isOpen,
  onClose,
  initialRole = 'citizen', // 'citizen' or 'admin'
  onLoginSuccess
}) => {
  const [role, setRole] = useState(initialRole);
  const [authMode, setAuthMode] = useState('password'); // 'password' or 'biometric'
  
  // Fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [adminDept, setAdminDept] = useState('ROAD');
  const [adminBadgeId, setAdminBadgeId] = useState('GOV-ADM-9942');
  
  // Captcha
  const [captchaType, setCaptchaType] = useState('code'); // 'code' or 'math'
  const [captchaData, setCaptchaData] = useState(() => generateCaptchaData());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const canvasRef = useRef(null);

  // Sync role
  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setCaptchaError('');
      setIsSuccess(false);
      setIsSubmitting(false);
      setCaptchaData(generateCaptchaData());
      setCaptchaInput('');

      if (initialRole === 'admin') {
        setName('Er. Rajesh Verma');
        setIdentifier('rajesh.verma@gov.cityfix.in');
        setAdminBadgeId('GOV-ADM-9942');
      } else {
        setName('Aarav Sharma');
        setIdentifier('+91 98765-43210');
      }
    }
  }, [isOpen, initialRole]);

  // Draw Distorted Captcha Canvas
  useEffect(() => {
    if (canvasRef.current && captchaType === 'code') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Cyber Dark Gradient Background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#030712');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Noise curves
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(6, 182, 212, 0.45)' : 'rgba(168, 85, 247, 0.45)';
        ctx.lineWidth = Math.random() * 1.5 + 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.bezierCurveTo(
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height,
          Math.random() * canvas.width, Math.random() * canvas.height
        );
        ctx.stroke();
      }

      // Sparkle dots
      for (let i = 0; i < 35; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Characters
      const code = captchaData.code;
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      for (let i = 0; i < code.length; i++) {
        ctx.save();
        const x = 16 + i * 22;
        const y = 28 + (Math.random() * 6 - 3);
        const rot = (Math.random() * 0.35 - 0.175);
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#c084fc';
        ctx.shadowColor = 'rgba(6, 182, 212, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fillText(code[i], 0, 0);
        ctx.restore();
      }
    }
  }, [captchaData, captchaType, isOpen]);

  if (!isOpen) return null;

  const handleRefreshCaptcha = () => {
    sounds.click();
    setCaptchaData(generateCaptchaData());
    setCaptchaInput('');
    setCaptchaError('');
  };

  const handleDemoPreset = (type) => {
    sounds.click();
    if (type === 'citizen') {
      setRole('citizen');
      setName('Priya Sundaram');
      setIdentifier('+91 98450-11223');
    } else {
      setRole('admin');
      setName('Capt. Vivek Rathore');
      setIdentifier('v.rathore@civic.gov.in');
      setAdminDept('ROAD');
      setAdminBadgeId('GOV-DIR-7701');
    }
    setCaptchaInput(captchaType === 'code' ? captchaData.code : captchaData.mathAnswer);
    setCaptchaError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaptchaError('');

    if (!name.trim()) {
      sounds.alert();
      setCaptchaError('Please enter your full name.');
      return;
    }

    if (!identifier.trim()) {
      sounds.alert();
      setCaptchaError('Please provide your Mobile number or Official Email.');
      return;
    }

    // Verify Captcha
    const expected = captchaType === 'code' ? captchaData.code.toUpperCase() : captchaData.mathAnswer;
    if (captchaInput.trim().toUpperCase() !== expected) {
      sounds.alert();
      setCaptchaError('CAPTCHA verification mismatch. Please re-enter the code.');
      handleRefreshCaptcha();
      return;
    }

    setIsSubmitting(true);
    sounds.click();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      sounds.success();

      const userData = {
        id: role === 'admin' ? (adminBadgeId || `ADM-9942`) : `CTZ-8842`,
        name: name,
        contact: identifier,
        role: role,
        department: role === 'admin' ? adminDept : null,
        departmentName: role === 'admin' ? DEPARTMENTS[adminDept]?.name : null,
        avatar: role === 'admin' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        karmaScore: role === 'citizen' ? 480 : 1250,
        authSecurityToken: `TLS-ECDSA-${Date.now().toString().slice(-6)}`,
        cloudSessionId: `CF-EDGE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        verifiedAt: new Date().toISOString()
      };

      setTimeout(() => {
        onLoginSuccess(userData);
        onClose();
      }, 900);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-slate-200">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Anti-Scam Security Ribbon */}
        <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-cyan-950/50 border-b border-amber-500/25 px-5 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center space-x-2">
            <ShieldAlert size={15} className="text-amber-400 shrink-0" />
            <span className="font-medium text-[11px]">
              <strong className="text-amber-300">Gov Cyber-Safe Protocol:</strong> All civic reporting is 100% free. Never pay fees or share bank credentials.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            <Lock size={10} />
            <span>AES-256 GCM</span>
          </span>
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-2xl border ${
              role === 'admin' 
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-lg shadow-purple-500/20' 
                : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/20'
            }`}>
              {role === 'admin' ? <Building2 size={24} /> : <User size={24} />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-heading font-extrabold text-white">
                  {role === 'admin' ? 'Municipal Authority Gateway' : 'Citizen Secure Access'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  ENTERPRISE 3.2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authenticated with Dynamic CAPTCHA & Cloud Token Security
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.click();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.click();
                setRole('citizen');
                setName('Aarav Sharma');
                setIdentifier('+91 98765-43210');
              }}
              className={`flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'citizen'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User size={14} />
              <span>Citizen Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.click();
                setRole('admin');
                setName('Er. Rajesh Verma');
                setIdentifier('rajesh.verma@gov.cityfix.in');
                setAdminBadgeId('GOV-ADM-9942');
              }}
              className={`flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Municipal Admin</span>
            </button>
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Sparkles size={11} className="text-cyan-400" />
              <span>Judge Quick Pre-fill:</span>
            </span>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => handleDemoPreset('citizen')}
                className="text-cyan-400 hover:underline hover:text-cyan-300 font-semibold"
              >
                Preset Citizen
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleDemoPreset('admin')}
                className="text-purple-400 hover:underline hover:text-purple-300 font-semibold"
              >
                Preset Official
              </button>
            </div>
          </div>
        </div>

        {/* ================= FORM BODY ================= */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
                <User size={14} className="text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Identifier */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {role === 'admin' ? 'Official Gov Email' : 'Mobile Number / Email'} <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'admin' ? 'officer.name@gov.cityfix.in' : '+91 98765-43210'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                  required
                />
                <KeyRound size={14} className="text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Admin Extra Department & Badge */}
            {role === 'admin' && (
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/25">
                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    Designated Department
                  </label>
                  <select
                    value={adminDept}
                    onChange={(e) => setAdminDept(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-950 border border-purple-500/40 text-xs text-purple-200 focus:outline-none focus:border-purple-400"
                  >
                    {Object.values(DEPARTMENTS).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.shortName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    Gov Service Badge ID
                  </label>
                  <input
                    type="text"
                    value={adminBadgeId}
                    onChange={(e) => setAdminBadgeId(e.target.value)}
                    placeholder="GOV-ADM-9942"
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-950 border border-purple-500/40 text-xs text-purple-200 font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Anti-Bot CAPTCHA Challenge */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                  <ShieldCheck size={14} className="text-cyan-400" />
                  <span>Interactive Anti-Bot CAPTCHA Security</span>
                </label>
                <div className="flex items-center space-x-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.click();
                      setCaptchaType(captchaType === 'code' ? 'math' : 'code');
                      setCaptchaError('');
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    {captchaType === 'code' ? 'Switch to Math' : 'Switch to Visual'}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                {/* Visual Canvas or Math Equation */}
                <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shrink-0">
                  {captchaType === 'code' ? (
                    <canvas 
                      ref={canvasRef} 
                      width="135" 
                      height="40" 
                      className="block bg-slate-950 cursor-pointer"
                      title="Click reload if characters are hard to read"
                    />
                  ) : (
                    <div className="w-[135px] h-[40px] flex items-center justify-center bg-slate-900 text-cyan-300 font-mono font-bold text-sm tracking-wider select-none border border-cyan-500/30">
                      {captchaData.mathQuestion}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Reload new CAPTCHA"
                >
                  <RefreshCw size={15} />
                </button>

                {/* Input box */}
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter code..."
                  maxLength={6}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-center font-mono uppercase tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>

              {captchaError && (
                <div className="flex items-center space-x-1.5 text-rose-400 text-xs mt-2 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>{captchaError}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40'
                  : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-500/40'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Authenticating & Syncing Cloud Session...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Authenticate & Launch {role === 'admin' ? 'Admin Portal' : 'Citizen Portal'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

          </form>
        ) : (
          /* Success Animation */
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 flex items-center justify-center mx-auto animate-bounce">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-white">Identity Authenticated</h3>
            <p className="text-xs text-slate-300">
              Welcome back, <strong className="text-cyan-300">{name}</strong>. Cloud session established.
            </p>
          </div>
        )}

        {/* Modal Footer Security Telemetry */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400">
            <Server size={12} className="text-cyan-400" />
            <span>Cloud Database: AWS ap-south-1 • 24ms</span>
          </div>
          <span className="font-mono text-emerald-400">ZERO TRUST VERIFIED</span>
        </div>

      </div>
    </div>
  );
};

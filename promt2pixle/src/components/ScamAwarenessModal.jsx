import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  Lock, 
  Smartphone, 
  QrCode, 
  CreditCard, 
  PhoneCall, 
  ExternalLink, 
  Sparkles,
  Award
} from 'lucide-react';
import { sounds } from '../utils/audio';

const SCAM_TACTICS = [
  {
    icon: CreditCard,
    title: "Fake Processing Fees / UPI Demands",
    scam: "Fraudsters claim you must transfer ₹50-₹200 'inspection fee' or scan a QR code to prioritize road/water repairs.",
    defense: "CityFix and municipal services are 100% FREE. The government will NEVER ask for money or UPI payments to fix civic grievances."
  },
  {
    icon: QrCode,
    title: "Tampered / Fake QR Stickers on Street Assets",
    scam: "Scammers paste fraudulent stickers over official municipal barcodes on transformers or streetlights to hijack payments.",
    defense: "Official CityFix QR codes only open the verified civic domain and NEVER trigger UPI payment gateways or demand PINs."
  },
  {
    icon: Smartphone,
    title: "Phishing for Bank PINs or Passwords",
    scam: "Callers pretending to be 'Municipal Engineers' demanding personal bank details or UPI passwords under the pretext of job verification.",
    defense: "Official field engineers use their own GPS-validated app. They will NEVER ask citizens for banking details or confidential credentials."
  },
  {
    icon: PhoneCall,
    title: "Fake Municipal Threat Calls",
    scam: "Automated calls alleging illegal construction fines or sudden disconnection threats unless immediate settlement is made.",
    defense: "All official civic notices carry digital cryptographic signatures and appear directly inside your verified Citizen Portal."
  }
];

const QUIZ_QUESTIONS = [
  {
    q: "A person claiming to be a Municipal Road Inspector calls and asks you to pay a ₹100 fee via Google Pay to dispatch the asphalt crew. What should you do?",
    options: [
      { text: "Pay immediately to get the road fixed fast", correct: false },
      { text: "Refuse payment and report the number immediately to Cyber Crime Helpline (1930)", correct: true },
      { text: "Ask for a 50% discount instead", correct: false }
    ],
    explanation: "Correct! Civic maintenance is fully funded by the municipal government. Demanding fees is a criminal scam."
  },
  {
    q: "You scan a QR code on a broken streetlight and it asks you to enter your UPI PIN. Is this safe?",
    options: [
      { text: "Yes, UPI PIN is needed to verify identity", correct: false },
      { text: "NO! Entering a UPI PIN will DEDUCT money from your account. It is a scam.", correct: true },
      { text: "Safe only if under ₹50", correct: false }
    ],
    explanation: "Correct! UPI PIN is ONLY entered when paying money out. Reporting civic issues is always completely free."
  }
];

export const ScamAwarenessModal = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('shield'); // 'shield', 'quiz', 'helpline'
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!isOpen) return null;

  const handleAnswer = (optionIdx) => {
    setSelectedOption(optionIdx);
    const isCorrect = QUIZ_QUESTIONS[currentQuizIdx].options[optionIdx].correct;
    if (isCorrect) {
      sounds.success();
      setQuizScore((prev) => prev + 1);
    } else {
      sounds.alert();
    }
  };

  const handleNextQuiz = () => {
    sounds.click();
    if (currentQuizIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    sounds.click();
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-purple-500/20 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40 shadow-inner">
              <ShieldAlert size={28} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-heading font-extrabold text-white">Civic Anti-Scam Shield</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ZERO-FEE GUARANTEE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Defending citizens against civic imposters, fake fee demands, and phishing fraud.
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
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 overflow-x-auto">
          <button
            onClick={() => {
              sounds.click();
              setActiveTab('shield');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
              activeTab === 'shield'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Top Scam Tactics & Defenses</span>
          </button>
          <button
            onClick={() => {
              sounds.click();
              setActiveTab('quiz');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
              activeTab === 'quiz'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle size={14} />
            <span>Spot-the-Scam Interactive Quiz</span>
          </button>
          <button
            onClick={() => {
              sounds.click();
              setActiveTab('helpline');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center space-x-2 ${
              activeTab === 'helpline'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall size={14} />
            <span>Emergency Cyber Helplines (1930)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: TACTICS & DEFENSE */}
          {activeTab === 'shield' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300">
                <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
                <span>
                  <strong>Golden Rule:</strong> CityFix, Municipal Ward Offices, and Government Crews will <strong>NEVER</strong> demand money, fees, or bank passwords.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {SCAM_TACTICS.map((tactic, idx) => {
                  const Icon = tactic.icon;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                        <Icon size={16} />
                        <span>{tactic.title}</span>
                      </div>
                      <div className="text-[11px] text-rose-300/90 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 leading-relaxed">
                        <strong className="text-rose-400">The Scam:</strong> {tactic.scam}
                      </div>
                      <div className="text-[11px] text-emerald-300/90 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 leading-relaxed">
                        <strong className="text-emerald-400">Safe Defense:</strong> {tactic.defense}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-5">
              {!quizCompleted ? (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">Question {currentQuizIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span>Current Score: <strong className="text-white">{quizScore} pts</strong></span>
                  </div>

                  <h3 className="text-sm font-semibold text-white leading-relaxed">
                    {QUIZ_QUESTIONS[currentQuizIdx].q}
                  </h3>

                  <div className="space-y-2">
                    {QUIZ_QUESTIONS[currentQuizIdx].options.map((opt, oIdx) => {
                      const isChosen = selectedOption === oIdx;
                      let btnStyle = "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500/50";
                      
                      if (selectedOption !== null) {
                        if (opt.correct) {
                          btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold";
                        } else if (isChosen && !opt.correct) {
                          btnStyle = "border-rose-500 bg-rose-500/20 text-rose-300";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={selectedOption !== null}
                          onClick={() => handleAnswer(oIdx)}
                          className={`w-full p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {selectedOption !== null && opt.correct && (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedOption !== null && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 animate-fadeIn">
                      <p>{QUIZ_QUESTIONS[currentQuizIdx].explanation}</p>
                      <button
                        onClick={handleNextQuiz}
                        className="mt-3 px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
                      >
                        {currentQuizIdx + 1 < QUIZ_QUESTIONS.length ? "Next Challenge →" : "See Final Score"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-cyan-500/30 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto">
                    <Award size={30} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Quiz Mastered!</h3>
                  <p className="text-xs text-slate-300">
                    You scored <strong className="text-cyan-400 text-sm">{quizScore} / {QUIZ_QUESTIONS.length}</strong> on Scam Awareness. You have earned the <span className="text-amber-300 font-bold">Cyber Shield Badge</span> for your citizen profile.
                  </p>
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-white transition-all"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HELPLINES & REPORTING */}
          {activeTab === 'helpline' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <PhoneCall size={18} />
                  <span>National Cyber Crime Reporting Helpline</span>
                </div>
                <p className="text-xs text-slate-300">
                  If you suspect any cyber fraud or extortion attempt related to municipal work, dial immediately:
                </p>
                <div className="flex items-center space-x-3 pt-1">
                  <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 font-mono font-bold text-base border border-rose-500/40">
                    📞 1930
                  </span>
                  <a
                    href="https://cybercrime.gov.in" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Visit cybercrime.gov.in</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white">CityFix Integrity Vigilance Cell</h4>
                <p className="text-xs text-slate-400">
                  To report an imposter demanding bribes or suspicious field workers:
                </p>
                <div className="font-mono text-xs text-slate-300 space-y-1">
                  <p>📧 Email: <span className="text-cyan-400">vigilance@cityfix.gov.in</span></p>
                  <p>🛡️ Anti-Corruption Toll Free: <span className="text-cyan-400">1800-11-2244</span></p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock size={13} className="text-emerald-400" />
            <span>Digital India & Cyber Swachhta Kendra Standard</span>
          </div>
          <button
            onClick={() => {
              sounds.click();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all"
          >
            I Understand & Stay Safe
          </button>
        </div>

      </div>
    </div>
  );
};

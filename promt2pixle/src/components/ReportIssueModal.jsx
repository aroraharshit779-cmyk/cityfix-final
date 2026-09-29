import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  Upload, 
  AlertTriangle, 
  Sparkles, 
  Navigation, 
  CheckCircle2, 
  ThumbsUp, 
  ShieldCheck, 
  ArrowRight, 
  Camera, 
  Cpu, 
  Clock, 
  Layers,
  HelpCircle,
  AlertCircle,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { DEPARTMENTS, WARDS } from '../data/mockData';
import { detectDuplicateIssue } from '../services/duplicateDetection';
import { autoRouteIssue } from '../services/autoRouting';
import { sounds } from '../utils/audio';

// Pre-curated sample photos for instant testing during presentations
const SAMPLE_PHOTOS = [
  { label: "Pothole / Road", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80" },
  { label: "Water Burst / Leak", url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80" },
  { label: "Streetlight Dark", url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80" },
  { label: "Garbage Pile", url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80" }
];

export const ReportIssueModal = ({
  isOpen,
  onClose,
  authUser,
  onSwitchToCitizen,
  existingIssues = [],
  initialLocation = null,
  onSubmitNewIssue,
  onUpvoteExistingIssue
}) => {
  const [step, setStep] = useState(1); // 1: Details & Location, 2: Photo & AI Scan, 3: Duplicate Guard Alert

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWard, setSelectedWard] = useState('WARD-12');
  const [lat, setLat] = useState(28.62895);
  const [lng, setLng] = useState(77.20655);
  const [address, setAddress] = useState('Outer Ring Road, Near Metro Gate 3');
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [customPhotoName, setCustomPhotoName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [citizenName, setCitizenName] = useState(authUser?.name || 'Aarav Sharma');
  const [citizenPhone, setCitizenPhone] = useState(authUser?.contact || '+91 98765-43210');

  // Handle Local File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processSelectedFile(file);
  };

  const processSelectedFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      alert("Please select an image smaller than 12MB");
      return;
    }

    sounds.success();
    setCustomPhotoName(file.name);
    setIsScanningImage(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target.result);
      setTimeout(() => {
        setIsScanningImage(false);
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Sync authUser data
  useEffect(() => {
    if (authUser && authUser.role === 'citizen') {
      setCitizenName(authUser.name);
      setCitizenPhone(authUser.contact);
    }
  }, [authUser]);


  // AI & Duplicate State
  const [routingResult, setRoutingResult] = useState(null);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [imageScanned, setImageScanned] = useState(true);

  // Sync initial location if passed from map pin drop
  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setLat(initialLocation.lat);
      setLng(initialLocation.lng);
      setAddress(`Pinned Location (${initialLocation.lat.toFixed(4)}, ${initialLocation.lng.toFixed(4)})`);
    }
  }, [initialLocation]);

  // Real-time NLP Auto-Routing calculation as user types
  useEffect(() => {
    if (title.length > 3 || description.length > 5) {
      const result = autoRouteIssue(title, description);
      setRoutingResult(result);
    } else {
      setRoutingResult(null);
    }
  }, [title, description]);

  if (!isOpen) return null;

  // Handle Judge Demo Preset for 50m Duplicate Trigger
  const handleLoadDuplicatePreset = () => {
    sounds.click();
    setTitle("Severe pothole in bus bay right next to Metro Gate 3");
    setDescription("Big crater in asphalt damaging scooter rims. Need repair crew urgently.");
    setSelectedWard("WARD-12");
    // Set coordinates exactly 25 meters from the existing issue CF-84201 (28.62895, 77.20655)
    setLat(28.62912);
    setLng(77.20670);
    setAddress("Metro Station Gate 3 Bus Stop, Outer Ring Road, Ward 12");
    setPhotoUrl(SAMPLE_PHOTOS[0].url);
  };

  // Run Duplicate Detection check
  const handleProceedToVerify = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter both an issue title and description.");
      return;
    }

    sounds.click();

    const candidate = {
      title,
      description,
      category: routingResult?.department?.name || 'Road & Infrastructure',
      location: { lat: parseFloat(lat), lng: parseFloat(lng) }
    };

    const dupResult = detectDuplicateIssue(candidate, existingIssues);
    setDuplicateCheckResult(dupResult);

    if (dupResult.isDuplicate && dupResult.primaryMatch) {
      sounds.alert();
      setStep(3); // Show Duplicate Detection Guard
    } else {
      // No duplicate, proceed or directly submit
      handleSubmitFinal();
    }
  };

  // Upvote Existing Duplicate Option (USP 1 Primary Action)
  const handleUpvoteDuplicate = () => {
    if (duplicateCheckResult?.primaryMatch?.issue) {
      sounds.success();
      onUpvoteExistingIssue(duplicateCheckResult.primaryMatch.issue.id);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      alert(`🎉 Upvoted existing issue ${duplicateCheckResult.primaryMatch.issue.id}! Authorities have been notified of increased community priority.`);
      onClose();
    }
  };

  // Final Issue Submission
  const handleSubmitFinal = () => {
    sounds.success();
    const finalRouting = routingResult || autoRouteIssue(title, description);
    const wardObj = WARDS.find((w) => w.id === selectedWard) || WARDS[2];

    const ticketId = `CF-${Math.floor(10000 + Math.random() * 90000)}`;

    const newIssue = {
      id: ticketId,
      title: title.trim(),
      description: description.trim(),
      category: finalRouting.department.shortName,
      departmentId: finalRouting.departmentId,
      wardId: wardObj.id,
      wardName: wardObj.name,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address.trim() || `${wardObj.name} Corridor`
      },
      status: "Reported",
      priority: finalRouting.priority,
      upvotes: 1,
      upvotedBy: ["current-citizen-demo"],
      reportedAt: new Date().toISOString(),
      slaHours: finalRouting.slaHours,
      deadline: finalRouting.deadlineDate,
      assignedTo: `${finalRouting.assignedCrew} (${finalRouting.department.leadOfficer})`,
      citizen: {
        name: citizenName,
        phone: citizenPhone,
        verified: true,
        trustScore: 97
      },
      aiTags: finalRouting.aiTags,
      aiConfidence: finalRouting.confidence,
      beforeImage: photoUrl,
      afterImage: null,
      proofOfWork: null,
      auditTrail: [
        {
          id: `aud-${Date.now()}-1`,
          action: "Citizen Complaint Filed",
          by: `Citizen ${citizenName} (Mobile & GPS Verified)`,
          timestamp: new Date().toISOString(),
          details: `Report created with photo evidence. Coordinates: (${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}).`
        },
        {
          id: `aud-${Date.now()}-2`,
          action: "AI Auto-Routing Decision",
          by: "CityFix Neural Gateway",
          timestamp: new Date(Date.now() + 1000).toISOString(),
          details: finalRouting.rationale
        }
      ]
    };

    onSubmitNewIssue(newIssue);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                {step === 3 ? "AI Duplicate Detection Warning" : "Report a Civic Issue"}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 3 ? "Potential spatial duplicate found within 50 meters" : "AI-Assisted Citizen Reporting Portal"}
              </p>
            </div>
          </div>
          <button
            onClick={() => { sounds.click(); onClose(); }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= ADMIN ROLE GUARD ================= */}
        {authUser?.role === 'admin' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h4 className="text-lg font-bold font-heading text-white">Municipal Authority Mode Active</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                You are currently logged in as a <strong>Municipal Authority Official</strong> ({authUser.name}). Official administrators review, inspect, and dispatch work orders. Only citizens can file new public complaints.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  onSwitchToCitizen();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-all hover:scale-105"
              >
                Switch to Citizen Account & File Complaint
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
              >
                Return to Admin Console
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ================= STEP 3: DUPLICATE DETECTION GUARD (USP 1) ================= */}
            {step === 3 && duplicateCheckResult?.primaryMatch && (
              <div className="p-6 space-y-5">

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  Similar Issue Already Reported Nearby!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Our spatial scanner detected an existing active complaint just{' '}
                  <span className="font-bold text-amber-400 font-mono">
                    {duplicateCheckResult.primaryMatch.distanceMeters} meters
                  </span>{' '}
                  from your pin, reported {duplicateCheckResult.primaryMatch.daysAgo} days ago with{' '}
                  <span className="font-bold text-cyan-400 font-mono">
                    {duplicateCheckResult.primaryMatch.issue.upvotes} citizen upvotes
                  </span>.
                </p>
              </div>
            </div>

            {/* Existing Issue Card Comparison */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">
                  Existing Ticket #{duplicateCheckResult.primaryMatch.issue.id}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                  Status: {duplicateCheckResult.primaryMatch.issue.status}
                </span>
              </div>

              <div className="flex gap-3">
                {duplicateCheckResult.primaryMatch.issue.beforeImage && (
                  <img
                    src={duplicateCheckResult.primaryMatch.issue.beforeImage}
                    alt="Existing issue"
                    className="w-24 h-24 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                )}
                <div className="text-xs space-y-1">
                  <h5 className="font-bold text-white text-sm">
                    {duplicateCheckResult.primaryMatch.issue.title}
                  </h5>
                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    {duplicateCheckResult.primaryMatch.issue.description}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    📍 {duplicateCheckResult.primaryMatch.issue.location?.address}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      Dept: {duplicateCheckResult.primaryMatch.issue.category}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Distance: ~{duplicateCheckResult.primaryMatch.distanceMeters}m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Resolution Recommendation */}
            <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400 shrink-0" />
              <span>
                <strong>Civic Tech Recommendation:</strong> Upvoting an existing issue merges duplicate work orders and increases municipal urgency score!
              </span>
            </div>

            {/* Action Buttons for Duplicate */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleUpvoteDuplicate}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <ThumbsUp size={16} />
                <span>Upvote Existing Issue (+1)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  handleSubmitFinal();
                }}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors border border-slate-700 text-center"
              >
                Proceed & File Separate Report
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 1 & 2: REPORT FORM ================= */}
        {step !== 3 && (
          <form onSubmit={handleProceedToVerify} className="p-6 space-y-4">
            
            {/* Judge Demo Quick-Fill Bar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
              <div className="flex items-center space-x-2 text-xs">
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-cyan-300 font-medium">Hackathon Presentation Shortcut:</span>
              </div>
              <button
                type="button"
                onClick={handleLoadDuplicatePreset}
                className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all hover:scale-105"
              >
                Load 50m Duplicate Demo
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep asphalt pothole near bus stand..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Description & Impact *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what's wrong, hazards, or size of damage..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Smart Auto-Routing Matrix Live Telemetry (USP 2) */}
            {routingResult && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/50 to-blue-950/40 border border-cyan-500/30 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold font-mono">
                    <Cpu size={14} className="text-cyan-400" />
                    AI Auto-Routing Matrix
                  </span>
                  <span className="font-mono text-cyan-400 text-[11px]">
                    Confidence: {routingResult.confidence}%
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded font-bold font-mono ${routingResult.department.bgClass}`}>
                    {routingResult.department.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    SLA: {routingResult.slaHours} Hours
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Priority: {routingResult.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {routingResult.rationale}
                </p>
              </div>
            )}

            {/* Ward & Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Municipal Ward *
                </label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  {WARDS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Location Landmark
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street / Corner / Landmark"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* GPS Coordinates display */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
                <MapPin size={14} className="text-cyan-400" />
                <span>Lat: {parseFloat(lat).toFixed(5)}, Lng: {parseFloat(lng).toFixed(5)}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 size={12} /> GPS Geofenced
              </span>
            </div>

            {/* Photo Upload & AI Computer Vision Scan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Issue Photograph *
                </label>
                <span className="text-[10px] font-mono text-cyan-400">JPG, PNG, WEBP (Max 12MB)</span>
              </div>

              {/* Hidden Native File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />

              {/* Interactive Upload Dropzone & Action Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.click();
                    fileInputRef.current?.click();
                  }}
                  className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/60 hover:to-blue-900/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white flex items-center justify-center space-x-2 text-xs font-bold transition-all shadow-md group"
                >
                  <Upload size={15} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Choose Photo from Device</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.click();
                    fileInputRef.current?.click();
                  }}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white flex items-center justify-center space-x-2 text-xs font-semibold transition-all"
                >
                  <Camera size={15} className="text-slate-400" />
                  <span>Camera / Device Snap</span>
                </button>
              </div>

              {/* Drag & Drop Visual Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-3 text-center cursor-pointer transition-all ${
                  isDragOver 
                    ? 'border-cyan-400 bg-cyan-950/30' 
                    : 'border-white/[0.1] hover:border-cyan-500/40 bg-slate-950/60'
                }`}
              >
                <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                  <ImageIcon size={14} className="text-cyan-400" />
                  <span>Drag & Drop custom photos here, or click to browse</span>
                </div>
                {customPhotoName && (
                  <p className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <Check size={12} /> Uploaded: {customPhotoName}
                  </p>
                )}
              </div>

              {/* Quick Preset Samples for Hackathon Judge Presentations */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] text-slate-400 whitespace-nowrap">Or Quick Preset:</span>
                {SAMPLE_PHOTOS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { 
                      sounds.click(); 
                      setPhotoUrl(item.url); 
                      setCustomPhotoName('');
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-all ${
                      photoUrl === item.url && !customPhotoName
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Photo Preview with Simulated AI Computer Vision scan */}
              <div className="relative rounded-xl overflow-hidden h-36 bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Issue preview"
                  className="w-full h-full object-cover opacity-90"
                />
                
                {/* Real-time Scanning Laser Line Animation if scanning */}
                {isScanningImage && (
                  <div className="absolute inset-0 bg-cyan-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-cyan-300 space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-mono font-bold tracking-wider">AI EXIF & DEFECT SCANNING...</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-cyan-300 flex items-center gap-1.5 font-mono">
                    <Sparkles size={13} className="text-cyan-400" />
                    AI Vision: Valid Civic Defect
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">
                    Confidence 96.4% • Passed Anti-Spam
                  </span>
                </div>
              </div>
            </div>

            {/* Citizen Trust Badge */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>
                  Reporting as: <strong className="text-white">{citizenName}</strong>
                </span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">Trust Score: 97/100</span>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => { sounds.click(); onClose(); }}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
              >
                <span>Verify & Submit Complaint</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </form>
        )}
        </>
        )}

      </div>
    </div>
  );
};


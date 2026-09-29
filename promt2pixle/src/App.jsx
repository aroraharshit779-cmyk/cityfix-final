import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { JudgeToolbar } from './components/JudgeToolbar';
import { InteractiveMap } from './components/InteractiveMap';
import { ComplaintsFeed } from './components/ComplaintsFeed';
import { CitizenPortal } from './components/CitizenPortal';
import { AdminPortal } from './components/AdminPortal';
import { TransparencyDashboard } from './components/TransparencyDashboard';
import { ReportIssueModal } from './components/ReportIssueModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { TicketTrackerModal } from './components/TicketTrackerModal';
import { AuthModal } from './components/AuthModal';
import { ScamAwarenessModal } from './components/ScamAwarenessModal';
import { INITIAL_ISSUES } from './data/mockData';
import { cloudStorage } from './services/cloudStorage';
import { sounds } from './utils/audio';
import cityFixLogo from './assets/cityfix-logo.png';

const AUTH_KEY = 'cityfix_auth_user_v2';

export default function App() {
  // Load issues from cloudStorage or fallback
  const [issues, setIssues] = useState(() => {
    return cloudStorage.loadIssues(INITIAL_ISSUES);
  });

  // User Auth State
  const [authUser, setAuthUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn("Error parsing localStorage auth:", e);
    }
    // Default logged-in citizen for judge demo
    return {
      id: "CTZ-8842",
      name: "Aarav Sharma",
      contact: "+91 98765-43210",
      role: "citizen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      karmaScore: 480,
      authSecurityToken: "TLS-ECDSA-889142",
      cloudSessionId: "CF-EDGE-MUM-01",
      verifiedAt: new Date().toISOString()
    };
  });

  const [activeTab, setActiveTab] = useState('citizen'); // 'map', 'feed', 'citizen', 'admin', 'dashboard'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportLocation, setReportLocation] = useState(null);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackSearchQuery, setTrackSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('citizen');
  const [scamModalOpen, setScamModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync issues to cloud database

  useEffect(() => {
    cloudStorage.saveIssues(issues);
  }, [issues]);

  // Sync authUser to localStorage
  useEffect(() => {
    try {
      if (authUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error("Failed to save auth to localStorage:", e);
    }
  }, [authUser]);

  // Handle Login Success
  const handleLoginSuccess = (userData) => {
    setAuthUser(userData);
    if (userData.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('citizen');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem(AUTH_KEY);
    setActiveTab('map');
  };

  // Open Auth Modal for specific role
  const handleOpenAuth = (role = 'citizen') => {
    sounds.click();
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  // Handle New Issue Submission
  const handleCreateIssue = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setSelectedIssue(newIssue);
  };

  // Handle Upvote
  const handleUpvoteIssue = (issueId) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const currentUpvotes = issue.upvotes || 0;
          return {
            ...issue,
            upvotes: currentUpvotes + 1,
            auditTrail: [
              ...(issue.auditTrail || []),
              {
                id: `aud-${Date.now()}`,
                action: "Citizen Upvote Registered (+1)",
                by: authUser?.name ? `${authUser.name} (Citizen)` : "Citizen Community Supporter",
                timestamp: new Date().toISOString(),
                details: "Urgency elevated by local ward resident."
              }
            ]
          };
        }
        return issue;
      })
    );
  };

  // Handle Status Update (Dispatch, Close, Reopen)
  const handleUpdateIssueStatus = (issueId, newStatus, details = '') => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const updated = {
            ...issue,
            status: newStatus,
            auditTrail: [
              ...(issue.auditTrail || []),
              {
                id: `aud-${Date.now()}`,
                action: `Status Transition: "${newStatus}"`,
                by: authUser?.name ? `${authUser.name} (Admin Operations)` : "Municipal Operations Center",
                timestamp: new Date().toISOString(),
                details: details || `Workflow transitioned to ${newStatus}.`
              }
            ]
          };
          if (selectedIssue && selectedIssue.id === issueId) {
            setSelectedIssue(updated);
          }
          return updated;
        }
        return issue;
      })
    );
  };

  // Handle Proof-of-Work Submission (USP 3 closure loop)
  const handleSubmitProofOfWork = (issueId, afterImage, proofData) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const updated = {
            ...issue,
            status: 'Resolved (Pending Verification)',
            afterImage,
            proofOfWork: proofData,
            auditTrail: [
              ...(issue.auditTrail || []),
              {
                id: `aud-${Date.now()}`,
                action: "Proof-of-Work Submitted (Geo-Tagged EXIF Validated)",
                by: `${proofData.workerName} (${proofData.workerId})`,
                timestamp: new Date().toISOString(),
                details: `Uploaded after resolution photo with ${proofData.geoTagMatch}% GPS geofence match. Notes: ${proofData.notes}`
              }
            ]
          };
          if (selectedIssue && selectedIssue.id === issueId) {
            setSelectedIssue(updated);
          }
          return updated;
        }
        return issue;
      })
    );
  };

  // Reset Mock Data
  const handleResetData = () => {
    cloudStorage.resetCloudDatabase(INITIAL_ISSUES);
    setIssues(INITIAL_ISSUES);
    setSelectedIssue(null);
    sounds.success();
  };

  // Open Report Modal with specific location from map pin
  const handleOpenReportWithLocation = (loc) => {
    setReportLocation(loc);
    setReportModalOpen(true);
  };

  // Trigger Demo Duplicate for Judges
  const handleTriggerDemoDuplicate = () => {
    sounds.alert();
    setReportLocation({ lat: 28.62912, lng: 77.20670 });
    setReportModalOpen(true);
  };

  // Open Ticket Tracker
  const handleOpenTrackModal = (query) => {
    sounds.click();
    setTrackSearchQuery(query);
    setTrackModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Top Floating Judge Presentation Toolbar */}
      <JudgeToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerDemoDuplicate={handleTriggerDemoDuplicate}
        onOpenScamModal={() => setScamModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        issuesCount={issues.length}
      />

      {/* Primary Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authUser={authUser}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        onOpenScamModal={() => setScamModalOpen(true)}
        onOpenReportModal={() => {
          setReportLocation(null);
          setReportModalOpen(true);
        }}
        onOpenTrackModal={handleOpenTrackModal}
        onResetData={handleResetData}
        onTriggerDemoDuplicate={handleTriggerDemoDuplicate}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}

        issuesCount={issues.length}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Radar Map View */}
        {activeTab === 'map' && (
          <InteractiveMap
            issues={issues}
            selectedIssue={selectedIssue}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onOpenReportModalWithLocation={handleOpenReportWithLocation}
            onUpvoteIssue={handleUpvoteIssue}
          />
        )}

        {/* Complaints Feed View */}
        {activeTab === 'feed' && (
          <ComplaintsFeed
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onUpvoteIssue={handleUpvoteIssue}
            onOpenReportModal={() => {
              setReportLocation(null);
              setReportModalOpen(true);
            }}
          />
        )}

        {/* Citizen Dedicated Portal */}
        {activeTab === 'citizen' && (
          <CitizenPortal
            user={authUser}
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onOpenReportModal={() => {
              setReportLocation(null);
              setReportModalOpen(true);
            }}
            onOpenTrackModal={handleOpenTrackModal}
            onOpenScamModal={() => setScamModalOpen(true)}
            onUpvoteIssue={handleUpvoteIssue}
          />
        )}

        {/* Admin & Municipal Authority Portal */}
        {activeTab === 'admin' && (
          <AdminPortal
            user={authUser}
            issues={issues}
            onUpdateIssueStatus={handleUpdateIssueStatus}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onSubmitProofOfWork={handleSubmitProofOfWork}
            onOpenAdminAuth={() => handleOpenAuth('admin')}
            onSwitchToCitizen={() => {
              sounds.click();
              setAuthUser({
                id: "CTZ-8842",
                name: "Aarav Sharma",
                contact: "+91 98765-43210",
                role: "citizen",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                karmaScore: 480,
                authSecurityToken: "TLS-ECDSA-889142",
                verifiedAt: new Date().toISOString()
              });
              setActiveTab('citizen');
            }}
          />
        )}

        {/* Transparency Analytics Hub */}
        {activeTab === 'dashboard' && (
          <TransparencyDashboard
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
          />
        )}


      </main>

      {/* Executive Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <img src={cityFixLogo} alt="Logo" className="w-5 h-4 object-contain" />
            <span className="font-heading font-extrabold text-slate-200">CityFix</span>
            <span className="text-slate-400">• Enterprise Civic Governance & AI Resolution Platform</span>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px] text-slate-400">
            <span className="text-emerald-400">● Cloud Synced (AWS ap-south-1)</span>
            <span>•</span>
            <span>Anti-Bot CAPTCHA Verified</span>
            <span>•</span>
            <span>Proof-of-Work Loop</span>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* Auth Modal with CAPTCHA & Cloud Token Security */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Scam Awareness & Cyber Helpline Modal */}
      <ScamAwarenessModal
        isOpen={scamModalOpen}
        onClose={() => setScamModalOpen(false)}
      />


      {/* Report Issue Modal with AI Duplicate Detection Guard */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        authUser={authUser}
        onSwitchToCitizen={() => {
          setAuthUser({
            id: "CTZ-8842",
            name: "Aarav Sharma",
            contact: "+91 98765-43210",
            role: "citizen",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            karmaScore: 480,
            authSecurityToken: "TLS-ECDSA-889142",
            verifiedAt: new Date().toISOString()
          });
          sounds.success();
        }}
        existingIssues={issues}
        initialLocation={reportLocation}
        onSubmitNewIssue={handleCreateIssue}
        onUpvoteExistingIssue={handleUpvoteIssue}
      />

      {/* Full Issue Detail & Audit Trail Inspector Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        authUser={authUser}
        onClose={() => setSelectedIssue(null)}
        onUpvoteIssue={handleUpvoteIssue}
        onUpdateIssueStatus={handleUpdateIssueStatus}
      />


      {/* Ticket Tracker Modal */}
      <TicketTrackerModal
        searchQuery={trackSearchQuery}
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        issues={issues}
        onSelectIssue={(issue) => setSelectedIssue(issue)}
      />

    </div>
  );
}

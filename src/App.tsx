/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CorperProfile,
  Organization,
  PpaReview,
  BehavioralRecord,
  StateCommittee,
  ActivityLog,
  AdminMessage,
  SocialHandles,
  SubAdminUser,
  ModeratorUser,
  AppFault,
  PlacementRequest
} from './types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_CORPERS,
  INITIAL_REVIEWS,
  INITIAL_BEHAVIORAL_RECORDS,
  INITIAL_STATE_COMMITTEES,
  INITIAL_ACTIVITIES,
  INITIAL_ADMIN_MESSAGES,
  INITIAL_SOCIAL_HANDLES,
  INITIAL_SUB_ADMINS,
  INITIAL_MODERATORS,
  INITIAL_APP_FAULTS,
  INITIAL_PLACEMENT_REQUESTS
} from './data/mockData';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CorperDashboard } from './components/CorperDashboard';
import { OrganizationDashboard } from './components/OrganizationDashboard';
import { CommitteeDashboard } from './components/CommitteeDashboard';
import { PpaDirectory } from './components/PpaDirectory';
import { AboutAuthor } from './components/AboutAuthor';
import { OrgDetailModal } from './components/OrgDetailModal';
import { ContactPage } from './components/ContactPage';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

export default function App() {
  // Stylized loader state - runs first as requested
  const [showLoader, setShowLoader] = useState(true);

  // Active view tab
  const [activeTab, setActiveTab] = useState<
    'directory' | 'corper' | 'organization' | 'committee' | 'author' | 'contact' | 'admin'
  >('directory');

  // Currently inspected/selected Nigerian State (across 36 states + FCT)
  const [selectedState, setSelectedState] = useState('Lagos');

  // Modal for viewing full organization detail
  const [modalOrg, setModalOrg] = useState<Organization | null>(null);

  // Persistent state initialized from LocalStorage or defaults
  const [corpers, setCorpers] = useState<CorperProfile[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_all_corpers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CORPERS;
  });

  const [corper, setCorper] = useState<CorperProfile>(() => {
    try {
      const saved = localStorage.getItem('nysc_corper_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CORPERS[0];
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_organizations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORGANIZATIONS;
  });

  const [reviews, setReviews] = useState<PpaReview[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  const [behavioralRecords, setBehavioralRecords] = useState<BehavioralRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_behavioral_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BEHAVIORAL_RECORDS;
  });

  const [stateCommittees, setStateCommittees] = useState<StateCommittee[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_state_committees');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STATE_COMMITTEES;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_activities');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACTIVITIES;
  });

  const [messages, setMessages] = useState<AdminMessage[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_admin_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMIN_MESSAGES;
  });

  const [socialHandles, setSocialHandles] = useState<SocialHandles>(() => {
    try {
      const saved = localStorage.getItem('nysc_social_handles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SOCIAL_HANDLES;
  });

  const [subAdmins, setSubAdmins] = useState<SubAdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_sub_admins');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUB_ADMINS;
  });

  const [moderators, setModerators] = useState<ModeratorUser[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_moderators');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MODERATORS;
  });

  const [faults, setFaults] = useState<AppFault[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_app_faults');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APP_FAULTS;
  });

  const [placementRequests, setPlacementRequests] = useState<PlacementRequest[]>(() => {
    try {
      const saved = localStorage.getItem('nysc_placement_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLACEMENT_REQUESTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nysc_all_corpers', JSON.stringify(corpers));
  }, [corpers]);

  useEffect(() => {
    localStorage.setItem('nysc_corper_profile', JSON.stringify(corper));
    // Keep active corper updated in corpers list
    setCorpers(prev => prev.map(c => (c.id === corper.id ? corper : c)));
  }, [corper]);

  useEffect(() => {
    localStorage.setItem('nysc_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('nysc_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('nysc_behavioral_records', JSON.stringify(behavioralRecords));
  }, [behavioralRecords]);

  useEffect(() => {
    localStorage.setItem('nysc_state_committees', JSON.stringify(stateCommittees));
  }, [stateCommittees]);

  useEffect(() => {
    localStorage.setItem('nysc_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('nysc_admin_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('nysc_social_handles', JSON.stringify(socialHandles));
  }, [socialHandles]);

  useEffect(() => {
    localStorage.setItem('nysc_sub_admins', JSON.stringify(subAdmins));
  }, [subAdmins]);

  useEffect(() => {
    localStorage.setItem('nysc_moderators', JSON.stringify(moderators));
  }, [moderators]);

  useEffect(() => {
    localStorage.setItem('nysc_app_faults', JSON.stringify(faults));
  }, [faults]);

  useEffect(() => {
    localStorage.setItem('nysc_placement_requests', JSON.stringify(placementRequests));
  }, [placementRequests]);

  const handleAddReview = (newRev: PpaReview) => {
    setReviews(prev => [newRev, ...prev]);
    // Log activity
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: corper.id,
      userName: corper.name,
      userRole: 'corper',
      action: 'Submitted 10-Month PPA Review',
      details: `Awarded ${newRev.overallRating} stars to ${newRev.ppaName}.`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const handleSendMessage = (msg: AdminMessage) => {
    setMessages(prev => [msg, ...prev]);
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'admin-01',
      userName: 'NYSC Headquarters / Admin',
      userRole: 'admin',
      action: 'Dispatched Broadcast / Message',
      details: `Sent "${msg.subject}" to ${msg.recipientName} via ${msg.channel}.`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const handleApplyFromModal = (org: Organization) => {
    if (org.slotsOccupied >= org.slotsNeeded) {
      alert('This organization has already met its corper quota.');
      return;
    }
    setCorper(prev => ({
      ...prev,
      assignedPpaId: org.id,
      assignmentStatus: 'accepted'
    }));
    setOrganizations(prev =>
      prev.map(o =>
        o.id === org.id
          ? { ...o, slotsOccupied: Math.min(o.slotsOccupied + 1, o.slotsNeeded) }
          : o
      )
    );
    alert(`Congratulations! You have been matched and assigned to ${org.name}. Check your Corper Portal to view your official posting letter.`);
    setActiveTab('corper');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* 1. Stylized Loader: "Welcome to Ease My NYSC" */}
      {showLoader && (
        <Loader
          appName="Welcome to Ease My NYSC"
          onComplete={() => setShowLoader(false)}
        />
      )}

      {/* 2. Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReplayLoader={() => setShowLoader(true)}
        selectedState={selectedState}
      />

      {/* 3. Hero Slider Landing page (shown on directory and primary portal views) */}
      {activeTab !== 'author' && activeTab !== 'contact' && activeTab !== 'admin' && (
        <HeroSlider
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 580, behavior: 'smooth' });
          }}
        />
      )}

      {/* 4. Main Body Content Based on Active Portal Tab */}
      <main className="flex-1">
        {activeTab === 'directory' && (
          <PpaDirectory
            organizations={organizations}
            reviews={reviews}
            onOpenOrgDetail={(org) => setModalOrg(org)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'corper' && (
          <CorperDashboard
            corper={corper}
            setCorper={setCorper}
            corpers={corpers}
            setCorpers={setCorpers}
            organizations={organizations}
            setOrganizations={setOrganizations}
            reviews={reviews}
            onAddReview={handleAddReview}
            onOpenOrgDetail={(org) => setModalOrg(org)}
          />
        )}

        {activeTab === 'organization' && (
          <OrganizationDashboard
            organizations={organizations}
            setOrganizations={setOrganizations}
            behavioralRecords={behavioralRecords}
            setBehavioralRecords={setBehavioralRecords}
            corpers={corpers}
            setCorpers={setCorpers}
            placementRequests={placementRequests}
            setPlacementRequests={setPlacementRequests}
            onOpenOrgDetail={(org) => setModalOrg(org)}
          />
        )}

        {activeTab === 'committee' && (
          <CommitteeDashboard
            organizations={organizations}
            setOrganizations={setOrganizations}
            behavioralRecords={behavioralRecords}
            setBehavioralRecords={setBehavioralRecords}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            onOpenOrgDetail={(org) => setModalOrg(org)}
            corpers={corpers}
            setCorpers={setCorpers}
            stateCommittees={stateCommittees}
            setStateCommittees={setStateCommittees}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            onLogActivity={(act) => setActivities(prev => [act, ...prev])}
            onNavigateToCommittee={() => setActiveTab('committee')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            corpers={corpers}
            setCorpers={setCorpers}
            organizations={organizations}
            setOrganizations={setOrganizations}
            committees={stateCommittees}
            setCommittees={setStateCommittees}
            activities={activities}
            setActivities={setActivities}
            messages={messages}
            onSendMessage={handleSendMessage}
            socialHandles={socialHandles}
            onUpdateSocialHandles={setSocialHandles}
            subAdmins={subAdmins}
            setSubAdmins={setSubAdmins}
            moderators={moderators}
            setModerators={setModerators}
            faults={faults}
            setFaults={setFaults}
          />
        )}

        {activeTab === 'author' && (
          <AboutAuthor
            onBackToApp={() => setActiveTab('directory')}
          />
        )}
      </main>

      {/* 5. Organization Detail Inspector Modal */}
      <OrgDetailModal
        org={modalOrg}
        onClose={() => setModalOrg(null)}
        reviews={reviews}
        behavioralRecords={behavioralRecords}
        onApply={handleApplyFromModal}
      />

      {/* 6. Footer */}
      <Footer
        onSelectState={(st) => setSelectedState(st)}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}

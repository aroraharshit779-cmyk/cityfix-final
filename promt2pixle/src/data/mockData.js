// CityFix Civic Mock Data & Master Schemas

export const DEPARTMENTS = {
  ROAD: {
    id: "ROAD",
    name: "Road & Infrastructure (RID)",
    shortName: "Roads & Infra",
    icon: "Truck",
    color: "#f59e0b",
    bgClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    slaHours: 48,
    keywords: ["pothole", "crater", "road", "asphalt", "tar", "pavement", "footpath", "sidewalk", "divider", "speedbreaker", "sinkhole", "manhole cover"],
    leadOfficer: "Er. Rajesh Verma, Chief Road Inspector",
    crews: ["Rapid Pave Crew #3", "Heavy Roller Unit #1", "Concrete Patch Squad #4"]
  },
  WATER: {
    id: "WATER",
    name: "Water Works & Sewage Board (WWSB)",
    shortName: "Water & Sewage",
    icon: "Droplets",
    color: "#06b6d4",
    bgClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    slaHours: 24,
    keywords: ["water", "leak", "pipe", "burst", "pipeline", "sewage", "drainage", "overflow", "gutter", "contamination", "low pressure", "flooding", "tap"],
    leadOfficer: "Dr. Ananya Sen, Hydrology Superintendent",
    crews: ["Leak Sealers Unit #2", "Sewage Suction Tanker #7", "Valve Rapid Response #5"]
  },
  ELECTRICAL: {
    id: "ELECTRICAL",
    name: "Municipal Electrical Undertaking (MEU)",
    shortName: "Electrical & Lights",
    icon: "Zap",
    color: "#eab308",
    bgClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    slaHours: 12,
    keywords: ["streetlight", "light", "dark", "wire", "cable", "pole", "transformer", "spark", "electric", "short circuit", "blackout", "bulb"],
    leadOfficer: "K. S. Narayanan, Grid Safety Officer",
    crews: ["Cherry Picker Unit #8", "High Voltage Safety Unit #2", "Grid Recon Crew #1"]
  },
  SANITATION: {
    id: "SANITATION",
    name: "Solid Waste Management (SWM)",
    shortName: "Sanitation & Waste",
    icon: "Trash2",
    color: "#10b981",
    bgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    slaHours: 18,
    keywords: ["garbage", "trash", "waste", "dump", "bin", "litter", "stench", "smell", "carcass", "debris", "plastic pile", "cleaning"],
    leadOfficer: "Meenakshi Pillai, Sanitation Director",
    crews: ["Clean City Compactor #12", "Green Sweeper Squad #5", "Bio-hazard Disposal #2"]
  },
  HORTICULTURE: {
    id: "HORTICULTURE",
    name: "Parks & Green Infrastructure (PGI)",
    shortName: "Horticulture",
    icon: "Trees",
    color: "#84cc16",
    bgClass: "bg-lime-500/10 text-lime-400 border-lime-500/30",
    slaHours: 24,
    keywords: ["tree", "branch", "fallen", "roots", "park", "garden", "overgrown", "foliage", "wood", "blocking"],
    leadOfficer: "Arjun Bhatia, Urban Forestry Lead",
    crews: ["Chainsaw Forestry Crew #4", "Tree Pruning Truck #9"]
  },
  ENFORCEMENT: {
    id: "ENFORCEMENT",
    name: "Civic Enforcement & Public Safety (CEPS)",
    shortName: "Enforcement",
    icon: "ShieldAlert",
    color: "#a855f7",
    bgClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    slaHours: 72,
    keywords: ["encroachment", "illegal", "banner", "hoarding", "vendor", "unauthorized", "parking", "hawker", "vandalism", "squatting"],
    leadOfficer: "Capt. Vivek Rathore, Enforcement Commissioner",
    crews: ["Anti-Encroachment Squad #1", "Municipal Marshall Taskforce #6"]
  }
};

export const WARDS = [
  { id: "WARD-04", name: "Ward 04 - Connaught Core", zone: "Central Zone", councilor: "Sanjay Singhal", population: "142,000", center: { lat: 28.6315, lng: 77.2167 } },
  { id: "WARD-07", name: "Ward 07 - Tech Corridor & Cyber City", zone: "South-West Zone", councilor: "Pooja Raman", population: "198,500", center: { lat: 28.4985, lng: 77.0890 } },
  { id: "WARD-12", name: "Ward 12 - Metro Central & Interchange", zone: "North Zone", councilor: "Harish Vardhan", population: "220,000", center: { lat: 28.6289, lng: 77.2065 } },
  { id: "WARD-15", name: "Ward 15 - Green Park & Heritage Quarter", zone: "South Zone", councilor: "Farhan Qureshi", population: "165,000", center: { lat: 28.5584, lng: 77.2045 } },
  { id: "WARD-21", name: "Ward 21 - Riverfront & Industrial Hub", zone: "East Zone", councilor: "Sunita Yadav", population: "280,000", center: { lat: 28.6412, lng: 77.2845 } }
];

export const STATUS_STAGES = [
  { key: "Reported", label: "Reported", color: "blue", step: 1 },
  { key: "Assigned", label: "Auto-Routed & Assigned", color: "purple", step: 2 },
  { key: "In Progress", label: "Crew Dispatched / In Progress", color: "amber", step: 3 },
  { key: "Resolved (Pending Verification)", label: "Resolved (Pending Verification)", color: "cyan", step: 4 },
  { key: "Verified & Closed", label: "Verified & Closed", color: "emerald", step: 5 }
];

export const INITIAL_ISSUES = [
  {
    id: "CF-84201",
    title: "Dangerous 2-Foot Asphalt Pothole at Metro Gate 3",
    description: "Deep crater in the middle of the bus lane. Multiple two-wheelers skidded during morning rush. Rainwater is accumulating, hiding its depth.",
    category: "Road & Infrastructure",
    departmentId: "ROAD",
    wardId: "WARD-12",
    wardName: "Ward 12 - Metro Central & Interchange",
    location: {
      lat: 28.62895,
      lng: 77.20655,
      address: "Outer Ring Road, Opp. Metro Station Gate 3, Ward 12"
    },
    status: "In Progress",
    priority: "High",
    upvotes: 34,
    upvotedBy: ["usr-01", "usr-02", "usr-03"],
    reportedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    slaHours: 48,
    deadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    assignedTo: "Rapid Pave Crew #3 (Lead: Er. Rajesh Verma)",
    citizen: {
      name: "Rohan Malhotra",
      phone: "+91 98111 •••••",
      verified: true,
      trustScore: 98
    },
    aiTags: ["Asphalt Cavity", "High Traffic Risk", "Depth: 18cm", "Auto-Routed: RID"],
    aiConfidence: 96.4,
    beforeImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    afterImage: null,
    proofOfWork: null,
    auditTrail: [
      {
        id: "aud-1",
        action: "Issue Reported by Citizen",
        by: "Citizen Rohan Malhotra (GPS Verified)",
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        details: "Citizen uploaded geo-tagged photo with high confidence AI vision scan (96.4% pothole)."
      },
      {
        id: "aud-2",
        action: "AI Auto-Routing Matrix Executed",
        by: "CityFix Neural Gateway",
        timestamp: new Date(Date.now() - 35.8 * 3600 * 1000).toISOString(),
        details: "Matched keywords: 'pothole', 'asphalt', 'crater'. Assigned to Road & Infrastructure (RID) with 48h SLA."
      },
      {
        id: "aud-3",
        action: "Field Dispatch Assigned",
        by: "Municipal Operations Center",
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        details: "Assigned to Rapid Pave Crew #3. Status transitioned to 'In Progress'."
      }
    ]
  },
  {
    id: "CF-84195",
    title: "High-Pressure Water Main Burst Flooding Pedestrian Subway",
    description: "Treated drinking water pipeline burst near Block C market. Thousands of gallons spilling onto the pavement and entering basement retail stores.",
    category: "Water Works & Sewage",
    departmentId: "WATER",
    wardId: "WARD-04",
    wardName: "Ward 04 - Connaught Core",
    location: {
      lat: 28.6315,
      lng: 77.2167,
      address: "Inner Circle Block C, Radial Road 2, Ward 04"
    },
    status: "Resolved (Pending Verification)",
    priority: "Critical",
    upvotes: 62,
    upvotedBy: ["usr-04", "usr-05", "usr-06"],
    reportedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    slaHours: 24,
    deadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    assignedTo: "Leak Sealers Unit #2 (Lead: Dr. Ananya Sen)",
    citizen: {
      name: "Meera Subramanian",
      phone: "+91 97200 •••••",
      verified: true,
      trustScore: 94
    },
    aiTags: ["Pressurized Water Leak", "Flooding Hazard", "Main Conduit #14", "Auto-Routed: WWSB"],
    aiConfidence: 98.2,
    beforeImage: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    proofOfWork: {
      workerId: "TECH-WWSB-409",
      workerName: "Inspector Sunil Patil",
      resolvedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      notes: "Flange joint replaced on 300mm ductile iron pipe. Welded reinforce sleeve and pressure tested up to 6.2 bar. Pavement drained and disinfected.",
      geoTagMatch: 99.1,
      deviceTimestampVerified: true
    },
    auditTrail: [
      {
        id: "aud-4",
        action: "Emergency Issue Flagged",
        by: "Citizen Meera Subramanian",
        timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
        details: "Critical severity trigger: Water leak flooding commercial footfall."
      },
      {
        id: "aud-5",
        action: "Emergency Auto-Dispatch",
        by: "WWSB SCADA System",
        timestamp: new Date(Date.now() - 21.8 * 3600 * 1000).toISOString(),
        details: "Main gate valve #14 shut down remotely. Field crew deployed."
      },
      {
        id: "aud-6",
        action: "Proof-of-Work Submitted (Geo-Tagged)",
        by: "Field Tech Sunil Patil",
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        details: "Uploaded high-resolution repaired pipe photo with GPS coordinate handshake (28.6315, 77.2167). Status set to Resolved (Pending Verification)."
      }
    ]
  },
  {
    id: "CF-84180",
    title: "Entire Row of 8 Streetlights Extinguished on Cyber Highway",
    description: "Complete dark stretch over 400 meters on the service road. Multiple near-miss accidents and women commuters report safety vulnerability.",
    category: "Electrical & Lights",
    departmentId: "ELECTRICAL",
    wardId: "WARD-07",
    wardName: "Ward 07 - Tech Corridor & Cyber City",
    location: {
      lat: 28.4985,
      lng: 77.0890,
      address: "Cyber Boulevard, Phase 2 Access Road, Ward 07"
    },
    status: "Assigned",
    priority: "High",
    upvotes: 41,
    upvotedBy: ["usr-07", "usr-08"],
    reportedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    slaHours: 12,
    deadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    assignedTo: "Cherry Picker Unit #8 (Lead: K. S. Narayanan)",
    citizen: {
      name: "Vikram Sethi",
      phone: "+91 99550 •••••",
      verified: true,
      trustScore: 92
    },
    aiTags: ["Public Lighting Blackout", "Night Safety Hazard", "Feeder Pillar #9", "Auto-Routed: MEU"],
    aiConfidence: 94.8,
    beforeImage: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    afterImage: null,
    proofOfWork: null,
    auditTrail: [
      {
        id: "aud-7",
        action: "Report Logged",
        by: "Citizen Vikram Sethi",
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        details: "Reported blacked-out public streetlight corridor."
      },
      {
        id: "aud-8",
        action: "Auto-Routed to Municipal Electrical Undertaking",
        by: "CityFix Neural Gateway",
        timestamp: new Date(Date.now() - 7.9 * 3600 * 1000).toISOString(),
        details: "Assigned 12-hour urgent electrical SLA. Feeder Pillar #9 flagged for line fuse check."
      }
    ]
  },
  {
    id: "CF-84152",
    title: "Illegal Industrial Waste Dump in Green Buffer Zone",
    description: "Construction rubble and non-biodegradable chemical bags dumped overnight by unidentified tipper truck. Foul smell and toxic dust blowing into nearby residential colony.",
    category: "Sanitation & Waste",
    departmentId: "SANITATION",
    wardId: "WARD-21",
    wardName: "Ward 21 - Riverfront & Industrial Hub",
    location: {
      lat: 28.6412,
      lng: 77.2845,
      address: "Riverfront Road, Opp. Eco Park Gate 4, Ward 21"
    },
    status: "Verified & Closed",
    priority: "Medium",
    upvotes: 19,
    upvotedBy: ["usr-09", "usr-10"],
    reportedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    slaHours: 18,
    deadline: new Date(Date.now() - 54 * 3600 * 1000).toISOString(),
    assignedTo: "Clean City Compactor #12 (Lead: Meenakshi Pillai)",
    citizen: {
      name: "Tanya Kapoor",
      phone: "+91 98711 •••••",
      verified: true,
      trustScore: 99
    },
    aiTags: ["Illegal Waste Dump", "Bio-hazard Risk", "Tonnage: ~3.5 Tons", "Auto-Routed: SWM"],
    aiConfidence: 97.0,
    beforeImage: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    proofOfWork: {
      workerId: "TECH-SWM-114",
      workerName: "Supervisor Govind Das",
      resolvedAt: new Date(Date.now() - 58 * 3600 * 1000).toISOString(),
      notes: "3 tipper trucks of debris cleared and transported to Central Waste Processing Plant. Area cleared, sprayed with lime disinfectant.",
      geoTagMatch: 98.7,
      deviceTimestampVerified: true
    },
    auditTrail: [
      {
        id: "aud-9",
        action: "Citizen Filed Complaint",
        by: "Citizen Tanya Kapoor",
        timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        details: "Photo evidence of 3+ tons construction rubble logged."
      },
      {
        id: "aud-10",
        action: "Clean City Compactor Dispatched",
        by: "SWM Ward 21 Control",
        timestamp: new Date(Date.now() - 68 * 3600 * 1000).toISOString(),
        details: "CCTV footage requested to identify dumping vehicle registration."
      },
      {
        id: "aud-11",
        action: "Proof-of-Work Uploaded",
        by: "Supervisor Govind Das",
        timestamp: new Date(Date.now() - 58 * 3600 * 1000).toISOString(),
        details: "Before/After proof validated by GPS geofence."
      },
      {
        id: "aud-12",
        action: "Citizen Verification & Ticket Closed",
        by: "Citizen Tanya Kapoor (App Confirmation)",
        timestamp: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
        details: "Citizen confirmed site is spotless. 5-Star rating awarded to crew."
      }
    ]
  },
  {
    id: "CF-84110",
    title: "Storm-Damaged Neem Tree Branch Blocking School Bus Route",
    description: "Heavy branch snapped during thunderstorm, dangling precariously above electric transmission cable and blocking 80% of the school lane width.",
    category: "Horticulture",
    departmentId: "HORTICULTURE",
    wardId: "WARD-15",
    wardName: "Ward 15 - Green Park & Heritage Quarter",
    location: {
      lat: 28.5584,
      lng: 77.2045,
      address: "Heritage Avenue, Near St. Xavier School, Ward 15"
    },
    status: "Reported",
    priority: "Medium",
    upvotes: 15,
    upvotedBy: ["usr-11"],
    reportedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    slaHours: 24,
    deadline: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    assignedTo: "Chainsaw Forestry Crew #4 (Lead: Arjun Bhatia)",
    citizen: {
      name: "Amitabh Banerjee",
      phone: "+91 98990 •••••",
      verified: true,
      trustScore: 91
    },
    aiTags: ["Dangerous Tree Limb", "Cable Entanglement Risk", "School Zone", "Auto-Routed: PGI"],
    aiConfidence: 95.1,
    beforeImage: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    afterImage: null,
    proofOfWork: null,
    auditTrail: [
      {
        id: "aud-13",
        action: "Report Logged",
        by: "Citizen Amitabh Banerjee",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        details: "Reported hazardous branch over school bus lane."
      },
      {
        id: "aud-14",
        action: "Auto-Routed to Horticulture & Forestry",
        by: "CityFix Neural Gateway",
        timestamp: new Date(Date.now() - 3.9 * 3600 * 1000).toISOString(),
        details: "Queued for Chainsaw Forestry Crew #4."
      }
    ]
  }
];

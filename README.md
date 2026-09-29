# 🏙️ CityFix: Citizen Issue Reporting & Resolution Portal

> **Track:** Civic Technology / Smart Governance  
> **Focus:** Smart City • Citizen Empowerment • Digital Governance • Proof-of-Work Verification  
> **Demo URL:** [http://localhost:5173](http://localhost:5173)

---

## 🌟 Executive Overview
**CityFix** is a production-grade Civic Issue Reporting & Resolution Portal engineered to eliminate civic decay, bureaucratic latency, and opaque municipal operations. Built with modern React, Tailwind CSS, Leaflet mapping, and real-time algorithmic telemetry, CityFix bridges the gap between active citizens, field crews, and city councilors.

---

## 🚀 4 Mandatory Hackathon USPs

### 1. 🤖 AI Duplicate Detection Simulation (50-Meter Radius + NLP Check)
* **The Problem:** In major cities, a single pothole or water leak is often reported dozens of times by different citizens, inundating municipal triage teams with redundant work orders.
* **The CityFix Solution:** When a citizen drops a pin or fills out a report, CityFix executes a real-time spatial Haversine calculation and Jaccard semantic NLP check:
  - If an active or recently reported complaint exists within **50 meters** over the last **7 days**, an automated warning is triggered:
    > *"⚠️ Similar issue already reported nearby! (28 meters away, reported 2 days ago with 34 citizen upvotes). Would you like to upvote it instead or proceed?"*
  - **Upvoting** consolidates citizen interest, boosts the municipal urgency score, prevents fragmented work orders, and saves municipal dispatch budget.
  - **Shortcut for Judges:** Click the top ribbon button **`⚡ Judge Demo: Test 50m Duplicate`** to immediately trigger this warning!

---

### 2. ⚡ Smart Auto-Routing Matrix & SLA Engine
* **Automated Keyword NLP Classification:** As citizens type their complaint, CityFix analyzes keywords to map issues directly to the responsible municipal department:
  - **Potholes, Sinkholes, Broken Footpaths** $\rightarrow$ `Road & Infrastructure (RID)` *(SLA: 48h)*
  - **Water Pipe Burst, Sewage Overflow, Low Pressure** $\rightarrow$ `Water Works & Sewage Board (WWSB)` *(SLA: 24h)*
  - **Streetlight Dark, Broken Wire, Transformer Spark** $\rightarrow$ `Municipal Electrical Undertaking (MEU)` *(SLA: 12h)*
  - **Garbage Dump, Overflowing Bin, Animal Debris** $\rightarrow$ `Solid Waste Management (SWM)` *(SLA: 18h)*
  - **Fallen Tree, Snapped Branch** $\rightarrow$ `Parks & Green Infrastructure (PGI)` *(SLA: 24h)*
  - **Illegal Encroachment, Public Space Blockage** $\rightarrow$ `Civic Enforcement & Public Safety (CEPS)` *(SLA: 72h)*
* **Dynamic SLA Deadlines:** Automatically assigns field crews and calculates real-time deadline timers.

---

### 3. 🛡️ Proof-of-Work Closure Loop (Zero-Fraud Resolution)
* **No "Fake Resolves":** Field workers and authorities **cannot** simply change status to "Resolved" with a single click.
* **Mandatory Resolution Proof:** To transition an issue from `In Progress` $\rightarrow$ `Resolved (Pending Verification)`, the field technician must open the **Submit Proof-of-Work Modal** and provide:
  1. A geo-tagged, timestamped **"After" photograph** of the completed repair.
  2. Technician / Crew ID (`CREW-RID-884`).
  3. Engineering resolution notes (materials used, compaction, pressure tests).
  4. Simulated EXIF coordinate validation (e.g. `99.4% GPS Geofence Match`).
* **Interactive Before vs. After Photo Comparison:** Citizens and ward inspectors can view an interactive side-by-side or split slider inspecting the repair quality with immutable audit logs.
* **Citizen Verification:** Citizens have the power to **Confirm Closure** or **Reopen with Dispute** if the workmanship is defective.

---

### 4. 📊 Public Ward-Wise Transparency Dashboard
* **Open Civic Data:** Real-time metrics board accessible to the public, media, and ward councilors:
  - **Total Issues Reported** & Active Field Load
  - **Resolution Rate Percentage** (Live calculated)
  - **Average Turnaround Time** (e.g., 18.6 Hours)
  - **SLA Adherence Compliance Rate** (95.8%)
  - **Community Upvotes**
* **Ward Performance Index:** Tracks accountability across **Ward 04 (Connaught Core)**, **Ward 07 (Tech Corridor)**, **Ward 12 (Metro Central)**, **Ward 15 (Green Park)**, and **Ward 21 (Riverfront)**.
* **Dynamic Filterable Status Table:** Multi-parameter search by Ward, Department, and Status with one-click **CSV Report Export**!

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | React 19 (Vite Fast HMR, React Compiler) |
| **Styling & Design System** | Tailwind CSS v4, Glassmorphism, Dark Mode Smart City Aesthetic |
| **Mapping & Radar** | Leaflet.js, CartoDB Dark Matter / Voyager Raster Tiles, 50m Dynamic Radar Rings |
| **Audio Synthesizer** | Native Web Audio API (Zero external audio file overhead) |
| **Animations & Confetti** | Canvas-Confetti, CSS3 Keyframe Radar Sweeps & Pulse Rings |
| **State & Persistence** | LocalStorage state synchronizer (`cityfix_issues_v2`), seed data fallback |

---

## 📁 Project Structure

```
promt2pixle/
├── package.json                          # Root proxy script runner
├── README.md                             # Project overview & documentation
└── promt2pixle/                          # Vite React Application
    ├── package.json                      # React, Vite, Tailwind, Leaflet, Lucide
    ├── vite.config.js                    # Vite configuration with @tailwindcss/vite
    ├── index.html                        # App shell, fonts, Leaflet stylesheet
    └── src/
        ├── main.jsx                      # React entrypoint
        ├── index.css                     # Design system, glass panels, radar keyframes
        ├── App.jsx                       # Master view controller & state management
        ├── data/
        │   └── mockData.js               # Departments, wards, initial civic dataset
        ├── services/
        │   ├── duplicateDetection.js     # Haversine 50m radius & NLP similarity engine
        │   └── autoRouting.js            # Keyword matrix & SLA determination
        ├── utils/
        │   └── audio.js                  # Native Web Audio API UI sound synthesis
        └── components/
            ├── Navbar.jsx                # Brand bar, live telemetry ribbon, judge shortcuts
            ├── InteractiveMap.jsx        # Leaflet map, radar 50m ring, pin drop & GPS
            ├── ComplaintsFeed.jsx        # Citizen list view, before/after cards, upvotes
            ├── AuthorityPortal.jsx       # Field crew hub & Proof-of-Work Closure Loop
            ├── TransparencyDashboard.jsx # KPI board, ward index, CSV exporter
            ├── ReportIssueModal.jsx      # Citizen reporting flow & duplicate guard
            ├── IssueDetailModal.jsx      # Before/after slider & immutable audit trail
            └── TicketTrackerModal.jsx    # Quick ticket ID lookup
```

---

## ⚡ How to Run Locally

1. **Clone or Navigate to the Repository:**
   ```bash
   cd c:\Users\HARSHIT\OneDrive\Desktop\promt2pixle\promt2pixle
   ```

2. **Install Dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🧪 Quick Hackathon Demo Walkthrough (for Judges)

1. **Test AI Duplicate Detection (USP 1):**
   - Click the top golden button **`⚡ Judge Demo: Test 50m Duplicate`**.
   - Notice the form pre-populates a report 25 meters from an existing Ward 12 Metro pothole.
   - Click **Verify & Submit Complaint**.
   - Observe the **AI Duplicate Detection Guard Alert** trigger with distance (`24m away`) and the **`Upvote Existing Issue (+1)`** action button!

2. **Test Smart Auto-Routing (USP 2):**
   - Click **Report Issue** in the navbar.
   - Type `"Burst high pressure water pipe flooding basement"` in the title.
   - Watch the **AI Auto-Routing Matrix** live telemetry automatically recommend: `Water Works & Sewage Board (WWSB)` with `24h SLA` and `Critical Priority`!

3. **Test Proof-of-Work Closure Loop (USP 3):**
   - Click the **`Authority & Proof-of-Work`** tab in the top navigation.
   - Look at an issue under **In Progress** (e.g. `#CF-84201`).
   - Notice you cannot mark it resolved directly! Click **`Upload Proof-of-Work to Resolve`**.
   - Select a sample repaired road photo, review the automated GPS geofence match (99.4%), enter inspector notes, and click **`Submit Proof-of-Work & Mark Resolved`**.
   - Click **`Audit Log`** to inspect the before/after side-by-side comparison and the recorded timestamp.

4. **Test Public Transparency Analytics (USP 4):**
   - Click the **`Transparency Hub`** tab.
   - Review live KPIs (Resolution Rate, Avg Turnaround, SLA Compliance).
   - Click on **Ward 04** or **Ward 12** to filter the dynamic table.
   - Click **`Export Audit CSV`** to download a spreadsheet report for council audits.

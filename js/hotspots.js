/* ==========================================================================
   A SMARTER TOMORROW - Interactive Blueprint Hotspots Engine
   ========================================================================== */

const blueprintData = {
  solar: {
    title: "Solar Facades & Rooftop Solar",
    category: "Clean Energy",
    desc: "BIPV (Building-Integrated Photovoltaics) engineered directly into skyscraper glass facades and multi-tiered rooftop gardens, converting 360-degree daylight into clean, localized urban power with zero emissions.",
    specs: [
      { label: "Solar Capture Efficiency", value: "32.4% Monocrystalline" },
      { label: "Annual Clean Energy Yield", value: "4.8 GWh / District" },
      { label: "Carbon Offset Metric", value: "3,200 Tons CO2/yr" },
      { label: "Smart Grid Integration", value: "AI Micro-inverters" }
    ],
    targetPillar: "clean-energy"
  },
  living: {
    title: "Modular & Adaptable Living Spaces",
    category: "Smart Living",
    desc: "Dynamic, reconfigurable architectural living units designed with bio-composite timber, automated acoustic partition walls, and integrated vertical indoor flora that purify air while adapting to evolving resident needs.",
    specs: [
      { label: "Living Unit Adaptability", value: "100% Configurable" },
      { label: "Indoor Air Quality", value: "HEPA + Biophilic Pure" },
      { label: "Thermal Efficiency", value: "Passivhaus Standard" },
      { label: "Smart IoT Controls", value: "Voice & Biometric Hub" }
    ],
    targetPillar: "smart-living"
  },
  mobility: {
    title: "Metro & Urban Sky Mobility",
    category: "Seamless Mobility",
    desc: "Elevated panoramic magnetic levitation transit systems gliding smoothly over pedestrian walkways, eliminating surface traffic congestion and reducing urban transit delays to under 90 seconds.",
    specs: [
      { label: "Transit Speed (Sky-rail)", value: "120 km/h Maglev" },
      { label: "Fleet Propulsion", value: "100% Zero-Emission Electric" },
      { label: "Dispatch Frequency", value: "90 sec Peak Intervals" },
      { label: "Station Accessibility", value: "< 2 min Walk Radius" }
    ],
    targetPillar: "seamless-mobility"
  },
  water: {
    title: "Rainwater Harvesting & Cascading Bio-Filtration",
    category: "Resource Efficiency",
    desc: "Architectural cascading waterfalls collect, oxygenate, and channel stormwater into subterranean natural aquifers and bio-filtration ponds, supplying 100% of urban landscape irrigation and greywater reuse.",
    specs: [
      { label: "Daily Water Harvested", value: "2.4M Liters" },
      { label: "Bio-Filtration Stages", value: "4-Stage Wetland + UV" },
      { label: "Subterranean Storage", value: "50,000 m³ Caverns" },
      { label: "Recycling Loop Efficiency", value: "94.2% Closed Cycle" }
    ],
    targetPillar: "resource-efficiency"
  },
  logistics: {
    title: "Automated Goods Storage & Distribution",
    category: "Automated Systems",
    desc: "Autonomous guided robotic vehicles (AGVs) operating silently inside subterranean logistics corridors, fulfilling package deliveries directly to building utility shafts without a single delivery truck on street level.",
    specs: [
      { label: "Robotic AGV Fleet", value: "450 Active Units" },
      { label: "Average Delivery Time", value: "< 12 Minutes" },
      { label: "Surface Traffic Reduction", value: "85% Freight Removed" },
      { label: "Automation Accuracy", value: "99.98% AI Precision" }
    ],
    targetPillar: "automated-systems"
  },
  transit_tube: {
    title: "Underground High-Speed Transport Network",
    category: "Seamless Mobility & Logistics",
    desc: "Sub-surface vacuum and high-velocity electric pods moving long-distance commuters and intercity freight in hyper-efficient sub-terrene tubes, keeping ground level quiet, green, and pedestrian-first.",
    specs: [
      { label: "Sub-terrene Velocity", value: "240 km/h Pod Speed" },
      { label: "Acoustic Decibel Level", value: "< 28 dB (Whisper Silent)" },
      { label: "Power Source", value: "Regenerative Braking Loop" },
      { label: "Intercity Connection", value: "Sub-5 min Express" }
    ],
    targetPillar: "seamless-mobility"
  }
};

function initHotspots() {
  const pinElements = document.querySelectorAll('.hotspot-pin');
  const titleEl = document.getElementById('blueprint-title');
  const catEl = document.getElementById('blueprint-category');
  const descEl = document.getElementById('blueprint-desc');
  const specsListEl = document.getElementById('blueprint-specs');
  const jumpBtn = document.getElementById('blueprint-jump-btn');

  if (!pinElements.length) return;

  function updateDetail(key) {
    const data = blueprintData[key];
    if (!data) return;

    // Update active pin classes
    pinElements.forEach(pin => {
      pin.classList.toggle('active', pin.dataset.hotspot === key);
    });

    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.category;
    if (descEl) descEl.textContent = data.desc;

    if (specsListEl) {
      specsListEl.innerHTML = data.specs.map(spec => `
        <li class="blueprint-spec-item">
          <span class="spec-name">${spec.label}</span>
          <span class="spec-val">${spec.value}</span>
        </li>
      `).join('');
    }

    if (jumpBtn) {
      jumpBtn.onclick = () => {
        if (window.soundFX) window.soundFX.playClick();
        const tabBtn = document.querySelector(`.pillar-tab-btn[data-target="${data.targetPillar}"]`);
        if (tabBtn) tabBtn.click();
        const targetSection = document.getElementById('pillars');
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
      };
    }
  }

  pinElements.forEach(pin => {
    pin.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playClick();
      updateDetail(pin.dataset.hotspot);
    });

    pin.addEventListener('mouseenter', () => {
      if (window.soundFX) window.soundFX.playHover();
    });
  });

  // Default to solar on start
  updateDetail('solar');
}

document.addEventListener('DOMContentLoaded', initHotspots);

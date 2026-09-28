/* ==========================================================================
   A SMARTER TOMORROW - Interactive Simulators & Dynamic Calculation Engines
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. SOLAR & CLEAN ENERGY SIMULATOR
  // ------------------------------------------------------------------------
  const sunAngleSlider = document.getElementById('solar-sun-angle');
  const cloudCoverSlider = document.getElementById('solar-cloud-cover');
  const solarOutputNum = document.getElementById('solar-output-val');
  const solarCarbonNum = document.getElementById('solar-carbon-val');
  const solarBatteryNum = document.getElementById('solar-battery-val');

  function updateSolarSim() {
    if (!sunAngleSlider || !cloudCoverSlider) return;
    const angle = parseFloat(sunAngleSlider.value); // 0 to 90
    const clouds = parseFloat(cloudCoverSlider.value); // 0 to 100

    // Sun angle peak around 60-70 deg
    const sunFactor = Math.sin((angle * Math.PI) / 180);
    const cloudFactor = (100 - clouds * 0.75) / 100;
    const baseCap = 12.8; // MW

    const outputMW = Math.max(0.2, baseCap * sunFactor * cloudFactor).toFixed(1);
    const co2Saved = (outputMW * 0.78).toFixed(1);
    const batteryPct = Math.min(100, Math.round((outputMW / baseCap) * 100));

    if (solarOutputNum) solarOutputNum.textContent = `${outputMW} MW`;
    if (solarCarbonNum) solarCarbonNum.textContent = `${co2Saved} T/h`;
    if (solarBatteryNum) solarBatteryNum.textContent = `${batteryPct}%`;
  }

  if (sunAngleSlider && cloudCoverSlider) {
    sunAngleSlider.addEventListener('input', () => {
      document.getElementById('sun-angle-text').textContent = `${sunAngleSlider.value}°`;
      updateSolarSim();
      if (window.soundFX) window.soundFX.playHover();
    });
    cloudCoverSlider.addEventListener('input', () => {
      document.getElementById('cloud-cover-text').textContent = `${cloudCoverSlider.value}%`;
      updateSolarSim();
      if (window.soundFX) window.soundFX.playHover();
    });
    updateSolarSim();
  }

  // ------------------------------------------------------------------------
  // 2. MODULAR LIVING SPACE SIMULATOR
  // ------------------------------------------------------------------------
  const livingModeBtns = document.querySelectorAll('.living-mode-btn');
  const livingModeTitle = document.getElementById('living-mode-title');
  const livingModeDesc = document.getElementById('living-mode-desc');
  const livingAqi = document.getElementById('living-aqi');
  const livingAcoustic = document.getElementById('living-acoustic');
  const livingEnergy = document.getElementById('living-energy');

  const livingModes = {
    work: {
      title: "Active Work & Collaboration Mode",
      desc: "Smart biophilic partitions deploy acoustic dampeners, daylight harvesting optimizes focus spectrum (5500K), and dual workstation modules slide into position.",
      aqi: "12 (Pristine)",
      acoustic: "-38 dB Isolation",
      energy: "0.18 kWh/unit"
    },
    sanctuary: {
      title: "Biophilic Sanctuary & Rest Mode",
      desc: "Circadian lighting shifts to warm amber (2200K), vertical living green wall misting engages, and panoramic smart electrochromic glass optimizes privacy.",
      aqi: "8 (Alpine Pure)",
      acoustic: "-45 dB Isolation",
      energy: "0.06 kWh/unit"
    },
    family: {
      title: "Expanded Social & Living Mode",
      desc: "Modular partition walls retract flush into sub-flooring, creating an expansive 90m² open-concept bio-terrace with integrated hydroponic fresh dining access.",
      aqi: "14 (Fresh)",
      acoustic: "-25 dB Natural",
      energy: "0.24 kWh/unit"
    }
  };

  livingModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playClick();
      livingModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = livingModes[btn.dataset.mode];
      if (mode) {
        if (livingModeTitle) livingModeTitle.textContent = mode.title;
        if (livingModeDesc) livingModeDesc.textContent = mode.desc;
        if (livingAqi) livingAqi.textContent = mode.aqi;
        if (livingAcoustic) livingAcoustic.textContent = mode.acoustic;
        if (livingEnergy) livingEnergy.textContent = mode.energy;
      }
    });
  });

  // ------------------------------------------------------------------------
  // 3. SEAMLESS MOBILITY COMPARATOR
  // ------------------------------------------------------------------------
  const mobilitySelect = document.getElementById('mobility-dest-select');
  const transitSkyTime = document.getElementById('transit-sky-time');
  const transitTubeTime = document.getElementById('transit-tube-time');
  const transitRoadTime = document.getElementById('transit-road-time');
  const transitCo2Saved = document.getElementById('transit-co2-saved');

  const transitData = {
    hub: { sky: "3 min", tube: "1.5 min", road: "18 min", co2: "98% Saved" },
    eco_district: { sky: "6 min", tube: "3 min", road: "32 min", co2: "99% Saved" },
    sky_terrace: { sky: "4 min", tube: "2 min", road: "24 min", co2: "97% Saved" }
  };

  if (mobilitySelect) {
    mobilitySelect.addEventListener('change', () => {
      if (window.soundFX) window.soundFX.playSwitch();
      const data = transitData[mobilitySelect.value] || transitData.hub;
      if (transitSkyTime) transitSkyTime.textContent = data.sky;
      if (transitTubeTime) transitTubeTime.textContent = data.tube;
      if (transitRoadTime) transitRoadTime.textContent = data.road;
      if (transitCo2Saved) transitCo2Saved.textContent = data.co2;
    });
  }

  // ------------------------------------------------------------------------
  // 4. RESOURCE EFFICIENCY WATER CYCLE SIMULATOR
  // ------------------------------------------------------------------------
  const rainSlider = document.getElementById('rain-intensity-slider');
  const rainText = document.getElementById('rain-intensity-text');
  const waterHarvestedVal = document.getElementById('water-harvested-val');
  const waterPurityVal = document.getElementById('water-purity-val');
  const waterCapacityVal = document.getElementById('water-capacity-val');

  function updateWaterSim() {
    if (!rainSlider) return;
    const rain = parseFloat(rainSlider.value); // 10 to 100 mm/h
    if (rainText) rainText.textContent = `${rain} mm/h`;

    const harvestedLiters = (rain * 48000).toLocaleString();
    const purityScore = Math.min(99.9, (97 + (100 - rain) * 0.025)).toFixed(1);
    const reservoirPct = Math.min(100, Math.round(55 + rain * 0.42));

    if (waterHarvestedVal) waterHarvestedVal.textContent = `${harvestedLiters} L`;
    if (waterPurityVal) waterPurityVal.textContent = `${purityScore}%`;
    if (waterCapacityVal) waterCapacityVal.textContent = `${reservoirPct}%`;
  }

  if (rainSlider) {
    rainSlider.addEventListener('input', () => {
      updateWaterSim();
      if (window.soundFX) window.soundFX.playHover();
    });
    updateWaterSim();
  }

  // ------------------------------------------------------------------------
  // 5. UNDERGROUND AUTOMATED AGV LOGISTICS DISPATCHER
  // ------------------------------------------------------------------------
  const dispatchBtn = document.getElementById('agv-dispatch-btn');
  const agvQueueNum = document.getElementById('agv-queue-val');
  const agvActiveNum = document.getElementById('agv-active-val');
  const agvDeliveryStatus = document.getElementById('agv-delivery-status');

  let activeAGVs = 142;
  let queueCount = 8;

  if (dispatchBtn) {
    dispatchBtn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playSuccess();
      queueCount++;
      if (agvQueueNum) agvQueueNum.textContent = queueCount;
      if (agvDeliveryStatus) {
        agvDeliveryStatus.textContent = `Autonomous Pod AGV-${Math.floor(Math.random() * 900 + 100)} Dispatched to Conduit #4!`;
        agvDeliveryStatus.style.color = 'var(--accent-green)';
      }

      setTimeout(() => {
        if (queueCount > 0) queueCount--;
        activeAGVs++;
        if (agvQueueNum) agvQueueNum.textContent = queueCount;
        if (agvActiveNum) agvActiveNum.textContent = activeAGVs;
      }, 1400);
    });
  }

  // ------------------------------------------------------------------------
  // 6. CITIZEN IMPACT CALCULATOR
  // ------------------------------------------------------------------------
  const calcHousehold = document.getElementById('calc-household');
  const calcSolarPct = document.getElementById('calc-solar-pct');
  const calcTransit = document.getElementById('calc-transit');

  const resultScore = document.getElementById('calc-result-score');
  const resultCo2 = document.getElementById('calc-result-co2');
  const resultTrees = document.getElementById('calc-result-trees');
  const resultWater = document.getElementById('calc-result-water');
  const resultSelf = document.getElementById('calc-result-self');

  function calculateCitizenImpact() {
    if (!calcHousehold || !calcSolarPct || !calcTransit) return;

    const people = parseInt(calcHousehold.value) || 2;
    const solar = parseInt(calcSolarPct.value) || 80;
    const transit = calcTransit.value; // 'maglev', 'shuttle', 'hybrid'

    let transitScore = 40;
    if (transit === 'maglev') transitScore = 50;
    if (transit === 'shuttle') transitScore = 45;

    const netScore = Math.min(99, Math.round((solar * 0.5) + (transitScore * 0.95) + (people * 1.5)));
    const co2Saved = (people * 1.85 * (solar / 100) + (transitScore * 0.04)).toFixed(1);
    const treesEquiv = Math.round(co2Saved * 45);
    const waterSaved = Math.round(people * 1420 * 0.88);
    const selfSufficiency = Math.min(100, Math.round(solar * 0.95 + 4));

    if (resultScore) resultScore.textContent = `${netScore}%`;
    if (resultCo2) resultCo2.textContent = `${co2Saved} T`;
    if (resultTrees) resultTrees.textContent = `${treesEquiv}`;
    if (resultWater) resultWater.textContent = `${waterSaved.toLocaleString()} L`;
    if (resultSelf) resultSelf.textContent = `${selfSufficiency}%`;
  }

  const calcInputs = [calcHousehold, calcSolarPct, calcTransit];
  calcInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        calculateCitizenImpact();
        if (window.soundFX) window.soundFX.playHover();
      });
      input.addEventListener('change', () => {
        calculateCitizenImpact();
        if (window.soundFX) window.soundFX.playSwitch();
      });
    }
  });

  calculateCitizenImpact();
});

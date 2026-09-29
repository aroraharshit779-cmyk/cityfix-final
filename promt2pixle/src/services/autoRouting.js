// Smart Auto-Routing Matrix Service
// Uses NLP keyword scoring and severity classification to map civic issues to municipal departments

import { DEPARTMENTS } from '../data/mockData';

const SEVERITY_TRIGGERS = {
  Critical: ["burst", "explosion", "sparking", "spark", "shock", "live wire", "flooding", "toxic", "fire", "casualty", "collapse", "danger", "emergency", "fatal"],
  High: ["pothole", "blackout", "overflowing", "contamination", "crater", "snapped", "deep", "accident", "blocked", "highway", "school", "hospital"],
  Medium: ["broken", "dark", "garbage", "trash", "leak", "fallen", "odor", "stench", "cracked", "sidewalk", "light"],
  Low: ["faded", "slow", "minor", "graffiti", "cleaning", "pruning", "dust"]
};

export const autoRouteIssue = (title = '', description = '', selectedCategory = '') => {
  const combined = `${title} ${description} ${selectedCategory}`.toLowerCase();
  
  const scores = {};
  const matchedKeywordsByDept = {};

  // Score each department based on keyword presence
  Object.keys(DEPARTMENTS).forEach((deptKey) => {
    const dept = DEPARTMENTS[deptKey];
    scores[deptKey] = 0;
    matchedKeywordsByDept[deptKey] = [];

    dept.keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(combined)) {
        scores[deptKey] += 15;
        matchedKeywordsByDept[deptKey].push(keyword);
      }
    });

    // Check if category name matches
    if (selectedCategory && dept.name.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, 4))) {
      scores[deptKey] += 25;
    }
  });

  // Find highest scoring department
  let bestDeptKey = "ROAD";
  let maxScore = -1;

  Object.keys(scores).forEach((deptKey) => {
    if (scores[deptKey] > maxScore) {
      maxScore = scores[deptKey];
      bestDeptKey = deptKey;
    }
  });

  // Calculate confidence percentage
  const confidence = Math.min(99, Math.max(65, 70 + Math.round(maxScore * 1.5)));

  // Determine Severity / Priority
  let determinedPriority = "Medium";
  for (const [priority, words] of Object.entries(SEVERITY_TRIGGERS)) {
    const hasTrigger = words.some((word) => combined.includes(word));
    if (hasTrigger) {
      determinedPriority = priority;
      break;
    }
  }

  const dept = DEPARTMENTS[bestDeptKey];
  const assignedCrew = dept.crews[Math.floor(Math.random() * dept.crews.length)];

  // Generate AI Diagnostic Tags
  const aiTags = [
    `Category: ${dept.shortName}`,
    `Auto-Routed: ${dept.id}`,
    `SLA: ${dept.slaHours}h`,
    `Priority: ${determinedPriority}`
  ];

  if (matchedKeywordsByDept[bestDeptKey]?.length > 0) {
    aiTags.unshift(`Detected: ${matchedKeywordsByDept[bestDeptKey].slice(0, 2).join(', ')}`);
  }

  return {
    departmentId: dept.id,
    department: dept,
    confidence,
    priority: determinedPriority,
    slaHours: dept.slaHours,
    deadlineDate: new Date(Date.now() + dept.slaHours * 3600 * 1000).toISOString(),
    assignedCrew,
    matchedKeywords: matchedKeywordsByDept[bestDeptKey],
    aiTags,
    rationale: `Matched ${matchedKeywordsByDept[bestDeptKey]?.length || 0} civic keywords (${matchedKeywordsByDept[bestDeptKey]?.join(', ') || 'General Inspection'}). Routed to ${dept.name} with ${dept.slaHours}h SLA.`
  };
};

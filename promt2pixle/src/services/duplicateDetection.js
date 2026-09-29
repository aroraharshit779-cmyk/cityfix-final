// AI Duplicate Detection Service
// Runs a spatial radius (50m) and NLP semantic similarity check across recent issues (7 days)

/**
 * Calculates Haversine distance between two coordinates in meters
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Tokenize and normalize text for similarity comparison
 */
const tokenizeText = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);
};

/**
 * Computes Jaccard semantic similarity between two texts (0 to 1)
 */
export const computeTextSimilarity = (textA = '', textB = '') => {
  const tokensA = new Set(tokenizeText(textA));
  const tokensB = new Set(tokenizeText(textB));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersectionCount = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) intersectionCount++;
  });

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
};

/**
 * Core Duplicate Detection Engine
 * Radius threshold: 50 meters
 * Temporal window: 7 days (604,800,000 ms)
 */
export const detectDuplicateIssue = (newIssue, existingIssues = []) => {
  const MAX_RADIUS_METERS = 50;
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const newLat = newIssue.location?.lat;
  const newLng = newIssue.location?.lng;
  const newCombinedText = `${newIssue.title || ''} ${newIssue.description || ''} ${newIssue.category || ''}`;

  const candidates = [];

  for (const issue of existingIssues) {
    // Exclude self if editing
    if (newIssue.id && issue.id === newIssue.id) continue;

    // Check temporal window (last 7 days)
    const reportTime = new Date(issue.reportedAt || issue.timestamp || now).getTime();
    const isWithin7Days = now - reportTime <= SEVEN_DAYS_MS;

    // Calculate distance
    const dist = calculateDistanceMeters(newLat, newLng, issue.location?.lat, issue.location?.lng);

    // Compute text similarity
    const existingCombinedText = `${issue.title || ''} ${issue.description || ''} ${issue.category || ''}`;
    const textSim = computeTextSimilarity(newCombinedText, existingCombinedText);

    // Check category match
    const categoryMatch = issue.category && newIssue.category && 
      issue.category.toLowerCase().includes(newIssue.category.toLowerCase().slice(0, 4));

    // Confidence scoring
    // High distance proximity (<50m) contributes 60%, text similarity contributes 25%, category contributes 15%
    let confidence = 0;
    if (dist <= 50) {
      confidence += Math.max(0, 60 * (1 - dist / 50));
    }
    confidence += textSim * 25;
    if (categoryMatch) confidence += 15;

    // Flag as duplicate if within 50 meters AND within 7 days, OR extremely high semantic match nearby
    const isWithinRadius = dist <= MAX_RADIUS_METERS && isWithin7Days;
    const isHighProbability = (isWithinRadius && (categoryMatch || textSim > 0.15)) || (dist <= 75 && textSim > 0.4);

    if (dist <= 150) {
      candidates.push({
        issue,
        distanceMeters: dist,
        textSimilarity: Math.round(textSim * 100),
        confidence: Math.min(99, Math.round(confidence)),
        isDuplicateAlert: isWithinRadius || isHighProbability,
        isWithin7Days,
        daysAgo: Math.max(0, Math.round((now - reportTime) / (24 * 3600 * 1000)))
      });
    }
  }

  // Sort by lowest distance first, then highest confidence
  candidates.sort((a, b) => a.distanceMeters - b.distanceMeters || b.confidence - a.confidence);

  const primaryMatch = candidates.find((c) => c.isDuplicateAlert) || null;

  return {
    isDuplicate: Boolean(primaryMatch),
    primaryMatch,
    nearbyCandidates: candidates.slice(0, 3),
    checkedCount: existingIssues.length
  };
};

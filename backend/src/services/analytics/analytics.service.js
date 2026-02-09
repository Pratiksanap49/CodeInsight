import Submission from "../../models/Submission.model.js";

export async function getUserAnalytics(userId) {
  const submissions = await Submission.find({ userId }).sort({
    createdAt: 1
  });

  /* -----------------------------
     Empty state (guaranteed shape)
  ------------------------------ */
  if (!submissions || submissions.length === 0) {
    return {
      misconceptionFrequency: {},
      attemptsPerQuestion: {},
      misconceptionsOverTime: [],
      misconceptionProfile: []
    };
  }

  /* -----------------------------
     Misconception frequency
  ------------------------------ */
  const misconceptionMap = {};

  submissions.forEach(sub => {
    const findings = sub.detectedMisconceptions || [];
    findings.forEach(m => {
      if (m && m.id) {
        misconceptionMap[m.id] = (misconceptionMap[m.id] || 0) + 1;
      }
    });
  });

  const misconceptionFrequency = misconceptionMap;

  /* -----------------------------
     Attempts per question
  ------------------------------ */
  const attemptsMap = {};

  submissions.forEach(sub => {
    if (sub.questionId) {
      attemptsMap[sub.questionId] = Math.max(
        attemptsMap[sub.questionId] || 0,
        sub.attemptNumber || 1
      );
    }
  });

  const attemptsPerQuestion = attemptsMap;

  /* -----------------------------
     Misconceptions over time
  ------------------------------ */
  const misconceptionsOverTime = submissions.map(sub => {
    const findings = sub.detectedMisconceptions || [];
    const totalConf = findings.reduce(
      (acc, m) => acc + (m.confidence || 0),
      0
    );
    const avgConf = findings.length > 0 ? totalConf / findings.length : 0;

    return {
      createdAt: sub.createdAt,
      count: findings.length,
      avgConfidence: parseFloat(avgConf.toFixed(2))
    };
  });

  /* -----------------------------
     Misconception Profile (Diagnostic Story)
  ------------------------------ */
  const profileMap = {};

  // 1. Aggregation
  submissions.forEach(sub => {
    const findings = sub.detectedMisconceptions || [];
    findings.forEach(m => {
      if (m && m.id) {
        if (!profileMap[m.id]) {
          profileMap[m.id] = { count: 0, totalConf: 0, firstSeen: sub.createdAt, lastSeen: sub.createdAt };
        }
        profileMap[m.id].count++;
        profileMap[m.id].totalConf += (m.confidence || 0);

        if (sub.createdAt && new Date(sub.createdAt) > new Date(profileMap[m.id].lastSeen)) {
          profileMap[m.id].lastSeen = sub.createdAt;
        }
      }
    });
  });

  // 2. Active Status (Unresolved if present in latest submission of any UNSOLVED question)
  const lastSubmissions = {};
  submissions.forEach(sub => {
    if (sub.questionId) {
      const qId = sub.questionId.toString();
      if (!lastSubmissions[qId] || new Date(sub.createdAt) > new Date(lastSubmissions[qId].createdAt)) {
        lastSubmissions[qId] = sub;
      }
    }
  });

  const activeMisconceptions = new Set();
  Object.values(lastSubmissions).forEach(sub => {
    // If question is not solved, any misconceptions in latest attempt are active
    if (sub.outcome !== 'solved' && sub.detectedMisconceptions) {
      sub.detectedMisconceptions.forEach(m => {
        if (m && m.id) activeMisconceptions.add(m.id);
      });
    }
  });

  const misconceptionProfile = Object.entries(profileMap).map(([id, data]) => ({
    id,
    count: data.count,
    avgConfidence: data.totalConf / data.count,
    status: activeMisconceptions.has(id) ? 'Unresolved' : 'Resolved',
    lastSeen: data.lastSeen
  })).sort((a, b) => (b.count * b.avgConfidence) - (a.count * a.avgConfidence)); // Sort by impact

  return {
    misconceptionFrequency,
    attemptsPerQuestion,
    misconceptionsOverTime,
    misconceptionProfile
  };
}

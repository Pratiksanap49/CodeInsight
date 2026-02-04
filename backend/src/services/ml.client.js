import fetch from "node-fetch";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8001";

export async function getConfidence(features, misconceptions) {
  try {
    const res = await fetch(`${ML_SERVICE_URL}/confidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features,
        misconceptions: misconceptions.map(m => ({ id: m.id }))
      }),
      timeout: 2000
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.misconceptions;
  } catch {
    return null;
  }
}

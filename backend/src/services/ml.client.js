const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

export async function getConfidence(features, misconceptions) {
  if (!ML_SERVICE_URL) return null;

  try {
    const res = await fetch(`${ML_SERVICE_URL}/confidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features,
        misconceptions: misconceptions.map(m => ({ id: m.id }))
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.misconceptions;
  } catch {
    return null;
  }
}

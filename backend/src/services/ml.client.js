const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

export async function getConfidence(features, misconceptions) {
  // 1. Safety check for the Environment Variable
  if (!ML_SERVICE_URL) {
    console.warn("ML_SERVICE_URL not defined. Skipping diagnostic handshake.");
    return null;
  }

  try {
    const res = await fetch(`${ML_SERVICE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features,
        code: features.code, 
        misconceptions: misconceptions.map(m => ({ id: m.id }))
      })
    });

    if (!res.ok) {
      console.error(`ML Service responded with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    
    return data.misconceptions; 
  } catch (error) {
    console.error("ML Service Handshake Error:", error.message);
    return null;
  }
}
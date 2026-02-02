const BASE_URL = "http://localhost:5000/api";

export async function getQuestions() {
  const res = await fetch(`${BASE_URL}/questions`);
  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }
  return res.json();
}

export async function submitCode(payload) {
  const res = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Submission failed");
  }

  return res.json();
}

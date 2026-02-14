const BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api` 
  : "http://localhost:5000/api";

function getHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function getQuestions() {
  const res = await fetch(`${BASE_URL}/questions`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function submitCode(payload) {
  const res = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Submission failed");
  return res.json();
}

export async function getAnalytics() {
  const res = await fetch(`${BASE_URL}/analytics`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}
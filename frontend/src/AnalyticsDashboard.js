import { useEffect, useState } from "react";
import { getAnalytics } from "./api";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <h2>Learning Analytics</h2>

      <h3>Misconception Frequency</h3>
      <ul>
        {Object.entries(analytics.misconceptionFrequency).map(
          ([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          )
        )}
      </ul>

      <h3>Attempts per Question</h3>
      <ul>
        {Object.entries(analytics.attemptsPerQuestion).map(
          ([qid, attempts]) => (
            <li key={qid}>
              Question {qid}: {attempts} attempts
            </li>
          )
        )}
      </ul>

      <h3>Misconceptions Over Time</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Time</th>
            <th>Misconceptions Count</th>
            <th>Avg Confidence</th>
          </tr>
        </thead>
        <tbody>
          {analytics.misconceptionsOverTime.map((row, idx) => (
            <tr key={idx}>
              <td>{new Date(row.createdAt).toLocaleString()}</td>
              <td>{row.count}</td>
              <td>{row.avgConfidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

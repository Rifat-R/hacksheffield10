import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading message...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error(err);
        setError("Could not reach the API. Is Flask running?");
      });
  }, []);

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Flask + Vite + React</p>
        <h1>Full-stack starter</h1>
        <p className="lead">
          This frontend uses Vite and proxies <code>/api</code> to a Flask
          backend running on <code>localhost:5000</code>.
        </p>
        <div className="status">
          <span className="label">API status</span>
          <p className="message">{error || message}</p>
        </div>
      </section>
    </main>
  );
}

export default App;

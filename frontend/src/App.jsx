
import { useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Activity,
  KeyRound,
} from "lucide-react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  async function analyzePassword(event) {
    event.preventDefault();
    setError("");
    setAnalysis(null);

    if (!password) {
      setError("Please enter a password to analyze.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          context_terms: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Could not analyze this password. Please check the input.");
      }

      const result = await response.json();
      setAnalysis(result);
    } catch {
      setError("Unable to connect to the backend. Make sure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  async function generatePassword() {
    setError("");
    setCopied(false);

    try {
      const response = await fetch(`${API}/api/generate-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ length: 16 }),
      });

      if (!response.ok) {
        throw new Error("Password generation failed.");
      }

      const result = await response.json();
      setGeneratedPassword(result.password);
    } catch {
      setError("Unable to generate a password. Check that the backend is running.");
    }
  }

  async function copyGeneratedPassword() {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
    } catch {
      setError("Clipboard access failed. Select and copy the generated password manually.");
    }
  }

  const score = analysis?.score ?? 0;
  const strength = analysis?.strength ?? "Not analyzed";
  const scoreColor =
    score <= 20 ? "#ef4444" :
    score <= 40 ? "#f97316" :
    score <= 60 ? "#eab308" :
    score <= 80 ? "#22c55e" : "#10b981";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><ShieldCheck size={25} /></div>
          <div>
            <h2>SecureCheck</h2>
            <span>Password Security Lab</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active">
          <Activity size={18} /> Password Analyzer
        </div>
        <div className="nav-item">
          <KeyRound size={18} /> Password Generator
        </div>

        <div className="sidebar-bottom">
          <div className="privacy-icon"><LockKeyhole size={20} /></div>
          <strong>Privacy first</strong>
          <p>Your password is analyzed in memory and is not intentionally saved by this application.</p>
          <span className="status"><i /> Local API connected by configuration</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">SECURITY WORKSPACE</span>
            <h1>Password Strength Analyzer</h1>
            <p>Understand password risks and improve your account security.</p>
          </div>
          <div className="secure-badge"><ShieldCheck size={16} /> Privacy-focused</div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple"><ShieldCheck size={21} /></div>
            <span>Analysis status</span>
            <strong>{analysis ? "Completed" : "Ready"}</strong>
            <small>On-demand analysis</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Activity size={21} /></div>
            <span>Security score</span>
            <strong>{analysis ? `${score}/100` : "—"}</strong>
            <small>Heuristic estimate</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><LockKeyhole size={21} /></div>
            <span>Password length</span>
            <strong>{analysis ? analysis.metrics.length : "—"}</strong>
            <small>Characters analyzed</small>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel analyzer-panel">
            <div className="panel-heading">
              <div>
                <span className="section-tag">01 / ANALYZE</span>
                <h2>Test your password</h2>
                <p>Use a test password. Avoid entering a password you currently use.</p>
              </div>
              <div className="heading-icon"><LockKeyhole size={23} /></div>
            </div>

            <form onSubmit={analyzePassword}>
              <label htmlFor="password">Password input</label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setAnalysis(null);
                  }}
                  placeholder="Enter a sample password..."
                  maxLength={256}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <div className="privacy-note">
                <LockKeyhole size={15} />
                Do not enter a real account password. Analysis is sent to your local backend.
              </div>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />}
                {loading ? "Analyzing..." : "Analyze password"}
              </button>
            </form>

            {error && <div className="error-message"><AlertTriangle size={17} />{error}</div>}

            <div className="result-section">
              <div className="result-heading">
                <h3>Analysis result</h3>
                <span className={`result-pill ${analysis ? "has-result" : ""}`}>
                  {analysis ? "Analyzed" : "Waiting for input"}
                </span>
              </div>

              <div className="score-row">
                <div className="score-number" style={{ color: analysis ? scoreColor : undefined }}>
                  {analysis ? score : "—"}
                  <small>/100</small>
                </div>
                <div className="score-details">
                  <strong>{strength}</strong>
                  <span>Estimated strength score</span>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${score}%`,
                        background: scoreColor,
                      }}
                    />
                  </div>
                </div>
              </div>

              {analysis && (
                <>
                  <div className="result-metrics">
                    <div><span>Character types</span><strong>{analysis.metrics.character_types}/4</strong></div>
                    <div><span>Estimated entropy</span><strong>{analysis.metrics.estimated_entropy_bits} bits</strong></div>
                  </div>

                  <h4>Detected risks</h4>
                  {analysis.findings.length ? (
                    <ul className="findings-list">
                      {analysis.findings.map((finding, index) => (
                        <li key={`${finding}-${index}`}>
                          <AlertTriangle size={16} /> {finding}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-result">No patterns were detected by these basic checks.</p>
                  )}

                  <h4>Security suggestions</h4>
                  <ul className="suggestions-list">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={`${suggestion}-${index}`}>
                        <Check size={16} /> {suggestion}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="right-column">
            <section className="panel generator-panel">
              <div className="panel-heading compact">
                <div>
                  <span className="section-tag">02 / GENERATE</span>
                  <h2>Secure password</h2>
                </div>
                <div className="heading-icon"><KeyRound size={22} /></div>
              </div>
              <p className="panel-description">
                Generate a random 16-character password using Python's secure random generator.
              </p>
              <button className="secondary-button" onClick={generatePassword}>
                <RefreshCw size={17} /> Generate password
              </button>

              {generatedPassword && (
                <div className="generated-output">
                  <label>Generated password</label>
                  <div className="generated-value">{generatedPassword}</div>
                  <button className="copy-button" onClick={copyGeneratedPassword}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy password"}
                  </button>
                </div>
              )}
            </section>

            <section className="panel guidance-panel">
              <div className="guidance-title">
                <Sparkles size={20} />
                <h2>Security checklist</h2>
              </div>
              <div className="checklist-item">
                <span className="check-circle">1</span>
                <div><strong>Use long passwords</strong><p>A unique passphrase or 16+ random characters is a useful target.</p></div>
              </div>
              <div className="checklist-item">
                <span className="check-circle">2</span>
                <div><strong>Never reuse passwords</strong><p>Use a different password for every account.</p></div>
              </div>
              <div className="checklist-item">
                <span className="check-circle">3</span>
                <div><strong>Enable multi-factor authentication</strong><p>Add another layer of protection to important accounts.</p></div>
              </div>
            </section>

            <section className="privacy-card">
              <ShieldCheck size={23} />
              <div><strong>Local-first analysis</strong><p>This demo sends the entered sample to your own local API at 127.0.0.1. Do not use real account credentials.</p></div>
            </section>
          </div>
        </section>

        <footer>SecureCheck · Educational security project · Heuristic results are estimates, not guarantees.</footer>
      </main>
    </div>
  );
}

export default App;